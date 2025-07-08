import Link from 'next/link';
import HistoryForm from '@/components/HistoryForm';
import { Metadata } from 'next';

type CoinHistoryPageProps = {
  params: Promise<{ coin: string }>;
};

export async function generateMetadata({ params }: CoinHistoryPageProps): Promise<Metadata> {
  const { coin } = await params;
  return {
    title: `${coin.toUpperCase()} Historical Analysis - Crypto Analyzer`,
    description: `Analyze historical price and volume data for ${coin}`,
  };
}

export default async function CoinHistoryPage({ params }: CoinHistoryPageProps) {
  const { coin } = await params;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Coin List
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {coin} Historical Analysis
          </h1>
          <p className="mt-2 text-gray-600">
            Select a date range and interval to analyze historical price and volume data.
          </p>
        </div>

        {/* History Form */}
        <HistoryForm coin={coin} />

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">How to use:</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Select a start and end date/time for your analysis</li>
            <li>• Choose a time interval (15 minutes to 1 day)</li>
            <li>• Click &quot;Analyze Historical Data&quot; to view charts and detailed data</li>
            <li>• Export your analysis as a PDF report</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
