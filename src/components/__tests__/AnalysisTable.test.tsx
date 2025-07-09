import { render, screen } from '@testing-library/react';
import AnalysisTable from '@/components/AnalysisTable';
import { ThemeProvider } from '@/components/ThemeProvider';
import type { HistoryData } from '@/types/api';

// ─── Mock data ──────────────────────────────────────────────
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
  render(<ThemeProvider>{ui}</ThemeProvider>);

// ─── Tests ──────────────────────────────────────────────────
describe('AnalysisTable', () => {
  it('renders header row only when no data', () => {
    renderWithTheme(<AnalysisTable data={[]} />);

    // one header row present
    expect(screen.getAllByRole('row')).toHaveLength(1);
  });

  it('renders table with data & headers', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    ['Time','Open','High','Low','Close','Volume','% Change'].forEach(h =>
      expect(screen.getByText(h)).toBeInTheDocument()
    );
  });

  it('formats 4‑decimal USD prices', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    expect(screen.getByText('$44,000.0000')).toBeInTheDocument();
    expect(screen.getByText('$45,500.0000')).toBeInTheDocument();
    expect(screen.getByText('$43,500.0000')).toBeInTheDocument();
    expect(screen.getAllByText('$45,000.0000')).toHaveLength(3);
  });

  it('formats volumes with thousands separator', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    expect(screen.getByText('1,000,000,000')).toBeInTheDocument();
    expect(screen.getByText('1,100,000,000')).toBeInTheDocument();
  });

  it('shows positive change with up icon and green color', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);


    const badge = screen.getByText('2.50%').closest('span.badge-success');
    expect(badge).toBeInTheDocument();
    const positiveChange = screen.getByText('2.50%');
    const icon = positiveChange.previousSibling as HTMLElement;
    expect(icon).toHaveClass('text-green-600');

    const positiveCell = screen.getByText('2.50%').closest('td');
    expect(positiveCell?.querySelector('svg')).toHaveClass('text-green-600');
  });

  it('shows negative change with down icon and red color', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    const negBadge = screen.getByText('1.20%').closest('span.badge-error');
    expect(negBadge).toBeInTheDocument();
    const negativeChange = screen.getByText('1.20%');
    const negIcon = negativeChange.previousSibling as HTMLElement;
    expect(negIcon).toHaveClass('text-red-600');

    const negativeCell = screen.getByText('1.20%').closest('td');
    expect(negativeCell?.querySelector('svg')).toHaveClass('text-red-600');
  });

  it('formats dates correctly', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    expect(screen.getByText('Jan 01, 00:00')).toBeInTheDocument();
    expect(screen.getByText('Jan 02, 00:00')).toBeInTheDocument();
  });

  it('gracefully handles null pctChange', () => {
    const mock: HistoryData[] = [{ ...mockHistoryData[0], pctChange: null }];
    renderWithTheme(<AnalysisTable data={mock} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('has correct table a11y roles', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('renders inside responsive container', () => {
    renderWithTheme(<AnalysisTable data={mockHistoryData} />);

    const tableContainer = screen.getByRole('table').closest('div');
    expect(tableContainer).toHaveClass('overflow-auto');

    const tableWrapper = screen.getByRole('table').parentElement;
    expect(tableWrapper).toHaveClass('overflow-auto');
  });
});
