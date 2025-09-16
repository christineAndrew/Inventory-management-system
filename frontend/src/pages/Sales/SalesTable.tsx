// File: src/pages/Sales/SalesTable.tsx
import React from 'react';
import type { Sale } from '../../types';

interface SalesTableProps {
  sales: Sale[];
  onViewReceipt: (sale: Sale) => void;
  filters: { startDate: string; endDate: string };
  onFilterChange: (filters: { startDate: string; endDate: string }) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ 
  sales, 
  onViewReceipt, 
  filters, 
  onFilterChange 
}) => {
  const handleFilterChange = (key: string, value: string) => {
    // Only update if the date value is valid or empty
    if (value === '' || !isNaN(new Date(value).getTime())) {
      onFilterChange({ ...filters, [key]: value });
    } else {
      console.warn('Invalid date value provided:', value);
    }
  };

  // Safe function to format currency
  const formatCurrency = (amount: number | string | null | undefined): string => {
    if (amount === null || amount === undefined) return '$0.00';
    
    // Convert to number if it's a string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Check if it's a valid number
    if (isNaN(numericAmount)) return '$0.00';
    
    return `$${numericAmount.toFixed(2)}`;
  };

  // Calculate overall totals for all displayed sales
  const calculateTotals = () => {
    return sales.reduce((acc, sale) => {
      const totalProfit = sale.totalProfit ?? 0;
      const totalLoss = sale.totalLoss ?? 0;
      const netProfit = sale.netProfit ?? (totalProfit - totalLoss);
      
      return {
        totalSales: acc.totalSales + (sale.finalAmount || 0),
        totalProfit: acc.totalProfit + totalProfit,
        totalLoss: acc.totalLoss + totalLoss,
        netProfit: acc.netProfit + netProfit
      };
    }, { totalSales: 0, totalProfit: 0, totalLoss: 0, netProfit: 0 });
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filter Section */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Profit/Loss Summary */}
      {sales.length > 0 && (
        <div className="p-4 bg-blue-50 border-b">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Sales Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">
                {formatCurrency(totals.totalSales)}
              </div>
              <div className="text-sm text-gray-600">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(totals.totalProfit)}
              </div>
              <div className="text-sm text-gray-600">Total Profit</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(totals.totalLoss)}
              </div>
              <div className="text-sm text-gray-600">Total Loss</div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${
                totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totals.netProfit >= 0 ? '+' : ''}{formatCurrency(totals.netProfit)}
              </div>
              <div className="text-sm text-gray-600">Net Profit/Loss</div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale #</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Profit</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Loss</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net P/L</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.map((sale) => {
            // Calculate profit/loss if not provided in backend response
            const totalProfit = sale.totalProfit ?? 0;
            const totalLoss = sale.totalLoss ?? 0;
            const netProfit = sale.netProfit ?? (totalProfit - totalLoss);
            const isProfitable = netProfit >= 0;
            
            return (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sale.saleNumber}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatCurrency(sale.finalAmount)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <span className="text-green-600 font-medium">
                    {formatCurrency(totalProfit)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <span className="text-red-600 font-medium">
                    {formatCurrency(totalLoss)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`font-bold ${
                    isProfitable ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isProfitable ? '+' : ''}{formatCurrency(netProfit)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    sale.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    sale.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sale.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <button
                    onClick={() => onViewReceipt(sale)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    View Receipt
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {sales.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No sales found
        </div>
      )}
    </div>
  );
};

export default SalesTable;