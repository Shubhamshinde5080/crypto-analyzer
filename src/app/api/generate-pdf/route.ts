// src/app/api/generate-pdf/route.ts

import { NextRequest } from 'next/server';
import { jsPDF } from 'jspdf';
import { fmtUSD } from '@/lib/format';

type ErrorResponse = { error: string; details?: string };

interface HistoryData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  pctChange: number | null;
}

async function fetchHistoryData(
  coin: string,
  from: string,
  to: string,
  interval: string
): Promise<HistoryData[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const apiUrl = `${baseUrl}/api/history?coin=${coin}&from=${from}&to=${to}&interval=${interval}`;

  const response = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'CryptoAnalyzer-PDF-Generator',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch history data: ${response.status}`);
  }

  return response.json();
}

function generatePDFReport(coin: string, from: string, to: string, data: HistoryData[]): Buffer {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text(`${coin.toUpperCase()} Analysis Report`, 20, 30);

  // Date range
  doc.setFontSize(12);
  doc.text(
    `Period: ${new Date(from).toLocaleDateString()} - ${new Date(to).toLocaleDateString()}`,
    20,
    45
  );

  // Summary statistics
  if (data.length > 0) {
    const prices = data.map((d) => d.close);
    const volumes = data.map((d) => d.volume);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const startPrice = data[0].close;
    const endPrice = data[data.length - 1].close;
    const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
    const avgVolume = totalVolume / data.length;

    const priceChange = endPrice - startPrice;
    const priceChangePercent = (priceChange / startPrice) * 100;

    doc.setFontSize(14);
    doc.text('Summary Statistics:', 20, 65);

    doc.setFontSize(10);
    doc.text(`Start Price: ${fmtUSD(startPrice)}`, 20, 80);
    doc.text(`End Price: ${fmtUSD(endPrice)}`, 20, 90);
    doc.text(`Price Change: ${fmtUSD(priceChange)} (${priceChangePercent.toFixed(2)}%)`, 20, 100);
    doc.text(`Min Price: ${fmtUSD(minPrice)}`, 20, 110);
    doc.text(`Max Price: ${fmtUSD(maxPrice)}`, 20, 120);
    doc.text(`Average Volume: ${avgVolume.toLocaleString()}`, 20, 130);
    doc.text(`Total Data Points: ${data.length}`, 20, 140);
  }

  // Recent data table
  doc.setFontSize(14);
  doc.text('Recent Data Points:', 20, 160);

  // Table headers
  doc.setFontSize(8);
  doc.text('Date', 20, 175);
  doc.text('Open', 50, 175);
  doc.text('High', 70, 175);
  doc.text('Low', 90, 175);
  doc.text('Close', 110, 175);
  doc.text('Volume', 130, 175);
  doc.text('Change %', 160, 175);

  // Table data (last 10 entries)
  const recentData = data.slice(-10);
  recentData.forEach((row, index) => {
    const y = 185 + index * 10;
    const date = new Date(row.timestamp).toLocaleDateString();

    doc.text(date, 20, y);
    doc.text(fmtUSD(row.open), 50, y);
    doc.text(fmtUSD(row.high), 70, y);
    doc.text(fmtUSD(row.low), 90, y);
    doc.text(fmtUSD(row.close), 110, y);
    doc.text(row.volume.toLocaleString(), 130, y);
    doc.text(row.pctChange ? `${row.pctChange.toFixed(2)}%` : 'N/A', 160, y);
  });

  // Footer
  doc.setFontSize(8);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 20, 280);
  doc.text('Crypto Analyzer - Professional Cryptocurrency Analysis', 20, 285);

  return Buffer.from(doc.output('arraybuffer'));
}

async function handleRequest(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coin = searchParams.get('coin');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const interval = searchParams.get('interval');

    if (!coin || !from || !to || !interval) {
      return Response.json(
        { error: 'Missing query params: coin, from, to, interval' } as ErrorResponse,
        { status: 400 }
      );
    }

    // Fetch the history data
    const data = await fetchHistoryData(coin, from, to, interval);

    // Generate PDF
    const pdfBuffer = generatePDFReport(coin, from, to, data);

    // Return PDF as response
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${coin}-analysis-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('PDF generation error:', error);
    return Response.json(
      { error: 'Failed to generate PDF', details: error.message } as ErrorResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}
