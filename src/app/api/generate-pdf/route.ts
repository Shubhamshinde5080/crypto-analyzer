// src/app/api/generate-pdf/route.ts

import puppeteer from 'puppeteer';
import { NextRequest } from 'next/server';

type ErrorResponse = { error: string; details?: string };

export async function GET(request: NextRequest) {
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

    // Construct absolute URL for the print page
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    const baseURL = `${protocol}://${host}`;
    const printURL =
      `${baseURL}/coins/${coin}/history/print` +
      `?from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}` +
      `&interval=${encodeURIComponent(interval)}`;

    // Launch headless browser
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 800 });

    // Navigate to print page and wait for content
    await page.goto(printURL, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for charts to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
      preferCSSPageSize: true,
    });

    await browser.close();

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${coin}-analysis-${timestamp}.pdf`;

    // Return PDF response
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
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
