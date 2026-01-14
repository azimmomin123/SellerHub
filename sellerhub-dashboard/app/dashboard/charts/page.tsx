"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { chartData } from "@/lib/mock-data";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, DollarSign, BarChart3, Activity } from "lucide-react";
import { useState } from "react";

const chartTypes = [
  { id: "line", label: "Line Chart", icon: TrendingUp },
  { id: "bar", label: "Bar Chart", icon: BarChart3 },
  { id: "area", label: "Area Chart", icon: Activity },
];

export default function ChartsPage() {
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");
  const [activeMetrics, setActiveMetrics] = useState<string[]>(["sales", "netProfit"]);

  const toggleMetric = (metric: string) => {
    setActiveMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const colors: Record<string, string> = {
    sales: "#3b82f6",
    advertisingCost: "#f59e0b",
    refunds: "#ef4444",
    netProfit: "#22c55e",
    orders: "#8b5cf6",
  };

  const labels: Record<string, string> = {
    sales: "Sales",
    advertisingCost: "Ad Cost",
    refunds: "Refunds",
    netProfit: "Net Profit",
    orders: "Orders",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Chart Type Selector */}
        <div className="flex flex-wrap gap-2">
          {chartTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setChartType(type.id as typeof chartType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  chartType === type.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Metrics Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Metrics to Display</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(labels).map((metric) => (
              <button
                key={metric}
                onClick={() => toggleMetric(metric)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  activeMetrics.includes(metric)
                    ? "bg-gray-100 border-gray-300 shadow-inner"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[metric] }}
                />
                <span className="text-sm">{labels[metric]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Performance Over Time</h2>
              <p className="text-sm text-gray-500">Monthly metrics for the current year</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <DollarSign className="w-4 h-4" />
              Currency: USD
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            {chartType === "line" && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    labels[name] || name,
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {activeMetrics.includes("sales") && (
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke={colors.sales}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {activeMetrics.includes("advertisingCost") && (
                  <Line
                    type="monotone"
                    dataKey="advertisingCost"
                    stroke={colors.advertisingCost}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {activeMetrics.includes("refunds") && (
                  <Line
                    type="monotone"
                    dataKey="refunds"
                    stroke={colors.refunds}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {activeMetrics.includes("netProfit") && (
                  <Line
                    type="monotone"
                    dataKey="netProfit"
                    stroke={colors.netProfit}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {activeMetrics.includes("orders") && (
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke={colors.orders}
                    strokeWidth={2}
                    yAxisId="right"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            )}

            {chartType === "bar" && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    labels[name] || name,
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {activeMetrics.map((metric) => (
                  <Bar key={metric} dataKey={metric} fill={colors[metric]} />
                ))}
              </BarChart>
            )}

            {chartType === "area" && (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    labels[name] || name,
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {activeMetrics.includes("sales") && (
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke={colors.sales}
                    fill={colors.sales}
                    fillOpacity={0.3}
                  />
                )}
                {activeMetrics.includes("advertisingCost") && (
                  <Area
                    type="monotone"
                    dataKey="advertisingCost"
                    stroke={colors.advertisingCost}
                    fill={colors.advertisingCost}
                    fillOpacity={0.3}
                  />
                )}
                {activeMetrics.includes("refunds") && (
                  <Area
                    type="monotone"
                    dataKey="refunds"
                    stroke={colors.refunds}
                    fill={colors.refunds}
                    fillOpacity={0.3}
                  />
                )}
                {activeMetrics.includes("netProfit") && (
                  <Area
                    type="monotone"
                    dataKey="netProfit"
                    stroke={colors.netProfit}
                    fill={colors.netProfit}
                    fillOpacity={0.3}
                  />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Sales"
            value={formatCurrency(chartData.reduce((sum, d) => sum + d.sales, 0))}
            color="blue"
          />
          <SummaryCard
            title="Total Ad Spend"
            value={formatCurrency(chartData.reduce((sum, d) => sum + d.advertisingCost, 0))}
            color="amber"
          />
          <SummaryCard
            title="Total Refunds"
            value={formatCurrency(chartData.reduce((sum, d) => sum + d.refunds, 0))}
            color="red"
          />
          <SummaryCard
            title="Total Net Profit"
            value={formatCurrency(chartData.reduce((sum, d) => sum + d.netProfit, 0))}
            color="green"
          />
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Chart View</h3>
              <p className="text-sm text-blue-700">
                The Chart view helps you visualize trends over time. By plotting multiple metrics
                together, you can identify correlations (e.g., between ad spend and sales) and spot
                seasonality patterns. Use the dropdown to switch between line, bar, and area
                charts, and toggle metrics on/off to focus on what matters most.
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
  color,
}: {
  title: string;
  value: string;
  color: "blue" | "amber" | "red" | "green";
}) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    red: "bg-red-50 border-red-200 text-red-700",
    green: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className={`border rounded-xl p-4 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
