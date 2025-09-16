// File: src/pages/Analytics/AnalyticsSummary.tsx
import React from 'react';
import type { AnalyticsData } from '../../types/analytics';

interface AnalyticsSummaryProps {
  data: AnalyticsData;
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ data }) => {
  const stats = [
    {
      title: 'Total Sales',
      value: `$${parseFloat(data.totalSales.toString()).toFixed(2)}`,
      change: '+12.4%',
      changeType: 'positive',
      icon: '💰',
      description: 'Total revenue from all sales'
    },
    {
      title: 'Total Profit',
      value: `$${parseFloat(data.totalProfit.toString()).toFixed(2)}`,
      change: parseFloat(data.totalProfit.toString()) >= 0 ? '+8.2%' : '-8.2%',
      changeType: parseFloat(data.totalProfit.toString()) >= 0 ? 'positive' : 'negative',
      icon: '📈',
      description: 'Net profit after costs'
    },
    {
      title: 'Products Sold',
      value: data.totalProductsSold.toString(),
      change: '+5.1%',
      changeType: 'positive',
      icon: '🛒',
      description: 'Total items sold'
    },
    {
      title: 'Avg Order Value',
      value: `$${parseFloat(data.averageOrderValue.toString()).toFixed(2)}`,
      change: '+3.7%',
      changeType: 'positive',
      icon: '📊',
      description: 'Average amount per order'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4 text-2xl">
              {stat.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsSummary;