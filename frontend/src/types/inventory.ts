// File: src/types/inventory.ts
export interface Store {
  id: number;
  name: string;
  location: string;
  address: string;
  is_active: boolean;
}

export interface Stock {
  id: number;
  quantity: number;
  low_stock_threshold: number;
  last_updated: string;
  product_name: string;
  store_name: string;
  product: {
    id: number;
    name: string;
    category: string;
  };
  store: {
    id: number;
    name: string;
    location: string;
  };
  // Add these for backward compatibility in components
  lowStockThreshold?: number;
  lastUpdated?: string;
  productName?: string;
  storeName?: string;
}

export interface InventoryMovement {
  id: number;
  movementType: string;
  movementTypeDisplay: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference: string;
  createdAt: string;
  productName: string;
  storeName: string;
}

export interface StockInput {
  productId: number;
  storeId: number;
  quantity: number;
  lowStockThreshold?: number;
}

export interface StockMovementInput {
  productId: number;
  storeId: number;
  quantity: number;
  movementType: string;
  reason?: string;
  reference?: string;
}