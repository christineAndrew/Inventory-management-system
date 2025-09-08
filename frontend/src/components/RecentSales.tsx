// File: src/components/RecentSales.tsx
import React from 'react';
import type { RecentSale } from '../types';

interface RecentSalesProps {
  data?: RecentSale[];
}

const RecentSales: React.FC<RecentSalesProps> = ({ data }) => {
  const sales = data || [];

  // Safe function to format amount
  const formatAmount = (amount: any): string => {
    if (amount === null || amount === undefined) return '$0.00';
    
    // Convert to number if it's a string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Check if it's a valid number
    if (isNaN(numericAmount)) return '$0.00';
    
    return `$${numericAmount.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Sales</h2>
      {sales.length > 0 ? (
        <div className="space-y-4">
          {sales.map(sale => (
            <div key={sale.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
              <div>
                <h3 className="font-medium text-gray-900">{sale.productName}</h3>
                <p className="text-sm text-gray-500">
                  {sale.quantity} item{sale.quantity > 1 ? 's' : ''} ·{' '}
                  {new Date(sale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatAmount(sale.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No recent sales
        </div>
      )}
    </div>
  );
};

export default RecentSales;