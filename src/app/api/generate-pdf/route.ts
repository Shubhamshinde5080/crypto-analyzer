// src/app/api/generate-pdf/route.ts

import { NextRequest } from 'next/server';

type ErrorResponse = { error: string; details?: string };

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

    // For now, return a simple response indicating PDF generation is not available
    // This prevents the 405 error while we work on a solution
    return Response.json(
      {
        error: 'PDF generation temporarily unavailable',
        details:
          'Please use the print functionality in your browser instead. Go to the print page and use Ctrl+P or Cmd+P.',
      } as ErrorResponse,
      { status: 503 }
    );
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
