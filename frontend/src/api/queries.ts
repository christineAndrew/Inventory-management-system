// File: src/api/queries.ts
import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($search: String) {
    products(search: $search) {
      id
      name
      description
      category
      costPrice
      sellingPrice
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: Int!) {
    product(id: $id) {
      id
      name
      description
      category
      costPrice
      sellingPrice
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    dashboardData {
      dailyProfit
      weeklyProfit
      dailyLoss
      weeklyLoss
      totalProducts
      productsSoldToday
    }
    lowStockItems {
      id
      name
      currentStock
      minStock
    }
    recentSales {
      id
      productName
      quantity
      amount
      saleDate
    }
    profitLossData {
      date
      profit
      loss
    }
  }
`;

// Sales Queries
export const GET_SALES = gql`
  query GetSales($startDate: DateTime, $endDate: DateTime, $limit: Int) {
    sales(startDate: $startDate, endDate: $endDate, limit: $limit) {
      id
      saleNumber
      customerName
      customerEmail
      customerPhone
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

export const GET_SALE = gql`
  query GetSale($id: Int!) {
    sale(id: $id) {
      id
      saleNumber
      customerName
      customerEmail
      customerPhone
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

export const CREATE_SALE = gql`
  mutation CreateSale($input: SaleInput!) {
    createSale(input: $input) {
      sale {
        id
        saleNumber
        customerName
        customerEmail
        customerPhone
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
  }
`;
