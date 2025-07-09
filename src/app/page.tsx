import CoinList from '@/components/CoinList';
import Card from '@/components/Card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Analyzer',
  description: 'Professional cryptocurrency analysis and tracking application',
};

export default function Home() {
  return (
    <main>
      <section className="grid md:grid-cols-2 gap-8 py-16 items-center text-white">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Professional Crypto Analysis</h1>
          <p className="text-lg mb-6">Track market trends and export detailed PDF reports.</p>
          <a href="#coins" className="btn btn-primary">
            Get Started
          </a>
        </div>
        <div className="relative h-64 md:h-80">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-primaryFrom to-primaryTo opacity-70 mix-blend-overlay"
            style={{ filter: 'blur(120px)' }}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primaryFrom to-primaryTo opacity-70 mix-blend-overlay blur-3xl" />
        </div>
      </section>
      <section
        id="coins"
        className="p-6 bg-white/70 dark:bg-slate-700/60 rounded-2xl backdrop-blur-md"
      >
        <CoinList />
      </section>
      <div className="my-16 grid md:grid-cols-2 gap-8">
        <Card>
          <h2 id="about" className="text-2xl font-semibold mb-2">
            About Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We provide in-depth cryptocurrency analytics and easy PDF exports for your reports.
          </p>
        </Card>
        <Card>
          <h2 id="services" className="text-2xl font-semibold mb-2">
            Our Services
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Charting, historical analysis and automated report generation at your fingertips.
          </p>
        </Card>
      </div>
      <Card>
        <h2 id="contact" className="text-2xl font-semibold mb-2">
          Contact
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Reach out at support@example.com for inquiries.
        </p>
      </Card>
    </main>
  );
}
