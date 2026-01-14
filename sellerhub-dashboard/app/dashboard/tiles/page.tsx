"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { MetricTileCard } from "@/components/metric-tile-card";
import { metricTiles } from "@/lib/mock-data";
import { ArrowDown, ArrowUp, TrendingUp, DollarSign, Package, ShoppingCart, RefreshCw } from "lucide-react";
import { formatCurrency, getPercentChange } from "@/lib/utils";

export default function TilesPage() {
  // Calculate changes from yesterday to today
  const today = metricTiles.find((t) => t.period === "today")!;
  const yesterday = metricTiles.find((t) => t.period === "yesterday")!;

  const salesChange = getPercentChange(today.sales, yesterday.sales);
  const ordersChange = getPercentChange(today.orders, yesterday.orders);
  const profitChange = getPercentChange(today.netProfit, yesterday.netProfit);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickStat
            label="Sales Today"
            value={formatCurrency(today.sales)}
            change={salesChange}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <QuickStat
            label="Orders Today"
            value={today.orders.toString()}
            change={ordersChange}
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <QuickStat
            label="Units Sold Today"
            value={today.unitsSold.toString()}
            change={getPercentChange(today.unitsSold, yesterday.unitsSold)}
            icon={<Package className="w-5 h-5" />}
          />
          <QuickStat
            label="Net Profit Today"
            value={formatCurrency(today.netProfit)}
            change={profitChange}
            icon={<TrendingUp className="w-5 h-5" />}
            highlight
          />
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {metricTiles.map((tile) => (
            <MetricTileCard key={tile.period} tile={tile} />
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <SummaryCard
            title="Month to Date Summary"
            data={metricTiles.find((t) => t.period === "mtd")!}
          />
          <SummaryCard
            title="This Month Forecast"
            data={metricTiles.find((t) => t.period === "thisMonthForecast")!}
          />
          <SummaryCard
            title="Last Month Actual"
            data={metricTiles.find((t) => t.period === "lastMonth")!}
          />
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Tiles View</h3>
              <p className="text-sm text-blue-700">
                The Tiles view is your everyday command center. It shows key metrics across multiple
                time periods side by side, making it easy to compare performance. Many sellers check
                this view daily to monitor account health, spot anomalies, and make quick decisions.
                Click on any tile to see more details about that time period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function QuickStat({
  label,
  value,
  change,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  const isPositive = change >= 0;

  return (
    <div
      className={`bg-white rounded-xl border p-4 ${
        highlight ? "border-green-200 bg-green-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{label}</span>
        <div className={`${highlight ? "text-green-600" : "text-gray-400"}`}>{icon}</div>
      </div>
      <p className={`text-2xl font-bold ${highlight ? "text-green-700" : "text-gray-900"}`}>
        {value}
      </p>
      <div className={`flex items-center gap-1 text-sm mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        {Math.abs(change).toFixed(1)}% vs yesterday
      </div>
    </div>
  );
}

function SummaryCard({ title, data }: { title: string; data: typeof metricTiles[0] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        <SummaryRow label="Sales" value={formatCurrency(data.sales)} />
        <SummaryRow label="Gross Profit" value={formatCurrency(data.grossProfit)} />
        <SummaryRow label="Net Profit" value={formatCurrency(data.netProfit)} highlight />
        <SummaryRow label="Margin" value={`${data.margin}%`} />
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between ${highlight ? "py-2 px-3 bg-green-50 rounded-lg -mx-3" : ""}`}>
      <span className={`text-sm ${highlight ? "font-medium text-green-700" : "text-gray-500"}`}>
        {label}
      </span>
      <span className={`text-sm font-medium ${highlight ? "text-green-700" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}
