# Shop1 - Troubleshooting Guide

## Issue: Error 400 when clicking Sales button

### Problem
When clicking the "Sales" button in the navigation, users encounter a "Response not successful: Received status code 400" error.

### Root Causes Identified & Fixed

#### 1. **GraphQL Schema Mismatch**
**Problem**: Frontend GraphQL queries didn't match the backend schema
- Frontend expected `startDate`, `endDate`, `status` parameters
- Backend expected `start_date`, `end_date` and didn't support `status` filter

**Fix**: Updated frontend queries to match backend schema:
```typescript
// BEFORE (broken)
query GetSales($startDate: String, $endDate: String, $status: String, $limit: Int) {
  sales(startDate: $startDate, endDate: $endDate, status: $status, limit: $limit) { ... }
}

// AFTER (fixed)
query GetSales($startDate: DateTime, $endDate: DateTime, $limit: Int) {
  sales(startDate: $startDate, endDate: $endDate, limit: $limit) { ... }
}
```

#### 2. **Apollo Client Configuration Issues**
**Problem**: Complex authentication setup causing request failures
- Referenced missing authentication endpoints
- Complex token refresh logic interfering with requests
- Mismatched function signatures in auth utilities

**Fix**: Simplified Apollo Client configuration:
```typescript
// Simplified client without authentication complexity
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' }
  }
});
```

#### 3. **Component State Mismatch**
**Problem**: SalesTable component expected `status` filter that was removed
**Fix**: Updated component interfaces to remove status filter

### Files Changed

1. **`frontend/src/api/queries.ts`**
   - Fixed parameter types (String → DateTime)
   - Removed unsupported `status` parameter

2. **`frontend/src/api/client.ts`**
   - Simplified Apollo Client configuration
   - Removed complex authentication logic
   - Added error handling policies

3. **`frontend/src/pages/Sales/SalesPage.tsx`**
   - Updated filter state structure
   - Added proper error handling and logging
   - Fixed date handling for GraphQL variables

4. **`frontend/src/pages/Sales/SalesTable.tsx`**
   - Updated component interface
   - Removed status filter UI

### Testing the Fix

#### 1. Manual GraphQL Testing
Test the GraphQL endpoint directly:
```bash
curl -X POST http://127.0.0.1:8000/graphql/ \
  -H "Content-Type: application/json" \
  -d '{"query": "{ sales { id saleNumber customerName totalAmount } }"}'
```

Expected response:
```json
{"data":{"sales":[{"id":"1","saleNumber":"S754331","customerName":"tina","totalAmount":"1000.00"}]}}
```

#### 2. Browser Testing
1. Start both servers using `./start_fixed.sh`
2. Navigate to http://localhost:5173
3. Click on "Sales" in the navigation
4. Check browser console for any errors
5. Verify sales data loads correctly

### Current Status
✅ **FIXED**: The 400 error when accessing the Sales page has been resolved.

### Usage Instructions

#### Start the Fixed Version
```bash
cd "/home/egoridc25/Pictures/commited files/shop1"
./start_fixed.sh
```

#### Manual Server Start (Alternative)
```bash
# Backend
cd backendshop/backend
python3 manage.py runserver 127.0.0.1:8000

# Frontend (in another terminal)
cd frontend
npm run dev
```

### Future Improvements

1. **Add Authentication**: Implement proper user authentication system
2. **Error Boundaries**: Add React error boundaries for better error handling
3. **Loading States**: Improve loading and error states throughout the app
4. **Validation**: Add client-side validation for date filters
5. **Pagination**: Add pagination for large sales datasets

### Debugging Tips

If you encounter issues:

1. **Check Browser Console**: Look for detailed error messages
2. **Check Network Tab**: Verify GraphQL requests and responses
3. **Backend Logs**: Monitor Django server output for errors
4. **GraphQL Playground**: Use http://127.0.0.1:8000/graphql/ to test queries
5. **Check Ports**: Ensure no conflicts on ports 8000 and 5173

### Contact Information

If you need further assistance, check:
- Browser Developer Tools (F12)
- Django server console output
- README.md for general setup instructions
