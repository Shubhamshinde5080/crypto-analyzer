import { render, screen } from '@testing-library/react';
import AnalysisTable from '@/components/AnalysisTable';
import { ThemeProvider } from '@/components/ThemeProvider';
import type { HistoryData } from '@/types/api';

// Mock data
const mockHistoryData: HistoryData[] = [
  {
    timestamp: '2024-01-01T00:00:00Z',
    open: 44000,
    high: 45500,
    low: 43500,
    close: 45000,
    volume: 1000000000,
    pctChange: 2.5,
  },
  {
    timestamp: '2024-01-02T00:00:00Z',
    open: 45000,
    high: 46500,
    low: 45000,
    close: 46000,
    volume: 1100000000,
    pctChange: -1.2,
  },
];

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AnalysisTable', () => {
  it('renders empty state when no data', () => {
    renderWithTheme(<AnalysisTable data={[]} />);

    const rows = screen.getAllByRole('row');
    // header row only
    expect(rows).toHaveLength(1);
  });

  it('renders table with data', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('% Change')).toBeInTheDocument();
  });

  it('formats prices correctly', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    expect(screen.getByText('$44,000.0000')).toBeInTheDocument(); // open
    expect(screen.getByText('$45,500.0000')).toBeInTheDocument(); // high
    expect(screen.getByText('$43,500.0000')).toBeInTheDocument(); // low
    // Multiple $45,000.0000 values exist (close for first row, open for second row, low for second row)
    expect(screen.getAllByText('$45,000.0000')).toHaveLength(3);
  });

  it('formats volumes correctly', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    expect(screen.getByText('1,000,000,000')).toBeInTheDocument();
    expect(screen.getByText('1,100,000,000')).toBeInTheDocument();
  });

  it('formats market cap correctly', () => {
    // This test is not applicable since AnalysisTable doesn't show market cap
    // Removing this test
  });

  it('shows positive changes in green with up arrow', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    const badge = screen.getByText('2.50%').closest('span.badge-success');
    expect(badge).toBeInTheDocument();
  });

  it('shows negative changes in red with down arrow', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    const negBadge = screen.getByText('1.20%').closest('span.badge-error');
    expect(negBadge).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    expect(screen.getByText('Jan 01, 00:00')).toBeInTheDocument();
    expect(screen.getByText('Jan 02, 00:00')).toBeInTheDocument();
  });

  it('handles null change values', () => {
    const dataWithNullChange: HistoryData[] = [
      {
        timestamp: '2024-01-01T00:00:00Z',
        open: 44000,
        high: 45500,
        low: 43500,
        close: 45000,
        volume: 1000000000,
        pctChange: null,
      },
    ];

    renderWithTheme(<AnalysisTable data={dataWithNullChange} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(7); // Updated count for actual columns

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // 1 header + 2 data rows
  });

  it('applies dark mode styles correctly', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    const container = screen.getByRole('table').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-white', 'dark:bg-gray-800');
  });

  it('renders responsive table', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    const tableContainer = screen.getByRole('table').closest('div');
    expect(tableContainer).toHaveClass('overflow-auto');
  });
});
