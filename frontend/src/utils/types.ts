// types.ts
export type LowStockItem = {
  id: string;
  name: string;
  unit: string;
  quantityInStock: number;
  reorderLevel: number;
};

export type PopularItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: {
    name: string;
  };
  orderCount: number;
};

export type DashboardStats = {
  totalOrders: number;
  activeOrders: number;
  revenueToday: string;
  revenueWeek: string;
  revenueMonth: string;
  newCustomers: number;
  staffOnDuty: number;
  availableTables: number;
  occupiedTables: number;
  lowStockItems: LowStockItem[];
  popularItems: PopularItem[];
};

export type DashboardStatsResponse = {
  dashboardStats: DashboardStats;
};

export type StatCard = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
};

export type RevenueData = {
  day: string;
  amount: number;
};