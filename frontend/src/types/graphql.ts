// GraphQL Response Types
export interface GetStoresResponse {
  stores: Array<{
    id: string;
    name: string;
    location: string;
    address: string;
    isActive: boolean;
  }>;
}


export interface GetStocksResponse {
  stocks: Array<{
    id: string;
    quantity: number;
    lowStockThreshold: number;
    lastUpdated: string;
    productName: string;
    storeName: string;
    product: {
      id: string;
      name: string;
      category: string;
    };
    store: {
      id: string;
      name: string;
      location: string;
    };
  }>;
}
export interface UpdateStockResponse {
  updateStock: {
    stock: {
      id: string;
      quantity: number;
      lowStockThreshold: number;
      productName: string;
      storeName: string;
    };
    movement: {
      id: string;
      movementType: string;
      quantity: number;
      reason: string;
      createdAt: string;
    };
  };
}

export interface CreateStockMovementResponse {
  createStockMovement: {
    movement: {
      id: string;
      movementType: string;
      quantity: number;
      reason: string;
      reference: string;
      createdAt: string;
    };
    stock: {
      id: string;
      quantity: number;
      productName: string;
      storeName: string;
    };
  };
}

// File: src/types/graphql.ts