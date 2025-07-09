'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import PDFReport from '@/components/PDFReport';
import { LoadingState } from '@/components/LoadingState';

interface HistoryData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  pctChange: number | null;
}

export default function PrintPage() {
  const { coin } = useParams<{ coin: string }>();
  const searchParams = useSearchParams();
  const [data, setData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const interval = searchParams.get('interval');

  useEffect(() => {
    if (!coin || !from || !to || !interval) {
      setError(new Error('Missing required parameters'));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiURL = `/api/history?coin=${coin}&from=${from}&to=${to}&interval=${interval}`;
        console.log('Fetching data from:', apiURL);

        const response = await fetch(apiURL, {
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (err) {
        console.error('Error fetching analysis data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coin, from, to, interval]);

  if (!coin || !from || !to || !interval) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Parameters</h1>
        <p className="text-gray-600">Missing required parameters for analysis.</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      <LoadingState loading={loading} error={error}>
        <PDFReport coin={coin} from={from} to={to} data={data} />
      </LoadingState>
    </div>
  );
}
