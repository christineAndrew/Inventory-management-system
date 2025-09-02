// File: src/types/index.ts
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