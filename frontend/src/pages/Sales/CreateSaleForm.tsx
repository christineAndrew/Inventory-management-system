// File: src/components/Sales/CreateSaleForm.tsx
import React, { useState } from 'react';
import type{ SaleInput, SaleItemInput, Product } from '../../types';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS } from '../../api/queries';

interface CreateSaleFormProps {
  onClose: () => void;
  onSubmit: (saleData: SaleInput) => void;
}

// Define the type for the products query response
interface ProductsQueryResult {
  products: Product[];
}

const CreateSaleForm: React.FC<CreateSaleFormProps> = ({ onClose, onSubmit }) => {
  const [saleData, setSaleData] = useState<SaleInput>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [],
    taxAmount: 0,
    discountAmount: 0,
    paymentMethod: 'CASH',
    notes: ''
  });

  const [currentItem, setCurrentItem] = useState<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>({
    productId: 0,
    quantity: 1,
    unitPrice: 0
  });

  // Properly type the query response
  const { data: productsData, loading: productsLoading } = useQuery<ProductsQueryResult>(GET_PRODUCTS);

  const handleAddItem = () => {
    if (currentItem.productId && currentItem.quantity > 0 && currentItem.unitPrice > 0) {
      const newItem: SaleItemInput = {
        productId: currentItem.productId,
        quantity: currentItem.quantity,
        unitPrice: currentItem.unitPrice
      };

      setSaleData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));

      setCurrentItem({
        productId: 0,
        quantity: 1,
        unitPrice: 0
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setSaleData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saleData.items.length > 0) {
      onSubmit(saleData);
    }
  };

  const calculateTotal = () => {
    return saleData.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const calculateFinalAmount = () => {
    const total = calculateTotal();
    return total - (saleData.discountAmount || 0) + (saleData.taxAmount || 0);
  };

  // Get the selected product to show its selling price as default
  const selectedProduct = productsData?.products?.find(p => p.id === currentItem.productId);

  // Set default unit price when product is selected
  React.useEffect(() => {
    if (selectedProduct && currentItem.unitPrice === 0) {
      setCurrentItem(prev => ({
        ...prev,
        unitPrice: selectedProduct.sellingPrice
      }));
    }
  }, [currentItem.productId, selectedProduct]);

  if (productsLoading) return <div>Loading products...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create New Sale</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={saleData.customerName}
                onChange={(e) => setSaleData({ ...saleData, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
              <input
                type="email"
                value={saleData.customerEmail}
                onChange={(e) => setSaleData({ ...saleData, customerEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
              <input
                type="tel"
                value={saleData.customerPhone}
                onChange={(e) => setSaleData({ ...saleData, customerPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Add Items */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Add Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={currentItem.productId}
                  onChange={(e) => setCurrentItem({ ...currentItem, productId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value={0}>Select Product</option>
                  {productsData?.products?.map((product: Product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.sellingPrice}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentItem.unitPrice}
                  onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Items List */}
            {saleData.items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium mb-2">Items in Sale</h4>
                {saleData.items.map((item, index) => {
                  const product = productsData?.products?.find((p: Product) => p.id === item.productId);
                  return (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <span className="font-medium">{product?.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {item.quantity} x ${item.unitPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-3">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={saleData.discountAmount || 0}
                onChange={(e) => setSaleData({ ...saleData, discountAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={saleData.taxAmount || 0}
                onChange={(e) => setSaleData({ ...saleData, taxAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={saleData.paymentMethod}
                onChange={(e) => setSaleData({ ...saleData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Discount:</span>
              <span>-${(saleData.discountAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Tax:</span>
              <span>+${(saleData.taxAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${calculateFinalAmount().toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={saleData.notes}
              onChange={(e) => setSaleData({ ...saleData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Additional notes about this sale..."
            />
          </div>

          {/* Actions */}
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
              disabled={saleData.items.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Complete Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSaleForm;