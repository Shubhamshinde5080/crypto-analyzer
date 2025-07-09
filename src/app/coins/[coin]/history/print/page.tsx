import PDFReport from '@/components/PDFReport';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'; // always fetch fresh data

interface HistoryData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  pctChange: number | null;
}

async function fetchAnalysisData(
  coin: string,
  from: string,
  to: string,
  interval: string
): Promise<HistoryData[]> {
  try {
    // Use the same host as the current request
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000';

    const apiURL = `${baseUrl}/api/history?coin=${coin}&from=${from}&to=${to}&interval=${interval}`;
    console.log('Fetching data from:', apiURL);

    const response = await fetch(apiURL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'CryptoAnalyzer-PDF-Generator',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    throw error;
  }
}

interface PrintPageProps {
  params: Promise<{ coin: string }>;
  searchParams: Promise<{ from: string; to: string; interval: string }>;
}

export default async function PrintPage({ params, searchParams }: PrintPageProps) {
  const { coin } = await params;
  const { from, to, interval } = await searchParams;

  if (!coin || !from || !to || !interval) {
    notFound();
  }

  let data: HistoryData[];
  try {
    data = await fetchAnalysisData(coin, from, to, interval);
  } catch (error) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h1>
        <p className="text-gray-600">
          Failed to fetch analysis data: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      <PDFReport coin={coin} from={from} to={to} data={data} />
    </div>
  );
}
