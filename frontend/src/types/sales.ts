// File: src/types/sales.ts
export interface Sale {
  id: number;
  saleNumber: string;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  status: string;
  paymentMethod: string;
  notes: string;
  createdAt: string;
  items: SaleItem[];
}

export interface SaleItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  profit: number;
}

export interface SaleInput {
  items: SaleItemInput[];
  taxAmount?: number;
  discountAmount?: number;
  paymentMethod?: string;
  notes?: string;
}

export interface SaleItemInput {
  productId: number;
  quantity: number;
  unitPrice: number;
}