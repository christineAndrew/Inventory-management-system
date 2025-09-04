// File: src/components/LowStockAlert.tsx
import React from 'react';
import type { LowStockItem } from '../types';

interface LowStockAlertProps {
  data?: LowStockItem[];
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ data }) => {
  const lowStockItems = data || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h2>
      {lowStockItems.length > 0 ? (
        <div className="space-y-4">
          {lowStockItems.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">Current: {item.currentStock} · Minimum: {item.minStock}</p>
              </div>
              <div>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Reorder</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-green-500">
          All products are well stocked
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;