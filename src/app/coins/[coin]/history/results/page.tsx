'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AnalysisTable from '@/components/AnalysisTable';
import { PriceChart } from '@/components/PriceChart';
import { VolumeChart } from '@/components/VolumeChart';
import PDFReport from '@/components/PDFReport';
import { LoadingState } from '@/components/LoadingState';
import ErrorBoundary, { APIErrorFallback } from '@/components/ErrorBoundary';
import { fetchWithRetry, APIError } from '@/lib/error-handling';
import type { HistoryData } from '@/types/api';

export default function HistoryResultsPage() {
  const params = useParams();
  const coin = params.coin as string;
  const searchParams = useSearchParams();
  const [data, setData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [generating, setGenerating] = useState(false);
  const [clientExporting, setClientExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const interval = searchParams.get('interval');

  useEffect(() => {
    async function fetchData() {
      if (!from || !to || !interval) {
        setError(new Error('Missing required parameters'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          coin,
          from,
          to,
          interval,
        });

        const response = await fetchWithRetry(`/api/history?${params}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new APIError('Failed to fetch historical data', response.status);
        }

        const responseData: HistoryData[] = await response.json();
        setData(responseData);
      } catch (err: unknown) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [coin, from, to, interval]);

  // Server-side PDF generation (Puppeteer)
  const generateServerPDF = async () => {
    if (!from || !to || !interval) return;

    setGenerating(true);
    try {
      const pdfUrl = `/api/generate-pdf?coin=${coin}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&interval=${encodeURIComponent(interval)}`;

      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${coin}-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Client-side PDF export (html2canvas + jsPDF)
  const exportClientPDF = async () => {
    if (!reportRef.current || !from || !to) return;

    setClientExporting(true);
    try {
      // Add print styles temporarily
      reportRef.current.classList.add('print-mode');

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${coin}-client-report-${new Date().toISOString().split('T')[0]}.pdf`);

      // Remove print styles
      reportRef.current.classList.remove('print-mode');
    } catch (error) {
      console.error('Error exporting client PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setClientExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading historical data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Export Controls */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href={`/coins/${coin}/history`}
            className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            aria-label={`Go back to ${coin} history form`}
          >
            ← Back to History Form
          </Link>
          <div className="flex space-x-3">
            <button
              onClick={exportClientPDF}
              disabled={clientExporting || !data.length}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Export PDF using client-side generation"
            >
              {clientExporting ? 'Exporting...' : 'Client PDF Export'}
            </button>
            <button
              onClick={generateServerPDF}
              disabled={generating || !data.length}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Export PDF using server-side generation"
            >
              {generating ? 'Generating...' : 'Server PDF Export'}
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{coin} Analysis Results</h1>
          <p className="mt-2 text-gray-600">
            Showing {data.length} data points from {from?.split('T')[0]} to {to?.split('T')[0]}
            with {interval} intervals
          </p>
        </div>

        {/* Charts and Data */}
        <LoadingState loading={loading} error={error}>
          <ErrorBoundary fallback={APIErrorFallback}>
            <div className="space-y-6">
              <PriceChart data={data} />
              <VolumeChart data={data} />
              <AnalysisTable data={data} />
            </div>
          </ErrorBoundary>
        </LoadingState>

        {/* PDF Report Container for Client Export */}
        <div
          ref={reportRef}
          className="print-report-container mt-8 hidden"
          style={{
            backgroundColor: 'white',
            padding: '20mm',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <PDFReport coin={coin} from={from || ''} to={to || ''} data={data} />
        </div>
      </div>
    </div>
  );
}
