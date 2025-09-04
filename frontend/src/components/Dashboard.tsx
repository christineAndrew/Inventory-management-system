// File: src/components/Dashboard.tsx
import React from 'react';
import { useQuery } from '@apollo/client/react'; // Fixed import
import { GET_DASHBOARD_DATA } from '../api/queries';
import Header from './Header';
import StatsGrid from './StatsGrid';
import RecentSales from './RecentSales';
import ProfitLossChart from './ProfitLossChart';
import LowStockAlert from './LowStockAlert';
import type { DashboardData, LowStockItem, RecentSale, ProfitLossData } from '../types';

interface DashboardQueryResult {
  dashboardData: DashboardData;
  lowStockItems: LowStockItem[];
  recentSales: RecentSale[];
  profitLossData: ProfitLossData[];
}

const Dashboard: React.FC = () => {
  const { loading, error, data } = useQuery<DashboardQueryResult>(GET_DASHBOARD_DATA);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-500">Error loading dashboard: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <StatsGrid data={data?.dashboardData} />
          <ProfitLossChart data={data?.profitLossData} />
        </div>
        <div className="space-y-6">
          <RecentSales data={data?.recentSales} />
          <LowStockAlert data={data?.lowStockItems} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;