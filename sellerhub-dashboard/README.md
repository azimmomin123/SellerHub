# SellerHub - Amazon FBA Profit Analytics Dashboard

![SellerHub](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A modern, comprehensive Amazon FBA profit analytics dashboard inspired by sellerboard. Built with Next.js 15, TypeScript, and Tailwind CSS, SellerHub provides real-time visibility into your Amazon business metrics across multiple interactive views.

![SellerHub Dashboard](https://via.placeholder.com/1200x600/1e40af/ffffff?text=SellerHub+Dashboard)

## Features

### 📊 **Five Dashboard Views**

#### 1. **Tiles View**
- Side-by-side KPI comparison across multiple time periods
- Quick snapshot of Sales, Orders, Units Sold, Refunds, Ad Cost, and Net Profit
- Expandable tiles for detailed metrics breakdown
- Color-coded margins and profit indicators
- Perfect for daily account health checks

#### 2. **Chart View**
- Interactive line, bar, and area charts using Recharts
- Visualize trends over time (daily, weekly, monthly)
- Toggle multiple metrics on/off
- Identify correlations between metrics (e.g., ad spend vs. sales)
- Spot seasonality and growth patterns

#### 3. **P&L View**
- Detailed Profit & Loss table with expandable categories
- Drill-down into Amazon Fees (Referral, FBA, Storage, Inbound Shipping)
- Monthly, quarterly, and yearly breakdowns
- Export to CSV functionality
- Margin and ROI calculations

#### 4. **Map View**
- Geographic sales and stock distribution visualization
- Interactive world/region map
- Regional performance comparison
- Stock vs. sales mismatch identification
- Country-by-country metrics table

#### 5. **Trends View**
- Product-by-product performance tracking
- Sparkline mini-charts for quick trend visualization
- Sort by change % or current value
- Top performers vs. declining products
- Early warning system for product issues

### 🎨 **Modern UI/UX**
- Responsive design (mobile, tablet, desktop)
- Dark mode support (in progress)
- Smooth animations and transitions
- Intuitive sidebar navigation
- Accessible color scheme

### 📈 **Key Metrics Tracked**
- **Revenue**: Total sales across all marketplaces
- **Orders**: Number of orders and units sold
- **Refunds**: Refund count and refund costs
- **Advertising Cost**: PPC and ad spend
- **Amazon Fees**: Referral fees, FBA fees, storage fees
- **COGS**: Cost of Goods Sold
- **Gross Profit**: Sales minus direct costs
- **Net Profit**: Profit after all expenses
- **Margin**: Profit as percentage of sales
- **ROI**: Return on Investment

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/azimmomin123/SellerHub.git
   cd SellerHub/sellerhub-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
sellerhub-dashboard/
├── app/
│   ├── dashboard/
│   │   ├── tiles/       # Tiles View page
│   │   ├── charts/      # Chart View page
│   │   ├── pl/          # P&L View page
│   │   ├── map/         # Map View page
│   │   └── trends/      # Trends View page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   └── dashboard-layout.tsx  # Dashboard shell with sidebar
├── lib/
│   ├── types.ts         # TypeScript type definitions
│   ├── utils.ts         # Utility functions
│   └── mock-data.ts     # Demo data
├── public/              # Static assets
└── package.json
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type safety and better DX |
| **Tailwind CSS** | Utility-first CSS framework |
| **Recharts** | Chart and graph library |
| **Lucide React** | Icon library |
| **date-fns** | Date formatting utilities |

## Dashboard Views Explained

### Tiles View - Daily Command Center
The Tiles view is your go-to for quick daily checks. Each tile represents a time period (Today, Yesterday, MTD, etc.) and shows key KPIs at a glance.

**Best for:**
- Daily account health checks
- Quick comparison between periods
- Identifying anomalies
- Spotting margin compression

### Chart View - Visual Storyteller
Transform your data into visual patterns. Plot multiple metrics together to discover correlations and trends.

**Best for:**
- Identifying seasonality
- Spotting upward/downward trends
- Correlation analysis (e.g., ad spend vs. profit)
- Year-over-year comparisons

### P&L View - The Full Picture
Your Amazon business income statement with drill-down capabilities. Every expense category is visible.

**Best for:**
- Monthly financial reviews
- Understanding cost structure
- Identifying cost reduction opportunities
- Preparing investor/partner reports

### Map View - Geographic Intelligence
See where your products are selling and how stock is distributed across regions.

**Best for:**
- Inventory allocation decisions
- Regional marketing strategy
- Identifying underperforming markets
- Stockout prevention

### Trends View - Product-Level Insights
Track every product's performance over time with sparklines and percent change indicators.

**Best for:**
- Identifying winning/losing products
- Product portfolio management
- Early warning on declining SKUs
- New product launch monitoring

## Usage Workflow

### Daily Routine (5 minutes)
1. Open **Tiles View**
2. Check today's sales vs. yesterday
3. Look for anomalies (low profit, high refunds)
4. Drill into concerning metrics

### Weekly Routine (15 minutes)
1. Review **Chart View** for weekly trends
2. Check **Trends View** for products needing attention
3. Adjust bids/pricing based on insights

### Monthly Routine (30 minutes)
1. Full **P&L View** analysis
2. Compare each expense line item
3. Review **Map View** for regional adjustments
4. Set strategy for next month

## Customization

### Adding Your Own Data

The dashboard currently uses mock data in `lib/mock-data.ts`. To integrate real data:

1. Set up an API route in `app/api/`
2. Replace mock data imports with API calls
3. Add authentication for Amazon MWS/SP-API

### Adding New Metrics

1. Update types in `lib/types.ts`
2. Add to mock data in `lib/mock-data.ts`
3. Update relevant components

### Styling Changes

All styles use Tailwind CSS. Customize colors in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    // Your brand colors
  }
}
```

## Roadmap

- [ ] Amazon SP-API integration
- [ ] Dark mode
- [ ] User authentication
- [ ] Multi-account support
- [ ] Email alerts
- [ ] PPC optimization suggestions
- [ ] Inventory forecasting
- [ ] Refund analytics dashboard
- [ ] Product comparison tool
- [ ] Custom date range picker

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Inspiration

This dashboard was inspired by [sellerboard](https://sellerboard.com), an excellent profit analytics tool for Amazon FBA sellers. This is a demo/recreation project for educational purposes.

## Sources

- [sellerboard Official Website](https://sellerboard.com/)
- [Mastering sellerboard's Profitability Dashboard](https://blog.sellerboard.com/2025/06/28/mastering-sellerboards-profitability-dashboard-tiles-charts-pl-map-and-trends/)

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Built with ❤️ by [Azim Momin](https://github.com/azimmomin123)

---

**Note**: This is a demonstration dashboard. The data shown is mock data for illustration purposes. To use with real Amazon data, you would need to integrate with Amazon's Selling Partner API.
