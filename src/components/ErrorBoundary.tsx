'use client';

import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Report to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry or other monitoring service
      // Sentry.captureException(error, { contexts: { errorInfo } });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div
      className="min-h-[400px] flex items-center justify-center p-6"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ExclamationTriangleIcon
          className="h-12 w-12 text-red-600 mx-auto mb-4"
          aria-hidden="true"
        />
        <h2 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h2>
        <p className="text-red-700 mb-4 text-sm">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="space-y-2">
          <button
            onClick={resetError}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            aria-label="Try again"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            Try Again
          </button>
          <div className="text-xs text-red-600">
            If this problem persists, please contact support.
          </div>
        </div>
      </div>
    </div>
  );
}

// Specific error fallback for API errors
export function APIErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');

  return (
    <div
      className="min-h-[300px] flex items-center justify-center p-6"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-lg w-full bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <ExclamationTriangleIcon
          className="h-10 w-10 text-yellow-600 mx-auto mb-3"
          aria-hidden="true"
        />
        <h3 className="text-md font-medium text-yellow-900 mb-2">
          {isNetworkError ? 'Connection Problem' : 'Data Loading Error'}
        </h3>
        <p className="text-yellow-700 mb-4 text-sm">
          {isNetworkError
            ? 'Unable to connect to the cryptocurrency data service. Please check your internet connection.'
            : 'There was a problem loading the cryptocurrency data. This might be temporary.'}
        </p>
        <button
          onClick={resetError}
          className="inline-flex items-center px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm"
          aria-label="Retry loading data"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
