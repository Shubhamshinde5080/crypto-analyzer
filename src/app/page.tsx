import CoinList from '@/components/CoinList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Analyzer',
  description: 'Professional cryptocurrency analysis and tracking application',
};

export default function Home() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <CoinList />
    </main>
  );
}
