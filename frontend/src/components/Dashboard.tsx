// File: src/components/Dashboard.tsx
import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_DASHBOARD_DATA, GET_ANALYTICS } from '../api/queries';
import Header from './Header';
import StatsGrid from './StatsGrid';
import RecentSales from './RecentSales';
import ProfitLossChart from './ProfitLossChart';
import LowStockAlert from './LowStockAlert';
import AnalyticsSummary from '../pages/Analytics/AnalyticsSummary'; // Import AnalyticsSummary
import type { DashboardData, LowStockItem, RecentSale, ProfitLossData } from '../types';
import type { AnalyticsData } from '../types/analytics';

interface DashboardQueryResult {
  dashboardData: DashboardData;
  lowStockItems: LowStockItem[];
  recentSales: RecentSale[];
  profitLossData: ProfitLossData[];
}

interface AnalyticsQueryResult {
  analytics: AnalyticsData;
}

const Dashboard: React.FC = () => {
  const { loading, error, data } = useQuery<DashboardQueryResult>(GET_DASHBOARD_DATA);
  
  // Fetch analytics data for the summary
  const { data: analyticsData, loading: analyticsLoading } = useQuery<AnalyticsQueryResult>(GET_ANALYTICS, {
    variables: { period: 'week' } // Get weekly analytics
  });

  if (loading || analyticsLoading) {
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
      
      {/* Add Analytics Summary at the top */}
      {analyticsData?.analytics && (
        <div className="mb-6">
          <AnalyticsSummary data={analyticsData.analytics} />
        </div>
      )}

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




