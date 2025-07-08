import type { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
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
    <html lang="en" className="h-full">
      <body className="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen h-full">
        <ThemeProvider>
          <ErrorBoundary>
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    📈 Crypto Analyzer
                  </h1>
                  <div className="flex items-center space-x-4">
                    <nav className="text-sm text-gray-500 dark:text-gray-400">
                      Professional Cryptocurrency Analysis
                    </nav>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</main>
            <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-300 dark:text-gray-400">
                  © 2025 Crypto Analyzer. Data provided by CoinGecko API.
                </p>
              </div>
            </footer>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
