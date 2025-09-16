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

// Interface for profit/loss calculations
interface ItemProfitData {
  profit: number;
  loss: number;
  profitMargin: number;
  costPrice: number;
}

const CreateSaleForm: React.FC<CreateSaleFormProps> = ({ onClose, onSubmit }) => {
  const [saleData, setSaleData] = useState<SaleInput>({
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

  // Calculate profit/loss for an item
  const calculateItemProfitData = (item: SaleItemInput): ItemProfitData => {
    const product = productsData?.products?.find(p => p.id === item.productId);
    if (!product) return { profit: 0, loss: 0, profitMargin: 0, costPrice: 0 };
    
    const costPrice = product.costPrice;
    const totalCost = costPrice * item.quantity;
    const totalRevenue = item.unitPrice * item.quantity;
    const profitAmount = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (profitAmount / totalRevenue) * 100 : 0;
    
    return {
      profit: profitAmount > 0 ? profitAmount : 0,
      loss: profitAmount < 0 ? Math.abs(profitAmount) : 0,
      profitMargin: profitMargin,
      costPrice: costPrice
    };
  };

  // Calculate total profit/loss for the sale
  const calculateTotalProfitLoss = () => {
    return saleData.items.reduce((acc, item) => {
      const itemData = calculateItemProfitData(item);
      return {
        totalProfit: acc.totalProfit + itemData.profit,
        totalLoss: acc.totalLoss + itemData.loss,
        netProfit: acc.totalProfit + itemData.profit - (acc.totalLoss + itemData.loss)
      };
    }, { totalProfit: 0, totalLoss: 0, netProfit: 0 });
  };

  // Set default unit price when product is selected
  React.useEffect(() => {
    if (selectedProduct && currentItem.unitPrice === 0) {
      setCurrentItem(prev => ({
        ...prev,
        unitPrice: selectedProduct.sellingPrice
      }));
    }
  }, [currentItem.productId, currentItem.unitPrice, selectedProduct]);

  if (productsLoading) return <div>Loading products...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create New Sale</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">

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

            {/* Items List with Profit/Loss Details */}
            {saleData.items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Items in Sale - Profit/Loss Analysis</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-xs text-gray-600 border-b">
                        <th className="text-left pb-2">Product</th>
                        <th className="text-right pb-2">Qty</th>
                        <th className="text-right pb-2">Cost</th>
                        <th className="text-right pb-2">Price</th>
                        <th className="text-right pb-2">Revenue</th>
                        <th className="text-right pb-2">Profit/Loss</th>
                        <th className="text-center pb-2">Margin</th>
                        <th className="text-center pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleData.items.map((item, index) => {
                        const product = productsData?.products?.find((p: Product) => p.id === item.productId);
                        const profitData = calculateItemProfitData(item);
                        const isProfitable = profitData.profit > profitData.loss;
                        
                        return (
                          <tr key={index} className="border-b text-sm">
                            <td className="py-2">
                              <div>
                                <span className="font-medium">{product?.name}</span>
                              </div>
                            </td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">${profitData.costPrice.toFixed(2)}</td>
                            <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                            <td className="text-right py-2">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                            <td className={`text-right py-2 font-medium ${
                              isProfitable ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isProfitable ? '+' : '-'}${(isProfitable ? profitData.profit : profitData.loss).toFixed(2)}
                            </td>
                            <td className={`text-center py-2 text-xs ${
                              profitData.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {profitData.profitMargin.toFixed(1)}%
                            </td>
                            <td className="text-center py-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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

          {/* Profit/Loss Summary */}
          {saleData.items.length > 0 && (() => {
            const profitLoss = calculateTotalProfitLoss();
            return (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-3">Profit/Loss Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      +${profitLoss.totalProfit.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total Profit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      -${profitLoss.totalLoss.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Total Loss</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      profitLoss.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {profitLoss.netProfit >= 0 ? '+' : ''}${profitLoss.netProfit.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Net Profit</div>
                  </div>
                </div>
              </div>
            );
          })()}

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