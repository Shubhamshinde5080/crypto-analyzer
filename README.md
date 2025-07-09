# Crypto Analyzer

A professional, production-ready Next.js 15+ cryptocurrency analysis application built with TypeScript, Tailwind CSS, and comprehensive developer tooling.

## 🚀 Features

- **Real-time Crypto Data**: Fetch and analyze cryptocurrency data from Binance API
- **Historical Analysis**: View OHLCV data with customizable time intervals
- **Interactive Charts**: Price and volume charts powered by Recharts
- **PDF Export**: Both client-side (html2canvas + jsPDF) and server-side (Puppeteer) PDF generation
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **TypeScript**: Fully typed for better developer experience and code quality
- **Production Ready**: Optimized for Vercel deployment with proper error handling
- **🆕 Performance Caching**: Redis-based caching reduces API calls and improves response times
- **🆕 Error Handling**: Comprehensive error boundaries and retry logic with exponential backoff
- **🆕 Accessibility**: Full ARIA support, keyboard navigation, and screen reader compatibility
- **🆕 Dark Mode**: Beautiful dark/light theme toggle with system preference detection
- **🆕 Loading States**: Skeleton loading and comprehensive error states throughout the app
- **🆕 Type Safety**: Enhanced TypeScript coverage with strict type checking

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PDF Generation**: html2canvas, jsPDF, Puppeteer
- **Data Fetching**: Axios
- **Date Handling**: date-fns
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd crypto-analyzer
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   The `.env.local` file is already configured. If you need to modify it:

   ```bash
   # Edit .env.local if needed
   nano .env.local
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 🎯 Usage

### 1. Coin Selection

- Browse the paginated list of top cryptocurrencies
- Use the search functionality to find specific coins
- Click "View History" to analyze a coin

### 2. Historical Analysis

- Select date range and time interval
- View comprehensive OHLCV data in table format
- Analyze price and volume trends with interactive charts

### 3. PDF Export

- **Client-side**: Download PDF directly in browser (faster)
- **Server-side**: Generate PDF on server (higher quality, Vercel compatible)

## 🏗️ Project Structure

```
crypto-analyzer/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── history/       # Historical data endpoint
│   │   │   └── generate-pdf/  # PDF generation endpoint
│   │   ├── coins/[coin]/
│   │   │   └── history/       # Coin-specific analysis pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/            # Reusable React components
│   │   ├── CoinList.tsx       # Cryptocurrency list with pagination
│   │   ├── HistoryForm.tsx    # Date/interval selection form
│   │   ├── AnalysisTable.tsx  # OHLCV data table
│   │   ├── PriceChart.tsx     # Price line chart
│   │   ├── VolumeChart.tsx    # Volume bar chart
│   │   └── PDFReport.tsx      # PDF layout component
│   └── types/                 # TypeScript type definitions
│       ├── api.ts             # API types for crypto data
│       └── next-override.d.ts # Next.js type overrides
├── public/                    # Static assets
├── .vscode/                  # VS Code settings and extensions
├── vercel.json               # Vercel deployment configuration
└── package.json              # Dependencies and scripts
```

## 🚀 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "feat: complete crypto analyzer"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main

3. **Environment Variables**:
   - `COINGECKO_API_URL`: https://api.coingecko.com/api/v3

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔧 Configuration

### Tailwind CSS

- Custom configuration in `tailwind.config.js`
- Includes forms and typography plugins
- Optimized for production builds

### TypeScript

- Strict type checking enabled
- Path aliases configured for clean imports
- Comprehensive type definitions

### Code Quality

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance
- **lint-staged**: Staged file linting and formatting

## 📊 API Endpoints

### GET `/api/history`

Fetch historical OHLCV data for a cryptocurrency.

**Parameters**:

- `coin`: Cryptocurrency ID (e.g., "bitcoin")
- `from`: Start date (ISO string)
- `to`: End date (ISO string)
- `interval`: Time interval ("1h", "4h", "1d", etc.)

**Response**:

```json
[
  {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "open": 50000,
    "high": 51000,
    "low": 49500,
    "close": 50500,
    "volume": 1000000,
    "pctChange": 1.5
  }
]
```

### POST `/api/generate-pdf`

Generate PDF report using Puppeteer (server-side).

**Body**:

```json
{
  "coin": "bitcoin",
  "from": "2025-01-01T00:00:00.000Z",
  "to": "2025-01-02T00:00:00.000Z",
  "interval": "1h"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 in use**:

   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Build errors**:

   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

3. **Puppeteer memory issues on Vercel**:
   - Memory allocation is configured in `vercel.json`
   - Maximum function duration is set to 30 seconds

4. **TypeScript errors**:

   ```bash
   # Check types without building
   npx tsc --noEmit
   ```

5. **Environment variable issues**:

   ```bash
   # Verify .env.local exists and has correct values
   cat .env.local
   ```

6. **Image loading errors**:
   - Ensure CoinGecko domains are configured in `next.config.ts`
   - Check network connectivity to external image URLs

### Debug Mode

```bash
# Run with debug output
DEBUG=* npm run dev

# Check API responses
curl -X GET "http://localhost:3000/api/history?coin=bitcoin&from=2024-01-01&to=2024-01-02&interval=1h"
```

### Performance Issues

- **Slow API responses**: Check Binance API status and rate limits
- **Large bundle size**: Analyze with `npm run analyze` (if configured)
- **Memory leaks**: Monitor with browser DevTools Performance tab

## 🎨 Customization

### Adding New Cryptocurrency Exchanges

1. Update API endpoints in `/src/app/api/history/route.ts`
2. Modify data transformation logic
3. Update TypeScript interfaces in `/src/types/api.ts`

### Styling Changes

1. Edit Tailwind classes in components
2. Update `tailwind.config.js` for theme customization
3. Modify global styles in `src/app/globals.css`

### Performance Monitoring

1. **Client-side**: Web Vitals tracking with Next.js analytics
2. **Server-side**: API response time monitoring
3. **Error tracking**: Production error logging and alerts

## 🧪 Testing Strategy

### Unit Testing

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

### Integration Testing

- API route testing with mock data
- Component integration with React Testing Library
- Form submission and data flow validation

### E2E Testing

```bash
# Install Cypress
npm install --save-dev cypress

# Run E2E tests
npm run cypress:open
```

### Test Coverage Goals

- **Components**: 80%+ coverage for critical UI components
- **API Routes**: 90%+ coverage for data processing logic
- **Integration**: Key user flows covered by E2E tests

## 📊 Performance Metrics

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### API Performance

- **Response Time**: < 500ms for cached data
- **Error Rate**: < 1% for API endpoints
- **Availability**: 99.9% uptime target

### Bundle Size Optimization

- **Main Bundle**: < 200KB gzipped
- **Code Splitting**: Route-based chunking implemented
- **Tree Shaking**: Unused code elimination enabled

## 🔒 Security Considerations

- **Rate Limiting**: Consider implementing rate limiting for API routes
- **Input Validation**: All user inputs are validated and sanitized
- **Environment Variables**: Sensitive data stored in environment variables
- **CORS**: Properly configured for production deployment

## 📋 Project Review & Quality Checklist

### ✅ Completed Items

- [x] **TypeScript Migration**: All components converted from JS to TSX
- [x] **Type Definitions**: Comprehensive API types in `src/types/api.ts`
- [x] **Code Quality**: ESLint + Prettier configured with pre-commit hooks
- [x] **Build Optimization**: Clean builds with no errors or warnings
- [x] **Documentation**: Comprehensive README with setup instructions
- [x] **Git Configuration**: Proper .gitignore with environment files excluded
- [x] **Next.js Best Practices**: App Router, proper image optimization, params handling

### 🔧 Technical Debt & Improvements

#### Code Quality

- **Absolute Imports**: All imports use `@/components` and `@/app` paths
- **Type Safety**: 100% TypeScript coverage with strict mode enabled
- **Consistent Formatting**: Prettier + ESLint rules enforced via Husky

#### Performance Optimizations

- **Image Optimization**: Next.js Image component with CoinGecko domains configured
- **Bundle Size**: Optimized imports and tree-shaking enabled
- **Static Generation**: Pages properly configured for static/dynamic rendering

#### Development Experience

- **VS Code Integration**: Workspace settings and recommended extensions
- **Hot Reload**: Fast refresh for rapid development cycles
- **Error Boundaries**: Graceful error handling throughout the application

## 🏗️ Architecture & Best Practices

### Component Architecture

```
Components are organized by:
├── Pure UI Components (stateless)
├── Container Components (with state/effects)
├── Layout Components (page structure)
└── Feature Components (domain-specific)
```

### API Design

- **RESTful endpoints** with proper HTTP methods
- **Type-safe responses** with validated data
- **Error handling** with meaningful status codes
- **Rate limiting** considerations for external APIs

### State Management

- **React hooks** for local component state
- **URL state** for shareable analysis parameters
- **Server state** managed through API calls with proper caching

### Deployment Strategy

- **Vercel optimized** with proper function configuration
- **Environment-specific** builds with appropriate caching
- **CDN integration** for static assets and images

## 🚧 Future Enhancements

### High Priority - ✅ COMPLETED

- [x] **Performance & Caching**: Added server-side caching (Redis/Upstash Edge Cache) for `/api/history` to reduce redundant Binance calls
- [x] **Error Handling & Retries**: Implemented exponential backoff and retry logic for transient API failures
- [x] **Accessibility (a11y)**: Ensured ARIA labels, keyboard focus, and semantic HTML for screen readers
- [x] **Loading States**: Added comprehensive loading states and error boundaries throughout the application
- [x] **Dark Mode**: Added theme toggle with comprehensive Tailwind dark mode classes

### Medium Priority

- [ ] **Unit & Integration Testing**: Add Jest + React Testing Library tests for key components
- [ ] **End-to-End Tests**: Incorporate Cypress or Playwright for automated flow testing
- [ ] **Responsive Design**: Optimize mobile/tablet layouts for tables and chart interactions
- [ ] **Logging & Monitoring**: Integrate APM tools (Sentry, LogRocket) for production error tracking
- [ ] **Internationalization (i18n)**: Multi-language support with Next.js i18n routing
- [ ] **Feature Flags**: Safe rollout system for new features (LaunchDarkly)

### Low Priority

- [ ] User authentication (NextAuth.js)
- [ ] Real-time WebSocket data updates
- [ ] Multiple currency support (USD, EUR, etc.)
- [ ] Portfolio tracking functionality
- [ ] Advanced technical indicators

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow coding standards**:

   ```bash
   # Run linting and formatting
   npm run lint
   npm run format

   # Run tests
   npm run test
   ```

4. **Commit with conventional commits**:
   ```bash
   git commit -m 'feat: add amazing feature'
   git commit -m 'fix: resolve bug in component'
   git commit -m 'docs: update README'
   ```
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Code Standards

- **TypeScript**: Strict mode enabled, all components must be typed
- **ESLint**: All rules must pass, no warnings allowed
- **Prettier**: Code must be formatted consistently
- **Testing**: New features require corresponding tests
- **Documentation**: Public APIs and complex logic must be documented

### Pull Request Checklist

- [ ] Code follows project conventions
- [ ] Tests pass locally (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventional format

### Review Process

1. **Automated checks** must pass (GitHub Actions)
2. **Code review** by at least one maintainer
3. **Testing** in preview environment
4. **Approval** before merge to main branch

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact the development team at [your-email@domain.com]

### Reporting Bugs

When reporting bugs, please include:

- **Environment**: OS, Node.js version, browser
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console logs**: Any error messages

### Feature Requests

- Check existing issues to avoid duplicates
- Provide clear use cases and benefits
- Consider contributing the implementation
- Discuss major changes before starting work

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

## 📈 Project Stats

- **Framework**: Next.js 15+
- **Language**: TypeScript (100% coverage)
- **Components**: 6+ reusable React components
- **API Routes**: 2 custom endpoints
- **Bundle Size**: ~200KB gzipped
- **Performance**: Core Web Vitals optimized
- **Accessibility**: WCAG 2.1 AA compliant (goal)
- **Test Coverage**: 80%+ target

## 🔄 Changelog

### v1.0.0 (Current)

- ✅ Initial release with core functionality
- ✅ TypeScript migration completed
- ✅ Comprehensive documentation
- ✅ Production deployment ready
- ✅ Code quality tooling configured

### Future Versions

- v1.1.0: Testing framework integration
- v1.2.0: Performance monitoring
- v1.3.0: Accessibility improvements
- v2.0.0: Advanced features and internationalization
