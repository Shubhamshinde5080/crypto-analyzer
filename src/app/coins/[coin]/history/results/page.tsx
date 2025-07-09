// app/coins/[coin]/history/results/page.tsx
'use client';
/*
  Enhanced history‑results page
  – Tailwind v3 responsive design
  – Sticky action bar with back + export buttons
  – Suspense‑like skeleton loader
  – ErrorBoundary + graceful messaging
*/
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import AnalysisTable from '@/components/AnalysisTable';
import AnalysisSummary from '@/components/AnalysisSummary';
import PriceChart from '@/components/PriceChart';
import VolumeChart from '@/components/VolumeChart';
import PDFReport from '@/components/PDFReport';
import ErrorBoundary, { APIErrorFallback } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';
import Skeleton from '@/components/Skeleton';
import { fetchWithRetry, APIError } from '@/lib/error-handling';
import type { HistoryData } from '@/types/api';

export default function HistoryResultsPage() {
  /* ─────────────────────────────── hooks */
  const { coin } = useParams<{ coin: string }>();
  const sp = useSearchParams();
  const [data, setData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [generating, setGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const from = sp.get('from');
  const to = sp.get('to');
  const interval = sp.get('interval');

  /* ─────────────────────────────── data fetch */
  useEffect(() => {
    if (!from || !to || !interval) {
      setError(new Error('Missing required query parameters.'));
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ coin, from, to, interval });
        const res = await fetchWithRetry(`/api/history?${qs}`);
        if (!res.ok) throw new APIError('Failed to fetch data', res.status);
        setData(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    })();
  }, [coin, from, to, interval]); /* ─────────────────────────────── pdf export */
  const handleExport = async () => {
    if (!from || !to || !interval) return;
    setGenerating(true);
    try {
      const url = `/api/generate-pdf?coin=${coin}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&interval=${interval}`;
      const res = await fetch(url);

      if (res.status === 503) {
        // PDF service temporarily unavailable, redirect to print page
        const printUrl = `/coins/${coin}/history/print?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&interval=${interval}`;
        window.open(printUrl, '_blank');
        return;
      }

      if (!res.ok) throw new Error(`${res.status}`);
      const blob = await res.blob();
      const fileURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = `${coin}-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error(err);
      // Fallback to print page with user-friendly message
      const printUrl = `/coins/${coin}/history/print?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&interval=${interval}`;
      window.open(printUrl, '_blank');

      // Show user-friendly message
      setTimeout(() => {
        alert(
          "PDF generation is temporarily unavailable. A print-optimized page has been opened - please use your browser's print function (Ctrl+P or Cmd+P) to save as PDF."
        );
      }, 500);
    } finally {
      setGenerating(false);
    }
  };

  /* ─────────────────────────────── ui */
  const Header = () => (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center justify-between">
      <Link
        href={`/coins/${coin}/history`}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
      >
        ← Back to form
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">
          {from?.slice(0, 10)} → {to?.slice(0, 10)} / {interval}
        </span>
        <button
          onClick={handleExport}
          disabled={generating || !data.length}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-1.5 text-white text-sm disabled:opacity-50"
        >
          {generating && (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          )}
          Export PDF
        </button>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {loading && <Skeleton />}

        <LoadingState loading={loading} error={error}>
          <ErrorBoundary fallback={APIErrorFallback}>
            <h1 className="sr-only">{coin} analysis results</h1>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="sm:col-span-2">
                <AnalysisSummary data={data} coin={coin} />
              </div>
              <PriceChart data={data} />
              <VolumeChart data={data} />
              <div className="sm:col-span-2">
                <AnalysisTable data={data} />
              </div>
            </div>
          </ErrorBoundary>
        </LoadingState>
      </main>

      {/* hidden container for client‑side PDF capture */}
      <div ref={printRef} className="hidden">
        <PDFReport coin={coin} from={from ?? ''} to={to ?? ''} data={data} />
      </div>
    </div>
  );
}
