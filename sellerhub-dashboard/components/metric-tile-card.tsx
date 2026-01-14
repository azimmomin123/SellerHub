"use client";

import { MetricTile } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { ArrowUpDown, TrendingUp, Calendar, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface MetricTileCardProps {
  tile: MetricTile;
}

export function MetricTileCard({ tile }: MetricTileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/80" />
          <h3 className="font-semibold text-white">{tile.label}</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/80 hover:text-white"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Key Metrics */}
      <div className="p-4 space-y-3">
        <MetricRow
          label="Sales"
          value={formatCurrency(tile.sales)}
          highlight="primary"
        />
        <MetricRow
          label="Orders"
          value={formatNumber(tile.orders)}
          subtitle={`${tile.unitsSold} units`}
        />
        <MetricRow
          label="Net Profit"
          value={formatCurrency(tile.netProfit)}
          highlight="success"
          subtitle={`${tile.margin}% margin`}
        />

        {/* Expanded Metrics */}
        {isExpanded && (
          <div className="pt-3 border-t border-gray-100 space-y-2 mt-3">
            <MetricRow
              label="Gross Profit"
              value={formatCurrency(tile.grossProfit)}
              size="sm"
            />
            <MetricRow
              label="Ad Cost"
              value={formatCurrency(tile.advertisingCost)}
              size="sm"
            />
            <MetricRow
              label="Est. Payout"
              value={formatCurrency(tile.estimatedPayout)}
              size="sm"
            />
            <MetricRow
              label="Amazon Fees"
              value={formatCurrency(tile.amazonFees)}
              size="sm"
            />
            <MetricRow
              label="Refunds"
              value={`${tile.refunds}`}
              size="sm"
            />
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          {isExpanded ? "Show less" : "Show more"}
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  highlight?: "primary" | "success" | "warning" | "danger" | null;
  size?: "md" | "sm";
  subtitle?: string;
}

function MetricRow({ label, value, highlight, size = "md", subtitle }: MetricRowProps) {
  const sizeClasses = size === "md" ? "text-lg" : "text-sm";

  const highlightClasses = {
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-amber-600",
    danger: "text-red-600",
    null: "text-gray-900",
  };

  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-right">
        <p className={`font-semibold ${sizeClasses} ${highlightClasses[highlight ?? "null"]}`}>
          {value}
        </p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}
