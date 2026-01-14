// Types for the Amazon FBA Dashboard

export type TimePeriod = "today" | "yesterday" | "mtd" | "lastMonth" | "thisMonthForecast";

export interface MetricTile {
  period: TimePeriod;
  label: string;
  sales: number;
  orders: number;
  unitsSold: number;
  refunds: number;
  advertisingCost: number;
  estimatedPayout: number;
  grossProfit: number;
  netProfit: number;
  margin: number;
  amazonFees: number;
  cogs: number;
  shippingCost: number;
}

export interface ChartDataPoint {
  date: string;
  sales: number;
  advertisingCost: number;
  refunds: number;
  netProfit: number;
  orders: number;
}

export interface PLRow {
  category: string;
  subcategories?: PLRow[];
  values: number[];
  isExpandable?: boolean;
  isExpanded?: boolean;
}

export interface RegionData {
  region: string;
  country: string;
  unitsSold: number;
  currentStock: number;
  refunds: number;
  revenue: number;
  grossProfit: number;
}

export interface ProductTrend {
  asin: string;
  sku: string;
  name: string;
  currentValue: number;
  previousValue: number;
  percentChange: number;
  sparkline: number[];
}

export type MetricType =
  | "sales"
  | "orders"
  | "unitsSold"
  | "refunds"
  | "advertisingCost"
  | "grossProfit"
  | "netProfit"
  | "margin"
  | "roi";

export interface DashboardView {
  id: string;
  name: string;
  icon: string;
  path: string;
}
