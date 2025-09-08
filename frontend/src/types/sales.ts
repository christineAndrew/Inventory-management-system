// File: src/types/sales.ts
export interface Sale {
  id: number;
  saleNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
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
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
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