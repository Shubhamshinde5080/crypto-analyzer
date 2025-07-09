import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/Header';
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
    <html lang="en" className="h-full font-sans tracking-tight">
    <html lang="en" className="h-full font-sans">
      <body className="antialiased min-h-screen h-full bg-gradient-to-br from-primaryFrom to-primaryTo dark:from-gray-900 dark:to-slate-800">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <Header />
            <div className="min-h-screen text-gray-900 dark:text-gray-100">
              <div className="mx-auto max-w-7xl px-6">{children}</div>
            </div>
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
