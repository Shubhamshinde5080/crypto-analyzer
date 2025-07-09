import type { HistoryData } from '@/types/api';

const mockHistory: HistoryData[] = [
  {
    timestamp: '2024-01-01T00:00:00Z',
    open: 44000,
    high: 45000,
    low: 43500,
    close: 44500,
    volume: 800000000,
    pctChange: null,
  },
  {
    timestamp: '2024-01-01T01:00:00Z',
    open: 44500,
    high: 45200,
    low: 44000,
    close: 45000,
    volume: 600000000,
    pctChange: 1.12,
  },
  {
    timestamp: '2024-01-01T02:00:00Z',
    open: 45000,
    high: 45500,
    low: 44800,
    close: 45200,
    volume: 500000000,
    pctChange: 0.44,
  },
  {
    timestamp: '2024-01-01T03:00:00Z',
    open: 45200,
    high: 46000,
    low: 45100,
    close: 45800,
    volume: 900000000,
    pctChange: 1.33,
  },
  {
    timestamp: '2024-01-01T04:00:00Z',
    open: 45800,
    high: 46200,
    low: 45750,
    close: 46000,
    volume: 700000000,
    pctChange: 0.44,
  },
];

export default mockHistory;
