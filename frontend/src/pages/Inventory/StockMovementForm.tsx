// File: src/components/Inventory/StockMovementForm.tsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS, GET_STORES } from '../../api/queries';
import  type{ Stock, StockMovementInput, Product, Store } from '../../types';

// Define response types for the queries
interface ProductsQueryResult {
  products: Product[];
}

interface StoresQueryResult {
  stores: Store[];
}

interface StockMovementFormProps {
  stock?: Stock | null;
  onClose: () => void;
  onSubmit: (input: StockMovementInput) => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({ stock, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<StockMovementInput>({
    productId: stock?.product?.id || 0,
    storeId: stock?.store?.id || 0,
    quantity: 0,
    movementType: 'IN',
    reason: '',
    reference: ''
  });

  // Properly type the queries
  const { data: productsData, loading: productsLoading } = useQuery<ProductsQueryResult>(GET_PRODUCTS);
  const { data: storesData, loading: storesLoading } = useQuery<StoresQueryResult>(GET_STORES);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData); // Debug log
    
    if (formData.productId && formData.storeId && formData.quantity > 0) {
      onSubmit(formData);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'productId' || name === 'storeId' || name === 'quantity' ? Number(value) : value
    }));
  };

  // Pre-fill form when stock is provided
  React.useEffect(() => {
    if (stock) {
      setFormData(prev => ({
        ...prev,
        productId: stock.product?.id || 0,
        storeId: stock.store?.id || 0
      }));
    }
  }, [stock]);

  if (productsLoading || storesLoading) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add Stock Movement</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value={0}>Select Product</option>
              {productsData?.products?.map((product: Product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Store *</label>
            <select
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value={0}>Select Store</option>
              {storesData?.stores?.map((store: Store) => (
                <option key={store.id} value={store.id}>
                  {store.name} - {store.location}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type *</label>
            <select
              name="movementType"
              value={formData.movementType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
              <option value="ADJ">Adjustment</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Reason for this movement..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Optional reference number..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Movement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockMovementForm;