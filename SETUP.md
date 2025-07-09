# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# CoinGecko API Configuration
COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development
NODE_ENV=development
```

## Important Notes

### CoinGecko API Limitations

The free CoinGecko API has the following limitations:

- Historical data is limited to the past 365 days only
- For data older than 365 days, you need a paid plan
- Rate limiting applies to API requests

### PDF Export Features

The PDF export feature includes:

- **Automatic pagination**: Large datasets are split into multiple pages
- **Complete data display**: All data points are included across pages
- **Print-optimized styling**: Clean, professional layout for PDF output
- **Charts and tables**: Both visual charts and detailed data tables
- **Summary statistics**: Key metrics and performance indicators

### Testing the PDF Export

To test the PDF export functionality:

1. Use recent dates (within the last 365 days)
2. Example working date ranges:
   - `from=2024-12-01&to=2024-12-31&interval=1d` (daily data)
   - `from=2024-12-01&to=2024-12-31&interval=1h` (hourly data for larger datasets)

3. Test both small and large datasets to verify pagination works correctly

### Troubleshooting

If you encounter issues:

1. **404 errors**: Ensure the dev server is running and environment variables are set
2. **401 errors**: Check that COINGECKO_API_URL is properly configured
3. **Empty PDFs**: Use date ranges within the last 365 days
4. **Cut-off data**: The new pagination system should handle large datasets automatically

### API Endpoints

- History data: `/api/history?coin={coin}&from={from}&to={to}&interval={interval}`
- PDF generation: `/api/generate-pdf?coin={coin}&from={from}&to={to}&interval={interval}`
- Print preview: `/coins/{coin}/history/print?from={from}&to={to}&interval={interval}`
