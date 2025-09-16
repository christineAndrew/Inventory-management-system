// File: src/pages/AnalyticsPage.tsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ANALYTICS, GET_PROFIT_LOSS_ANALYTICS } from '../api/queries';
import type { AnalyticsData, ProfitLossAnalytics } from '../types/analytics';
import ProfitLossChart from '../pages/Analytics/ProfitLossChart';
import SalesTrendChart from '../pages/Analytics/SalesTrendChart';
import AnalyticsSummary from '../pages/Analytics/AnalyticsSummary';
import ExportButton from '../pages/Analytics/ExportButton';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30'); // 30 days
  const [period, setPeriod] = useState('week'); // week/month

  const { data: analyticsData, loading: analyticsLoading } = useQuery<{
    analytics: AnalyticsData
  }>(GET_ANALYTICS, {
    variables: { period }
  });

  const { data: profitLossData, loading: profitLossLoading } = useQuery<{
    profitLossAnalytics: ProfitLossAnalytics
  }>(GET_PROFIT_LOSS_ANALYTICS, {
    variables: { days: parseInt(timeRange) }
  });

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    // Implementation for export functionality
    console.log(`Exporting data in ${format} format`);
    // You would typically generate and download the file here
  };

  if (analyticsLoading || profitLossLoading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <ExportButton onExport={handleExport} />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Period
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {analyticsData?.analytics && (
        <AnalyticsSummary data={analyticsData.analytics} />
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {profitLossData?.profitLossAnalytics && (
          <ProfitLossChart data={profitLossData.profitLossAnalytics} />
        )}
        {analyticsData?.analytics && (
          <SalesTrendChart data={analyticsData.analytics} />
        )}
      </div>

      {/* Detailed Tables */}
      {profitLossData?.profitLossAnalytics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profit/Loss Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Daily Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loss</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profitLossData.profitLossAnalytics.daily.slice(0, 7).map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          ${parseFloat(item.profit.toString()).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          ${parseFloat(item.loss.toString()).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Weekly Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Week</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loss</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profitLossData.profitLossAnalytics.weekly.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Week {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          ${parseFloat(item.profit.toString()).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          ${parseFloat(item.loss.toString()).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;