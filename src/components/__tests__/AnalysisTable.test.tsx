import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import AnalysisTable from '@/components/AnalysisTable';
import type { HistoryData } from '@/types/api';

const mockHistoryData: HistoryData[] = [
  {
    timestamp: '2024-01-01T00:00:00Z',
    open: 44000,
    high: 45500,
    low: 43500,
    close: 45000,
    volume: 1_000_000_000,
    pctChange: 2.5,
  },
  {
    timestamp: '2024-01-02T00:00:00Z',
    open: 45000,
    high: 46500,
    low: 45000,
    close: 46000,
    volume: 1_100_000_000,
    pctChange: -1.2,
  },
];

const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {ui}
    </ThemeProvider>
  );

describe('AnalysisTable', () => {
  it('does not render when no data', () => {
    renderWithTheme(<AnalysisTable data={[]} />);
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('renders table with data', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(mockHistoryData.length + 1);
  });

  it('formats values correctly', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);
    expect(screen.getByText('$44,000.0000')).toBeInTheDocument();
    expect(screen.getByText('$45,500.0000')).toBeInTheDocument();
    expect(screen.getByText('1,000,000,000')).toBeInTheDocument();
  });

  it('handles null pctChange', () => {
    const mock: HistoryData[] = [{ ...mockHistoryData[0], pctChange: null }];
    renderWithTheme(<AnalysisTable data={mock} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('has correct a11y roles', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
  });
});
