"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { productTrends } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Search, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import { MetricType } from "@/lib/types";

const metricOptions: { value: MetricType; label: string }[] = [
  { value: "sales", label: "Sales" },
  { value: "orders", label: "Orders" },
  { value: "unitsSold", label: "Units Sold" },
  { value: "refunds", label: "Refunds" },
  { value: "advertisingCost", label: "Ad Cost" },
  { value: "grossProfit", label: "Gross Profit" },
  { value: "netProfit", label: "Net Profit" },
  { value: "margin", label: "Margin %" },
  { value: "roi", label: "ROI %" },
];

export default function TrendsPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("netProfit");
  const [sortBy, setSortBy] = useState<"change" | "current">("change");
  const [filterText, setFilterText] = useState("");

  // Filter and sort products
  const filteredProducts = productTrends
    .filter((p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()) ||
      p.sku.toLowerCase().includes(filterText.toLowerCase()) ||
      p.asin.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "change") {
        return Math.abs(b.percentChange) - Math.abs(a.percentChange);
      }
      return b.currentValue - a.currentValue;
    });

  // Calculate summary stats
  const totalSales = productTrends.reduce((sum, p) => sum + p.currentValue, 0);
  const avgChange =
    productTrends.reduce((sum, p) => sum + p.percentChange, 0) / productTrends.length;
  const positiveCount = productTrends.filter((p) => p.percentChange > 0).length;
  const negativeCount = productTrends.filter((p) => p.percentChange < 0).length;

  // Render sparkline
  const renderSparkline = (data: number[], isPositive: boolean) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 80 - 10;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg viewBox="0 0 100 100" className="w-24 h-12">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#22c55e" : "#ef4444"}
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Trends</h2>
            <p className="text-gray-500">Track performance of individual products over time</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Portfolio Value"
            value={formatCurrency(totalSales)}
            subtitle={`${productTrends.length} products`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <SummaryCard
            title="Average Change"
            value={`${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(1)}%`}
            subtitle="vs previous period"
            icon={avgChange >= 0 ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
            color={avgChange >= 0 ? "green" : "red"}
          />
          <SummaryCard
            title="Growing Products"
            value={positiveCount.toString()}
            subtitle={`${((positiveCount / productTrends.length) * 100).toFixed(0)}% of portfolio`}
            icon={<ArrowUp className="w-5 h-5" />}
            color="green"
          />
          <SummaryCard
            title="Declining Products"
            value={negativeCount.toString()}
            subtitle={`${((negativeCount / productTrends.length) * 100).toFixed(0)}% of portfolio`}
            icon={<ArrowDown className="w-5 h-5" />}
            color="red"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {metricOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setSortBy("change")}
                className={`px-3 py-2 text-sm transition-colors ${
                  sortBy === "change"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Change %
              </button>
              <button
                onClick={() => setSortBy("current")}
                className={`px-3 py-2 text-sm transition-colors ${
                  sortBy === "current"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Current Value
              </button>
            </div>
          </div>
        </div>

        {/* Trends Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Current
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Previous
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Change %
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Trend (7d)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const isPositive = product.percentChange > 0;
                  const isNeutral = product.percentChange === 0;

                  return (
                    <tr key={product.asin} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            SKU: {product.sku} • ASIN: {product.asin}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-gray-900">
                          {formatCurrency(product.currentValue)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        {formatCurrency(product.previousValue)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            isNeutral
                              ? "bg-gray-100 text-gray-700"
                              : isPositive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isNeutral ? (
                            <Minus className="w-4 h-4" />
                          ) : isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {isPositive ? "+" : ""}
                          {product.percentChange.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {renderSparkline(product.sparkline, isPositive)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              Top Performers
            </h3>
            <div className="space-y-3">
              {[...productTrends]
                .sort((a, b) => b.percentChange - a.percentChange)
                .slice(0, 3)
                .map((product) => (
                  <div
                    key={product.asin}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        +{product.percentChange.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">{formatCurrency(product.currentValue)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              Needs Attention
            </h3>
            <div className="space-y-3">
              {[...productTrends]
                .sort((a, b) => a.percentChange - b.percentChange)
                .slice(0, 3)
                .map((product) => (
                  <div
                    key={product.asin}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{product.percentChange.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">{formatCurrency(product.currentValue)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Trends View</h3>
              <p className="text-sm text-blue-700">
                The Trends view tracks a chosen KPI for all your products across periods, highlighting
                trends and percentage changes. Use it to identify which products need attention at a
                glance. Sort by change% to see biggest movers, or by current value to see top
                performers. Click on the sparkline to see detailed trend data for any product.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "red";
}) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div className={`border rounded-xl p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium opacity-80">{title}</p>
          <p className="text-lg font-bold">{value}</p>
          <p className="text-xs opacity-70">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
