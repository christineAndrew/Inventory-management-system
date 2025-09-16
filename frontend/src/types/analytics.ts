// File: src/types/analytics.ts
export interface AnalyticsData {
  totalSales: number;
  totalProfit: number;
  totalProductsSold: number;
  averageOrderValue: number;
  topSellingProducts: any[];
  salesTrend: SalesTrend[];
}

export interface SalesTrend {
  date: string;
  amount: number;
}

export interface ProfitLossData {
  date: string;
  profit: number;
  loss: number;
  revenue: number;
  cost: number;
}

export interface ProfitLossAnalytics {
  daily: ProfitLossData[];
  weekly: ProfitLossData[];
  totalProfit: number;
  totalLoss: number;
  totalRevenue: number;
}
