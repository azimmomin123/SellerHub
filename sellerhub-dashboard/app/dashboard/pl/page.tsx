"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { plData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight, ChevronDown, FileSpreadsheet, Info } from "lucide-react";
import { useState } from "react";
import { PLRow } from "@/lib/types";

const periods = ["Last Month", "Month to Date", "This Month Forecast"];

export default function PLPage() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(["Amazon Fees"]));

  const toggleRow = (category: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Render a row and its subcategories
  const renderRow = (row: PLRow, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedRows.has(row.category);
    const hasSubcategories = row.subcategories && row.subcategories.length > 0;
    const isRevenue = row.category === "Revenue" || row.category === "Gross Profit" || row.category === "Net Profit";
    const isMainRow = depth === 0;

    return (
      <div key={row.category}>
        {/* Main Row */}
        <div
          className={`flex items-center py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
            isMainRow && isRevenue ? "bg-blue-50/50 font-semibold" : ""
          }`}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasSubcategories ? (
              <button
                onClick={() => toggleRow(row.category)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <span className={isMainRow && isRevenue ? "text-blue-900" : "text-gray-700"}>
              {row.category}
            </span>
          </div>
          {row.values.map((value, idx) => (
            <div key={idx} className="w-40 text-right px-2">
              <span
                className={`${
                  isMainRow && isRevenue
                    ? "text-blue-900 font-semibold"
                    : "text-gray-900"
                }`}
              >
                {row.category.toLowerCase().includes("margin") ||
                row.category.toLowerCase().includes("refund rate")
                  ? `${value.toFixed(1)}%`
                  : formatCurrency(value)}
              </span>
            </div>
          ))}
        </div>

        {/* Subcategories */}
        {hasSubcategories && isExpanded && (
          <div className="bg-gray-50/50">
            {row.subcategories!.map((sub) => renderRow(sub, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Calculate totals
  const totalSales = plData.find((r) => r.category === "Revenue")?.values[0] || 0;
  const totalNetProfit = plData.find((r) => r.category === "Net Profit")?.values[0] || 0;
  const margin = ((totalNetProfit / totalSales) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Profit & Loss Statement</h2>
            <p className="text-gray-500">Detailed breakdown of revenues and expenses</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Export to CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Revenue"
            value={formatCurrency(totalSales)}
            subtitle="Last Month"
            color="blue"
          />
          <SummaryCard
            title="Net Profit"
            value={formatCurrency(totalNetProfit)}
            subtitle="Last Month"
            color="green"
          />
          <SummaryCard
            title="Profit Margin"
            value={`${margin.toFixed(1)}%`}
            subtitle="Last Month"
            color="indigo"
          />
          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(
              plData
                .filter((r) => r.category !== "Revenue" && r.category !== "Gross Profit" && r.category !== "Net Profit")
                .reduce((sum, r) => sum + r.values[0], 0)
            )}
            subtitle="Last Month"
            color="amber"
          />
        </div>

        {/* P&L Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-gray-900">Monthly Breakdown</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Info className="w-4 h-4" />
                  Click on categories to expand subcategories
                </div>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="flex items-center py-3 px-6 bg-gray-100 border-b border-gray-200">
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-700">Category</span>
            </div>
            {periods.map((period) => (
              <div key={period} className="w-40 text-right">
                <span className="text-sm font-semibold text-gray-700">{period}</span>
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {plData.map((row) => renderRow(row))}
          </div>
        </div>

        {/* Detailed Expense Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExpenseBreakdown
            title="Amazon Fees Breakdown"
            items={[
              { name: "Referral Fees", amount: 7857.09, percent: 51.6 },
              { name: "FBA Fulfillment Fees", amount: 5238.06, percent: 34.4 },
              { name: "Storage Fees", amount: 852.40, percent: 5.6 },
              { name: "Inbound Shipping", amount: 1280.85, percent: 8.4 },
            ]}
            total={15228.40}
            color="blue"
          />
          <ExpenseBreakdown
            title="Other Expenses Breakdown"
            items={[
              { name: "Virtual Assistant", amount: 850.00, percent: 34.7 },
              { name: "Marketing", amount: 882.00, percent: 36.0 },
              { name: "Office Expenses", amount: 420.20, percent: 17.1 },
              { name: "Software", amount: 298.00, percent: 12.2 },
            ]}
            total={2450.20}
            color="amber"
          />
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About P&L View</h3>
              <p className="text-sm text-blue-700">
                The Profit & Loss view is like your Amazon business's income statement. It lays out
                all components of your profits in a tabular format. Categories can be expanded to
                see sub-components. This view is invaluable for understanding exactly where your
                money is going and how each cost element impacts your bottom line.
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
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: "blue" | "green" | "indigo" | "amber";
}) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
  };

  return (
    <div className={`border rounded-xl p-4 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className="text-xs opacity-70 mt-1">{subtitle}</p>
    </div>
  );
}

function ExpenseBreakdown({
  title,
  items,
  total,
  color,
}: {
  title: string;
  items: { name: string; amount: number; percent: number }[];
  total: number;
  color: "blue" | "amber";
}) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-500",
      light: "bg-blue-100",
      text: "text-blue-700",
    },
    amber: {
      bg: "bg-amber-500",
      light: "bg-amber-100",
      text: "text-amber-700",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-700">{item.name}</span>
              <span className={classes.text}>
                {formatCurrency(item.amount)} ({item.percent.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`${classes.bg} h-2 rounded-full transition-all`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <span className="font-medium text-gray-900">Total</span>
        <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
