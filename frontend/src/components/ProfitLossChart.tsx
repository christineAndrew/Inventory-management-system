// File: src/components/ProfitLossChart.tsx


// File: src/components/ProfitLossChart.tsx
import React from 'react';
import type { ProfitLossData } from '../types';

interface ProfitLossChartProps {
  data?: ProfitLossData[];
}

const ProfitLossChart: React.FC<ProfitLossChartProps> = ({ data }) => {
  // Use provided data or fallback to empty array
  const chartData = data || [];
  
  // Calculate max value for scaling
  const maxValue = Math.max(...chartData.map(d => d.profit + d.loss), 0);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Profit & Loss Overview (Last 7 Days)</h2>
      {chartData.length > 0 ? (
        <>
          <div className="flex items-end justify-between h-64">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center w-12">
                <div className="flex flex-col items-center justify-end h-48 w-full mb-2">
                  <div 
                    className="w-8 bg-green-400 rounded-t"
                    style={{ height: maxValue > 0 ? `${(item.profit / maxValue) * 100}%` : '0%' }}
                  ></div>
                  <div 
                    className="w-8 bg-red-400"
                    style={{ height: maxValue > 0 ? `${(item.loss / maxValue) * 100}%` : '0%' }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Profit</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Loss</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No profit/loss data available
        </div>
      )}
    </div>
  );
};

export default ProfitLossChart;