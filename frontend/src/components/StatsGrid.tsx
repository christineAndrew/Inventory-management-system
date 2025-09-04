import React from 'react';
import type { DashboardData } from '../types';

interface StatsGridProps {
  data?: DashboardData;
}

const StatsGrid: React.FC<StatsGridProps> = ({ data }) => {
  const stats = [
    {
      title: 'Daily Profit',
      value: `$${Number(data?.dailyProfit || 0).toFixed(2)}`,
      change: '+0.0%',
      changeType: data?.dailyProfit && Number(data.dailyProfit) > 0 ? 'positive' : 'negative',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Weekly Profit',
      value: `$${Number(data?.weeklyProfit || 0).toFixed(2)}`,
      change: '+0.0%',
      changeType: data?.weeklyProfit && Number(data.weeklyProfit) > 0 ? 'positive' : 'negative',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Daily Loss',
      value: `$${Number(data?.dailyLoss || 0).toFixed(2)}`,
      change: '+0.0%',
      changeType: data?.dailyLoss && Number(data.dailyLoss) > 0 ? 'negative' : 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Weekly Loss',
      value: `$${Number(data?.weeklyLoss || 0).toFixed(2)}`,
      change: '+0.0%',
      changeType: data?.weeklyLoss && Number(data.weeklyLoss) > 0 ? 'negative' : 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    },
    {
      title: 'Total Products',
      value: data?.totalProducts?.toString() || '0',
      change: '+0',
      changeType: 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      title: 'Products Sold Today',
      value: data?.productsSoldToday?.toString() || '0',
      change: '+0',
      changeType: 'positive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="flex-shrink-0 mr-4">
            {stat.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
