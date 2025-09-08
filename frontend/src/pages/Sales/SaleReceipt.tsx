// File: src/pages/Sales/SaleReceipt.tsx
import React from 'react';
import type{ Sale } from '../../types';

interface SaleReceiptProps {
  sale: Sale;
  onClose: () => void;
}

// Safe currency formatting function
const formatCurrency = (amount: any): string => {
  if (amount === null || amount === undefined) return '$0.00';
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return '$0.00';
  return `$${numericAmount.toFixed(2)}`;
};

const SaleReceipt: React.FC<SaleReceiptProps> = ({ sale, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Sale Receipt</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>

        <div className="p-6">
          {/* Receipt Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold">Shop Inventory System</h3>
            <p className="text-sm text-gray-600">Thank you for your purchase!</p>
          </div>

          {/* Sale Information */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Receipt #:</span>
              <span>{sale.saleNumber}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Date:</span>
              <span>{new Date(sale.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-b py-4 mb-4">
            <div className="font-medium mb-2">ITEMS</div>
            {sale.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <div>
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-sm text-gray-600">
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </div>
                </div>
                <div className="font-medium">
                  {formatCurrency(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(sale.totalAmount)}</span>
            </div>
            {sale.discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>-{formatCurrency(sale.discountAmount)}</span>
              </div>
            )}
            {sale.taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatCurrency(sale.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>TOTAL:</span>
              <span>{formatCurrency(sale.finalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleReceipt;