// File: src/components/Inventory/StockAdjustmentForm.tsx
import React, { useState } from 'react';
import type { Stock, StockInput } from '../../types';

interface StockAdjustmentFormProps {
  stock?: Stock | null;
  onClose: () => void;
  onSubmit: (input: StockInput) => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ stock, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<StockInput>({
    productId: stock?.product?.id || 0,
    storeId: stock?.store?.id || 0,
    quantity: stock?.quantity || 0,
    lowStockThreshold: stock?.lowStockThreshold || 10
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adjustment form submitted with data:', formData); // Debug log
    
    if (formData.productId && formData.storeId) {
      onSubmit(formData);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  // Pre-fill form when stock is provided
  React.useEffect(() => {
    if (stock) {
      setFormData({
        productId: stock.product?.id || 0,
        storeId: stock.store?.id || 0,
        quantity: stock.quantity || 0,
        lowStockThreshold: stock.lowStockThreshold || 10
      });
    }
  }, [stock]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Adjust Stock</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {stock && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Product: <span className="font-medium">{stock.productName}</span></p>
              <p className="text-sm text-gray-600">Store: <span className="font-medium">{stock.storeName}</span></p>
              <p className="text-sm text-gray-600">Current Quantity: <span className="font-medium">{stock.quantity}</span></p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Quantity *</label>
            <input
              type="number"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold *</label>
            <input
              type="number"
              name="lowStockThreshold"
              min="1"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentForm;