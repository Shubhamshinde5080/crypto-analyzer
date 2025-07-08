# Crypto Analyzer

A professional, production-ready Next.js 15+ cryptocurrency analysis application built with TypeScript, Tailwind CSS, and comprehensive developer tooling.

## 🚀 Features

- **Real-time Crypto Data**: Fetch and analyze cryptocurrency data from CoinGecko API
- **Historical Analysis**: View OHLCV data with customizable time intervals
- **Interactive Charts**: Price and volume charts powered by Recharts
- **PDF Export**: Both client-side (html2canvas + jsPDF) and server-side (Puppeteer) PDF generation
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **TypeScript**: Fully typed for better developer experience and code quality
- **Production Ready**: Optimized for Vercel deployment with proper error handling

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
   The `.env.local` file is already configured with CoinGecko API URL. If you need to modify it:

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

## 🎨 Customization

### Adding New Cryptocurrency Exchanges

1. Update API endpoints in `/src/app/api/history/route.ts`
2. Modify data transformation logic
3. Update TypeScript interfaces

### Styling Changes

1. Edit Tailwind classes in components
2. Update `tailwind.config.js` for theme customization
3. Modify global styles in `src/app/globals.css`

## 🔒 Security Considerations

- **Rate Limiting**: Consider implementing rate limiting for API routes
- **Input Validation**: All user inputs are validated and sanitized
- **Environment Variables**: Sensitive data stored in environment variables
- **CORS**: Properly configured for production deployment

## 🚧 Future Enhancements

- [ ] User authentication (NextAuth.js)
- [ ] Real-time WebSocket data updates
- [ ] Dark mode toggle
- [ ] Multiple currency support (USD, EUR, etc.)
- [ ] Portfolio tracking functionality
- [ ] Advanced technical indicators
- [ ] Unit and E2E testing
- [ ] Internationalization (i18n)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
