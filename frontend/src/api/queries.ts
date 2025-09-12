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

// File: src/api/queries.ts

export const GET_STORES = gql`
  query GetStores {
    stores {
      id
      name
      location
      address
      is_active
    }
  }
`;

export const GET_STOCKS = gql`
  query GetStocks($storeId: Int, $productId: Int, $lowStock: Boolean) {
    stocks(storeId: $storeId, productId: $productId, lowStock: $lowStock) {
      id
      quantity
      low_stock_threshold
      last_updated
      product_name
      store_name
      product {
        id
        name
        category
      }
      store {
        id
        name
        location
      }
    }
  }
`;

export const GET_INVENTORY_MOVEMENTS = gql`
  query GetInventoryMovements($storeId: Int, $productId: Int, $movementType: String, $days: Int) {
    inventoryMovements(storeId: $storeId, productId: $productId, movementType: $movementType, days: $days) {
      id
      movementType
      movementTypeDisplay
      quantity
      previousQuantity
      newQuantity
      reason
      reference
      createdAt
      productName
      storeName
    }
  }
`;

export const UPDATE_STOCK = gql`
  mutation UpdateStock($input: StockInput!) {
    updateStock(input: $input) {
      stock {
        id
        quantity
        lowStockThreshold
        productName
        storeName
      }
      movement {
        id
        movementType
        quantity
        reason
        createdAt
      }
    }
  }
`;

export const CREATE_STOCK_MOVEMENT = gql`
  mutation CreateStockMovement($input: StockMovementInput!) {
    createStockMovement(input: $input) {
      movement {
        id
        movementType
        quantity
        reason
        reference
        createdAt
      }
      stock {
        id
        quantity
        productName
        storeName
      }
    }
  }
`;