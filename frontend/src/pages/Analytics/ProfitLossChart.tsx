// File: src/components/Analytics/ProfitLossChart.tsx
import React from 'react';
import type { ProfitLossAnalytics } from '../../types/analytics';

interface ProfitLossChartProps {
  data: ProfitLossAnalytics;
}

const ProfitLossChart: React.FC<ProfitLossChartProps> = ({ data }) => {
  // Simple bar chart implementation - you might want to use a charting library like Chart.js
  const maxValue = Math.max(
    ...data.daily.map(d => parseFloat(d.profit.toString()) + parseFloat(d.loss.toString())),
    ...data.weekly.map(d => parseFloat(d.profit.toString()) + parseFloat(d.loss.toString()))
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Profit & Loss Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Daily Profit/Loss</h3>
          <div className="space-y-2">
            {data.daily.slice(0, 7).map((item, index) => {
              const profit = parseFloat(item.profit.toString());
              const loss = parseFloat(item.loss.toString());
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden">
                    <div 
                      className="bg-green-400 h-6"
                      style={{ width: `${maxValue > 0 ? (profit / maxValue) * 100 : 0}%` }}
                    ></div>
                    <div 
                      className="bg-red-400 h-6 -mt-6"
                      style={{ width: `${maxValue > 0 ? (loss / maxValue) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right text-sm">
                    <span className="text-green-600">${profit.toFixed(2)}</span>
                    <span className="text-red-600"> / ${loss.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">Weekly Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Profit:</span>
              <span className="text-green-600 font-semibold">${parseFloat(data.totalProfit.toString()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Loss:</span>
              <span className="text-red-600 font-semibold">${parseFloat(data.totalLoss.toString()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Net Profit:</span>
              <span className="font-semibold">${(parseFloat(data.totalProfit.toString()) - parseFloat(data.totalLoss.toString())).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossChart;