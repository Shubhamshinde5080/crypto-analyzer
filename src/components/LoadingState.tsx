import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      <span className="sr-only">{message}</span>
      {message && (
        <p className="mt-2 text-sm text-gray-600" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({ lines = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded mb-3 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

interface LoadingStateProps {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

export function LoadingState({
  loading,
  error,
  children,
  loadingComponent,
  errorComponent,
}: LoadingStateProps) {
  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        {errorComponent || (
          <div className="text-center py-8 text-red-600">
            <p>Error: {error.message}</p>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div role="status" aria-live="polite">
        {loadingComponent || <LoadingSpinner />}
      </div>
    );
  }

  return <>{children}</>;
}
