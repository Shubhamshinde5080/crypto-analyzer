import { render, screen } from '@testing-library/react';
import { LoadingSpinner, LoadingSkeleton, LoadingState } from '@/components/LoadingState';
import { ThemeProvider } from '@/components/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    renderWithTheme(<LoadingSpinner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    renderWithTheme(<LoadingSpinner message="Please wait..." />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = renderWithTheme(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <LoadingSpinner size="lg" />
      </ThemeProvider>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('LoadingSkeleton', () => {
  it('renders with default lines', () => {
    renderWithTheme(<LoadingSkeleton />);

    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });

  it('renders with custom number of lines', () => {
    renderWithTheme(<LoadingSkeleton lines={5} />);

    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });
});

describe('LoadingState', () => {
  it('renders children when not loading and no error', () => {
    renderWithTheme(
      <LoadingState loading={false}>
        <div>Content loaded</div>
      </LoadingState>
    );

    expect(screen.getByText('Content loaded')).toBeInTheDocument();
  });

  it('renders loading spinner when loading', () => {
    renderWithTheme(
      <LoadingState loading={true}>
        <div>Content loaded</div>
      </LoadingState>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Content loaded')).not.toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    const error = new Error('Test error');

    renderWithTheme(
      <LoadingState loading={false} error={error}>
        <div>Content loaded</div>
      </LoadingState>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Error: Test error/i)).toBeInTheDocument();
    expect(screen.queryByText('Content loaded')).not.toBeInTheDocument();
  });

  it('renders custom loading component', () => {
    const customLoading = <div>Custom loading...</div>;

    renderWithTheme(
      <LoadingState loading={true} loadingComponent={customLoading}>
        <div>Content loaded</div>
      </LoadingState>
    );

    expect(screen.getByText('Custom loading...')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders custom error component', () => {
    const error = new Error('Test error');
    const customError = <div>Custom error: {error.message}</div>;

    renderWithTheme(
      <LoadingState loading={false} error={error} errorComponent={customError}>
        <div>Content loaded</div>
      </LoadingState>
    );

    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
  });
});
