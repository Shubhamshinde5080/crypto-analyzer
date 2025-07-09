'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

type HistoryFormProps = {
  coin: string;
};

type IntervalType = '15m' | '30m' | '1h' | '4h' | '6h' | '1d';

export default function HistoryForm({ coin }: HistoryFormProps) {
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [interval, setInterval] = useState<IntervalType>('1h');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!from) {
      newErrors.from = 'Start date is required';
    }

    if (!to) {
      newErrors.to = 'End date is required';
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const now = new Date();

      if (fromDate >= toDate) {
        newErrors.to = 'End date must be after start date';
      }

      if (toDate > now) {
        newErrors.to = 'End date cannot be in the future';
      }

      // Check reasonable time range (not more than 1 year)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      if (fromDate < oneYearAgo) {
        newErrors.from = 'Start date cannot be more than 1 year ago';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fromISO = new Date(from).toISOString();
      const toISO = new Date(to).toISOString();
      router.push(
        `/coins/${coin}/history/results?from=${fromISO}&to=${toISO}&interval=${interval}`
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">Historical Data Analysis</h2>

      {errors.general && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
          role="alert"
        >
          <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="from-date" className="block text-sm text-gray-500 mb-2">
            From Date & Time:
          </label>
          <input
            id="from-date"
            type="datetime-local"
            required
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={`input w-full max-w-xs ${errors.from ? 'border-red-500' : 'border-gray-300'}`}
            aria-describedby={errors.from ? 'from-error' : undefined}
            aria-invalid={!!errors.from}
          />
          {errors.from && (
            <p id="from-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.from}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="to-date" className="block text-sm text-gray-500 mb-2">
            To Date & Time:
          </label>
          <input
            id="to-date"
            type="datetime-local"
            required
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={`input w-full max-w-xs ${errors.to ? 'border-red-500' : 'border-gray-300'}`}
            aria-describedby={errors.to ? 'to-error' : undefined}
            aria-invalid={!!errors.to}
          />
          {errors.to && (
            <p id="to-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.to}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="interval" className="block text-sm text-gray-500 mb-2">
            Time Interval:
          </label>
          <select
            id="interval"
            value={interval}
            onChange={(e) => setInterval(e.target.value as IntervalType)}
            className="input w-full max-w-xs"
            aria-describedby="interval-help"
          >
            <option value="15m">15 minutes</option>
            <option value="30m">30 minutes</option>
            <option value="1h">1 hour</option>
            <option value="4h">4 hours</option>
            <option value="6h">6 hours</option>
            <option value="1d">1 day</option>
          </select>
          <p id="interval-help" className="mt-1 text-sm text-gray-500">
            Select the time interval for historical data analysis
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full sm:w-auto"
          aria-describedby="submit-help"
        >
          {isSubmitting ? 'Analyzing...' : 'Analyze Historical Data'}
        </button>
        <p id="submit-help" className="mt-1 text-sm text-gray-500">
          Generate historical analysis report for {coin}
        </p>
      </form>
    </div>
  );
}
