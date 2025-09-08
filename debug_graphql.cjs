#!/usr/bin/env node

// Simple Node.js script to test GraphQL endpoint
const https = require('https');
const http = require('http');

const query = `
  query GetSales($startDate: DateTime, $endDate: DateTime, $limit: Int) {
    sales(startDate: $startDate, endDate: $endDate, limit: $limit) {
      id
      saleNumber
      
      totalAmount
      taxAmount
      discountAmount
      finalAmount
      status
      paymentMethod
      notes
      createdAt
      items {
        id
        productName
        quantity
        unitPrice
        totalPrice
        profit
      }
    }
  }
`;

const postData = JSON.stringify({
  query: query,
  variables: {}
});

const options = {
  hostname: '127.0.0.1',
  port: 8000,
  path: '/graphql/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing GraphQL endpoint...');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const parsed = JSON.parse(data);
      if (parsed.errors) {
        console.error('GraphQL Errors:', parsed.errors);
      } else {
        console.log('Success! Found', parsed.data.sales.length, 'sales');
      }
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

req.write(postData);
req.end();
