'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import type { HistoryData } from '@/types/api';

interface PriceChartProps {
  data: HistoryData[];
  title?: string;
}

export function PriceChart({ data, title = 'Price Chart' }: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-center">No price data available for chart</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    time: format(new Date(d.timestamp), 'MM-dd HH:mm'),
    price: d.close,
    open: d.open,
    high: d.high,
    low: d.low,
    timestamp: d.timestamp,
  }));

  const minPrice = Math.min(...data.map((d) => Math.min(d.low, d.open, d.close, d.high)));
  const maxPrice = Math.max(...data.map((d) => Math.max(d.low, d.open, d.close, d.high)));
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1; // 10% padding

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ payload: { price: number; high: number; low: number; open: number } }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Time: ${label}`}</p>
          <p className="text-blue-600">{`Close: $${data.price.toFixed(2)}`}</p>
          <p className="text-green-600">{`High: $${data.high.toFixed(2)}`}</p>
          <p className="text-red-600">{`Low: $${data.low.toFixed(2)}`}</p>
          <p className="text-gray-600">{`Open: $${data.open.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div
        className="w-full h-80"
        role="img"
        aria-label={`Price chart showing ${data.length} data points`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            aria-label="Price over time line chart"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => value.split(' ')[1]} // Show only time
              aria-label="Time axis"
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              domain={[minPrice - padding, maxPrice + padding]}
              aria-label="Price axis"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#3B82F6' }}
              aria-label="Price line"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
