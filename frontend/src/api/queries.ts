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


// File: src/api/queries.ts



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