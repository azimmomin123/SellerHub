"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { regionData } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Globe, MapPin, Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";

// Simple world map regions with coordinates
const mapRegions = [
  { id: "us", name: "United States", path: "M 180,130 L 220,130 L 230,150 L 210,170 L 170,160 Z", region: "North America" },
  { id: "ca", name: "Canada", path: "M 175,110 L 200,110 L 200,125 L 175,125 Z", region: "North America" },
  { id: "uk", name: "United Kingdom", path: "M 380,115 L 395,115 L 395,125 L 380,125 Z", region: "Europe" },
  { id: "de", name: "Germany", path: "M 410,120 L 425,120 L 425,130 L 410,130 Z", region: "Europe" },
  { id: "fr", name: "France", path: "M 390,130 L 405,130 L 405,145 L 390,145 Z", region: "Europe" },
  { id: "it", name: "Italy", path: "M 415,140 L 425,140 L 425,155 L 415,155 Z", region: "Europe" },
  { id: "es", name: "Spain", path: "M 385,145 L 400,145 L 400,155 L 385,155 Z", region: "Europe" },
  { id: "jp", name: "Japan", path: "M 580,140 L 600,140 L 600,160 L 580,160 Z", region: "Asia-Pacific" },
  { id: "au", name: "Australia", path: "M 520,220 L 550,220 L 550,250 L 520,250 Z", region: "Asia-Pacific" },
];

export default function MapPage() {
  const [viewMode, setViewMode] = useState<"sales" | "stock">("sales");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Aggregate data by region
  const regionAggregates = regionData.reduce((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = {
        revenue: 0,
        unitsSold: 0,
        currentStock: 0,
        grossProfit: 0,
        refunds: 0,
        countries: 0,
      };
    }
    acc[item.region].revenue += item.revenue;
    acc[item.region].unitsSold += item.unitsSold;
    acc[item.region].currentStock += item.currentStock;
    acc[item.region].grossProfit += item.grossProfit;
    acc[item.region].refunds += item.refunds;
    acc[item.region].countries += 1;
    return acc;
  }, {} as Record<string, typeof regionData>);

  const maxRevenue = Math.max(...regionData.map((r) => r.revenue));
  const maxStock = Math.max(...regionData.map((r) => r.currentStock));

  const getRegionIntensity = (countryName: string) => {
    const country = regionData.find((r) => r.country === countryName);
    if (!country) return 0;
    const value = viewMode === "sales" ? country.revenue : country.currentStock;
    const max = viewMode === "sales" ? maxRevenue : maxStock;
    return (value / max) * 100;
  };

  const selectedData = selectedCountry
    ? regionData.find((r) => r.country === selectedCountry)
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Geographic Sales & Stock</h2>
            <p className="text-gray-500">View your sales and inventory distribution by region</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("sales")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                viewMode === "sales"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Sales View
            </button>
            <button
              onClick={() => setViewMode("stock")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                viewMode === "stock"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Package className="w-4 h-4" />
              Stock View
            </button>
          </div>
        </div>

        {/* Map and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {viewMode === "sales" ? "Sales by Region" : "Stock by Region"}
            </h3>

            {/* Simple SVG Map */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
              <svg viewBox="0 0 700 300" className="w-full h-auto">
                {/* Background */}
                <rect width="700" height="300" fill="#f8fafc" rx="8" />

                {/* Ocean */}
                <rect width="700" height="300" fill="#dbeafe" rx="8" />

                {/* Continents (simplified) */}
                <g opacity="0.3">
                  {/* North America */}
                  <path d="M 140,80 L 260,80 L 280,160 L 200,190 L 120,160 Z" fill="#94a3b8" />
                  {/* Europe */}
                  <path d="M 360,100 L 440,100 L 450,150 L 370,150 Z" fill="#94a3b8" />
                  {/* Asia */}
                  <path d="M 460,80 L 620,80 L 640,180 L 500,190 Z" fill="#94a3b8" />
                  {/* Australia */}
                  <path d="M 500,210 L 570,210 L 570,270 L 500,270 Z" fill="#94a3b8" />
                </g>

                {/* Country markers */}
                {mapRegions.map((region) => {
                  const intensity = getRegionIntensity(region.name);
                  const isSelected = selectedCountry === region.name;
                  return (
                    <g key={region.id}>
                      <circle
                        cx={region.path.split(" ")[1].split(",")[0]}
                        cy={region.path.split(" ")[1].split(",")[1]}
                        r={isSelected ? 20 : 12 + intensity / 10}
                        fill={
                          viewMode === "sales"
                            ? `rgba(59, 130, 246, ${0.4 + intensity / 150})`
                            : `rgba(34, 197, 94, ${0.4 + intensity / 150})`
                        }
                        stroke={isSelected ? "#1e40af" : "white"}
                        strokeWidth={isSelected ? 3 : 2}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedCountry(region.name)}
                      />
                      <text
                        x={region.path.split(" ")[1].split(",")[0]}
                        y={region.path.split(" ")[1].split(",")[1]}
                        textAnchor="middle"
                        dy={4}
                        className="text-[8px] fill-white font-medium pointer-events-none"
                      >
                        {region.id.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500" />
                  <span className="text-gray-600">Low Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-700" />
                  <span className="text-gray-600">High Sales</span>
                </div>
              </div>
            </div>
          </div>

          {/* Country Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {selectedData ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedData.country}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedData.region}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    label="Revenue"
                    value={formatCurrency(selectedData.revenue)}
                    icon={<DollarSign className="w-5 h-5" />}
                    color="blue"
                  />
                  <MetricCard
                    label="Units Sold"
                    value={formatNumber(selectedData.unitsSold)}
                    icon={<Package className="w-5 h-5" />}
                    color="indigo"
                  />
                  <MetricCard
                    label="Gross Profit"
                    value={formatCurrency(selectedData.grossProfit)}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="green"
                  />
                  <MetricCard
                    label="Refunds"
                    value={selectedData.refunds.toString()}
                    icon={<AlertTriangle className="w-5 h-5" />}
                    color="amber"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Current Stock</h4>
                  <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-end pr-3"
                      style={{
                        width: `${Math.min(
                          (selectedData.currentStock /
                            Math.max(...regionData.map((r) => r.currentStock))) *
                            100,
                          100
                        )}%`,
                      }}
                    >
                      <span className="text-xs font-medium text-white">
                        {selectedData.currentStock} units
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <Globe className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  Click on a country marker to see detailed metrics
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Regional Summary */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Regional Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Region
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Gross Profit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Margin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(regionAggregates).map(([region, data]) => (
                  <tr key={region} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{region}</span>
                        <span className="text-xs text-gray-500">({data.countries} countries)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      {formatCurrency(data.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      {formatNumber(data.unitsSold)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      {formatNumber(data.currentStock)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-medium">
                      {formatCurrency(data.grossProfit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      {((data.grossProfit / data.revenue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Country Details Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Country Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Country
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Refunds
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Gross Profit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {regionData.map((country) => (
                  <tr
                    key={country.country}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedCountry === country.country ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedCountry(country.country)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                          {country.country.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{country.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      {formatCurrency(country.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      {formatNumber(country.unitsSold)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      {formatNumber(country.currentStock)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-amber-600">
                      {country.refunds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-medium">
                      {formatCurrency(country.grossProfit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">About Map View</h3>
              <p className="text-sm text-blue-700">
                The Map view offers a geographical perspective on your sales and stock. Darker
                regions indicate higher sales volume. Toggle between Sales and Stock views to see
                where your products are selling best and how inventory is distributed. Use this
                view to identify regional opportunities and optimize your inventory placement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "amber" | "indigo";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
