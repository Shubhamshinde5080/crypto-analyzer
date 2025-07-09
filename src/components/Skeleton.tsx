'use client';
import React from 'react';

export default function Skeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden="true">
      <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}
