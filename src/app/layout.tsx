import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crypto Analyzer',
  description: 'Professional cryptocurrency analysis and tracking application with PDF reports',
  keywords: ['cryptocurrency', 'bitcoin', 'analysis', 'charts', 'PDF', 'reports'],
  authors: [{ name: 'Crypto Analyzer Team' }],
  openGraph: {
    title: 'Crypto Analyzer',
    description: 'Professional cryptocurrency analysis and tracking application',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 min-h-screen">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-xl font-bold text-gray-900">📈 Crypto Analyzer</h1>
              <nav className="text-sm text-gray-500">Professional Cryptocurrency Analysis</nav>
            </div>
          </div>
        </div>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-300">
              © 2025 Crypto Analyzer. Data provided by CoinGecko API.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
