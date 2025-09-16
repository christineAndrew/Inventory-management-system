// File: src/pages/Analytics/SalesTrendChart.tsx
import React from 'react';
import type { AnalyticsData } from '../../types/analytics';

interface SalesTrendChartProps {
  data: AnalyticsData;
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => {
  const salesTrend = data.salesTrend.slice(-7); // Last 7 days
  const maxSales = Math.max(...salesTrend.map(item => parseFloat(item.amount.toString())));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Trends</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div>
          <h3 className="font-medium mb-3 text-sm text-gray-600">Daily Sales</h3>
          <div className="space-y-3">
            {salesTrend.map((item, index) => {
              const amount = parseFloat(item.amount.toString());
              const percentage = maxSales > 0 ? (amount / maxSales) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-16 text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Sales</span>
                      <span className="text-blue-600">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Summary */}
        <div>
          <h3 className="font-medium mb-3 text-sm text-gray-600">Sales Summary</h3>
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Sales:</span>
              <span className="text-blue-600 font-semibold">${parseFloat(data.totalSales.toString()).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Products Sold:</span>
              <span className="text-purple-600 font-semibold">{data.totalProductsSold}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg Order Value:</span>
              <span className="text-green-600 font-semibold">${parseFloat(data.averageOrderValue.toString()).toFixed(2)}</span>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center text-xs">
                <span>Total Orders:</span>
                <span className="font-semibold">
                  {parseFloat(data.averageOrderValue.toString()) > 0 
                    ? Math.round(parseFloat(data.totalSales.toString()) / parseFloat(data.averageOrderValue.toString()))
                    : 0
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <h3 className="font-medium mb-2 mt-4 text-sm text-gray-600">Top Selling Products</h3>
          <div className="space-y-2">
            {data.topSellingProducts.slice(0, 3).map((product: any, index: number) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="truncate max-w-[120px]">{product.productName}</span>
                <span className="text-gray-600">{product.totalSold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTrendChart;