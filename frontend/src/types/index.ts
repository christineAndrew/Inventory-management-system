// File: src/types/index.t
// File: src/types/index.ts
// Make sure Sale and related types are properly exported
export * from './product';
export * from './sales'; // This should export Sale and related types
// Product Types
export interface Product {
  id: number;
  name: string;
  description: string | null;
  category: string;
  costPrice: number;
  sellingPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  costPrice: string;
  sellingPrice: string;
}

// Add category options
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Books',
  'Home & Garden',
  'Sports & Outdoors',
  'Beauty & Health',
  'Toys & Games',
  'Automotive',
  'Office Supplies',
  'Jewelry',
  'Furniture',
  'Other'
] as const;

// Use a type alias instead of export type for the category
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

// Dashboard Types
export interface DashboardData {
  dailyProfit: number;
  weeklyProfit: number;
  dailyLoss: number;
  weeklyLoss: number;
  totalProducts: number;
  productsSoldToday: number;
}

export interface LowStockItem {
  id: number;
  name: string;
  currentStock: number;
  minStock: number;
}

// File: src/types/index.ts
export interface RecentSale {
  id: number;
  productName: string;
  quantity: number;
  amount: number | string; // Allow both number and string
  saleDate: string;
}

export interface ProfitLossData {
  date: string;
  profit: number;
  loss: number;
}

// If you need to export types from other files, you can do:
// export * from './product';
// export * from './dashboard';