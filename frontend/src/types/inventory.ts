// File: src/types/inventory.ts
export interface Store {
  id: number;
  name: string;
  location: string;
  address: string;
  isActive: boolean;
  // Keep this for backward compatibility
  is_active?: boolean;
}

export interface Stock {
  id: number;
  quantity: number;
  lowStockThreshold: number;
  lastUpdated: string;
  productName: string;
  storeName: string;
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
  // Keep these for backward compatibility in components
  low_stock_threshold?: number;
  last_updated?: string;
  product_name?: string;
  store_name?: string;
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