#!/bin/bash

# Crypto Analyzer - Comprehensive QA Test Suite
# This script validates all functionality before deployment

set -e

echo "🧪 CRYPTO ANALYZER - COMPREHENSIVE QA TEST SUITE"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_TOTAL=0

# Function to run test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${YELLOW}Testing: $test_name${NC}"
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
    fi
}

# Start production server in background
echo -e "\n${YELLOW}Starting production server...${NC}"
PORT=3005 npm run start > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Cleaning up...${NC}"
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
}

# Set trap to cleanup on exit
trap cleanup EXIT

# 1. Code Quality Tests
echo -e "\n${YELLOW}=== CODE QUALITY TESTS ===${NC}"

run_test "ESLint passes" "npm run lint > /dev/null 2>&1"
run_test "TypeScript compilation passes" "npx tsc --noEmit > /dev/null 2>&1"
run_test "Prettier formatting is consistent" "npm run format -- --check > /dev/null 2>&1"

# 2. Build Tests
echo -e "\n${YELLOW}=== BUILD TESTS ===${NC}"

run_test "Production build succeeds" "test -d .next/server"
run_test "Build includes required pages" "test -f .next/server/app/page.html"
run_test "Build includes API routes" "test -f .next/server/app/api/history/route.js"

# 3. API Tests
echo -e "\n${YELLOW}=== API TESTS ===${NC}"

run_test "API responds to valid history request" "curl -s -f 'http://localhost:3005/api/history?coin=bitcoin&from=2025-07-01T00:00:00Z&to=2025-07-01T02:00:00Z&interval=1h' > /dev/null"
run_test "API rejects invalid parameters" "curl -s 'http://localhost:3005/api/history?coin=bitcoin&interval=invalid' | grep -q 'error'"
run_test "API returns proper JSON structure" "curl -s 'http://localhost:3005/api/history?coin=bitcoin&from=2025-07-01T00:00:00Z&to=2025-07-01T02:00:00Z&interval=1h' | jq '.[0].timestamp' > /dev/null 2>&1"

# 4. Page Tests
echo -e "\n${YELLOW}=== PAGE TESTS ===${NC}"

run_test "Home page loads successfully" "curl -s -f 'http://localhost:3005/' > /dev/null"
run_test "Home page contains expected content" "curl -s 'http://localhost:3005/' | grep -q 'Crypto Analyzer'"
run_test "History page loads successfully" "curl -s -f 'http://localhost:3005/coins/bitcoin/history' > /dev/null"
run_test "Results page loads successfully" "curl -s -f 'http://localhost:3005/coins/bitcoin/history/results?from=2025-07-01T00:00:00Z&to=2025-07-01T02:00:00Z&interval=1h' > /dev/null"

# 5. Component Tests
echo -e "\n${YELLOW}=== COMPONENT TESTS ===${NC}"

run_test "All TypeScript components exist" "test -f src/components/CoinList.tsx && test -f src/components/HistoryForm.tsx && test -f src/components/AnalysisTable.tsx && test -f src/components/PriceChart.tsx && test -f src/components/VolumeChart.tsx && test -f src/components/PDFReport.tsx"
run_test "No JavaScript components remain" "! find src -name '*.js' -o -name '*.jsx' | grep -q ."
run_test "Components have proper TypeScript interfaces" "grep -q 'interface.*Props' src/components/PriceChart.tsx"

# 6. Configuration Tests
echo -e "\n${YELLOW}=== CONFIGURATION TESTS ===${NC}"

run_test "Vercel configuration exists" "test -f vercel.json"
run_test "Vercel config has PDF function settings" "grep -q 'generate-pdf' vercel.json"
run_test "Environment variables configured" "test -f .env.local && grep -q 'COINGECKO_API_URL' .env.local"
run_test "Package.json has all required scripts" "grep -q 'dev.*build.*start.*lint.*format' package.json"
run_test "Husky pre-commit hooks configured" "test -f .husky/pre-commit"

# 7. File Structure Tests
echo -e "\n${YELLOW}=== FILE STRUCTURE TESTS ===${NC}"

run_test "No legacy pages directory exists" "! test -d pages"
run_test "App Router structure is correct" "test -d src/app && test -f src/app/layout.tsx && test -f src/app/page.tsx"
run_test "API routes are in correct location" "test -d src/app/api && test -f src/app/api/history/route.ts"
run_test "VS Code settings configured" "test -f .vscode/settings.json && test -f .vscode/extensions.json"

# Final Results
echo -e "\n${YELLOW}=== TEST RESULTS ===${NC}"
echo -e "Tests passed: ${GREEN}$TESTS_PASSED${NC}/$TESTS_TOTAL"

if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED! Ready for deployment!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please review and fix issues before deployment.${NC}"
    exit 1
fi
