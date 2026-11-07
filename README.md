# SpendWise — Personal Expense Tracker

A modern, high-performance personal financial management web application built with a focus on fintech ergonomics, minimalist aesthetics, and data privacy.

Designed with visual inspiration from **Linear**, **Stripe Dashboard**, **Notion**, and **Raycast**, SpendWise delivers a focused experience with zero external trackers, no required server backend, and 100% persistent client-side storage.

![SpendWise Banner](assets/icons/logo.svg)

---

## 1. Key Highlights & Features

### 🏛️ Fintech-Grade Financial Dashboard
- **Dynamic Calculation Engine**: Instantly computes **Total Balance**, **Total Income**, **Total Expenses**, and **Net Savings Rate** dynamically from recorded transactions.
- **Monthly Budget Pace Tracker**: Real-time pacing meter tracking overall spending against monthly targets with visual warnings:
  - `Normal` (< 80% used) — Subtle emerald theme.
  - `Approaching Limit` (80% – 100% used) — Warm amber caution.
  - `Exceeded` (> 100% used) — Crisp crimson warning.
- **Interactive 6-Month Expense Trends**: Responsive Chart.js visualization displaying historical monthly outflows with currency formatting in Indian Rupee (`₹12,500.00`). Includes a toggle for **Expenses Only** or **Income vs Expenses** comparative analysis.
- **Category Breakdown Doughnut Chart**: Interactive spend distribution with central total metric and interactive legend with exact percentage and amount shares.
- **Recent Activity Ledger**: Quick snapshot of latest transactions with instant editing and deletion shortcuts.

---

### 💳 Complete Transaction Management
- **Dual Flow Support**: Record both **Expenses** and **Income** with tailored category presets:
  - *Expense Categories*: Food & Dining, Shopping, Travel & Commute, Bills & Utilities, Education, Entertainment, Health & Medical, Other.
  - *Income Categories*: Salary, Freelance / Consulting, Investment Returns, Business Income, Other.
- **Inline Editing & Deletion**: Update existing records or delete with a safety confirmation dialog.
- **Multivariate Filtering**:
  - Live search across description, notes, category, and amounts.
  - Filter by transaction type (`All`, `Income`, `Expense`).
  - Filter by category.
  - Filter by timeframe (`All Time`, `This Month`, `Last Month`, `Last 6 Months`, `This Year`).
  - Sort by date (newest/oldest) or amount (highest/lowest).
- **Pagination**: Clean, responsive page controls displaying record counts and ranges.
- **CSV Data Export**: Instant download of all transactions in standardized CSV format for spreadsheet analysis (Excel, Google Sheets).

---

### 📊 Deep-Dive Financial Analytics
- **Customizable Time Windows**: Filter metrics by year and specific months.
- **Key Financial Metrics**:
  - Total period income and expense outflow.
  - Net savings and savings rate percentage.
  - Highest spending category identification.
  - Average monthly expense across active tracking months.
- **Dual Visualizations**:
  - Grouped monthly Cash Flow Comparison (Inflows vs Outflows).
  - Horizontal bar distribution showing categorical expenditure rankings.
- **Category Share Audit Table**: Transaction count, total sum, percentage share, and distribution bar.

---

### 🎯 Multi-Tier Budget Control
- **Overall Monthly Ceiling**: Adjust your global monthly expense ceiling.
- **Per-Category Budget Caps**: Define explicit caps for each category (Food, Travel, Bills, etc.).
- **Live Pacing Meters**: Category cards automatically calculate remaining allowance and color-code warning states as you approach limits.

---

### ⚙️ Privacy, Persistence & Data Management
- **100% Client-Side Privacy**: All financial entries remain strictly on your device in browser `LocalStorage`.
- **Full JSON Backup & Restore**: Download complete backups containing transactions, custom budgets, and profile settings, and restore them anytime.
- **Sample Demonstration Data**: Built-in 6-month realistic financial dataset (June – November 2026) for testing and portfolio showcase, with one-click reloading.
- **Safe Danger Zone**: Options to clear all recorded transactions or factory reset the application with clear confirmation dialogs.

---

### 🌗 Refined Theme System
- **Light Theme**: Crisp off-white `#F8FAFC`, clean `#FFFFFF` surface cards, slate `#172033` typography, and `#16845B` emerald accents.
- **Dark Theme**: Deep charcoal `#0B0F17`, elevated slate `#141A26` surfaces, crisp typography `#F1F5F9`, and vivid `#1EB87D` accents.
- **Live Theme Synchronization**: Chart.js grids, tooltips, and legends dynamically refresh colors when toggling themes.

---

## 2. Technology Stack

- **Markup**: Semantic HTML5 with ARIA accessibility labels and modal dialog structures.
- **Styles**: Modern CSS3 utilizing custom design tokens (CSS variables), CSS Grid, Flexbox, hairline 1px borders, and responsive breakpoints.
- **Logic**: Vanilla JavaScript (ES6+) with zero build-tool dependencies, object-oriented state management, and strict separation of concerns.
- **Visualizations**: [Chart.js](https://www.chartjs.org/) for clean financial charting with custom INR formatters and tooltip theming.
- **Icons**: [Lucide Icons](https://lucide.dev/) for crisp, uniform iconography, backed with inline SVG fallbacks.
- **Typography**: [Inter](https://fonts.google.com/specimen/Inter) font with tabular numbers (`tabular-nums`) to prevent numeric jitter.

---

## 3. Project Directory Structure

```
spendwise/
├── index.html            # Main semantic application layout & view templates
├── style.css             # Design system, CSS variables, dark mode & responsiveness
├── script.js             # Core state manager, calculation engine, views & Chart.js logic
├── assets/
│   └── icons/            # SVG vector assets, logos, and favicons
│       ├── logo.svg
│       ├── favicon.svg
│       ├── wallet.svg
│       ├── chart.svg
│       └── receipt.svg
└── README.md             # Architecture documentation & guide
```

---

## 4. Getting Started

SpendWise is completely zero-config and runs in any modern browser without npm, node, or web servers:

1. Clone or download the `spendwise` repository:
   ```bash
   git clone https://github.com/your-username/spendwise.git
   cd spendwise
   ```
2. Open `index.html` directly in your browser:
   - Double click `index.html`, OR
   - Run a lightweight local server (optional):
     ```bash
     python -m http.server 8000
     # Or npx serve
     ```
3. SpendWise will load with realistic sample data pre-populated so you can immediately explore charts, transactions, analytics, and budgets!

---

## 5. Keyboard Shortcuts

- <kbd>/</kbd> — Focus the global transaction search bar.
- <kbd>N</kbd> — Open the **Add Transaction** modal from anywhere.
- <kbd>Esc</kbd> — Dismiss any open modal dialog.

---

## 6. Design Principles & Anti-Patterns Avoided

In strict accordance with the product design guidelines:
- ❌ **No Purple/Violet generic gradients**
- ❌ **No Glassmorphism blur trends that compromise legibility**
- ❌ **No Oversized 9999px pill buttons**
- ❌ **No Neon or AI-template gimmicks**
- ❌ **No Emojis used as interface icons**
- ✔️ **Hairline 1px borders (`#E8EDF2` / `#232B3E`)**
- ✔️ **Restrained, high-contrast palette with purposeful status accents**
- ✔️ **Tabular figures for financial amounts**
- ✔️ **Compact, tactile buttons with moderate 6–10px radii**

---

## 7. License

MIT License. Crafted for modern personal financial tracking and portfolio demonstration.
