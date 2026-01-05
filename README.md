## KRA-Ready Margin Analyzer

Mobile-first Fintech PWA for Kenyan SMEs to track real-time profit after KRA/eTIMS obligations, with M-Pesa STK mock flows and tax impact analysis.

### Stack

- **Frontend**: Vite + React (TypeScript)
- **Styling**: Tailwind CSS + custom components
- **UI Theme**: Safaricom Green `#1EB016` (primary), KRA Red `#ED1C24` (alerts)
- **State**: Local React state + `localStorage` (for future profiles)

### Core Features

- **Net Profit Dashboard**
  - Computes net profit: `Net Profit = Gross Sales - (VAT + DST + Input Costs + Tax Penalty)`
  - VAT at **16%** and Digital Service Tax at **1.5%** on gross sales.
  - Shows a high-contrast margin card with quick breakdown.

- **eTIMS Readiness Score**
  - Score **0–100%** based on ratio of eTIMS-compliant vs informal expenses.
  - Non-eTIMS expenses are treated as **100% non-deductible** from 2026 onwards.

- **Expense Logger**
  - Log expenses as:
    - `eTIMS Compliant` (deductible)
    - `Informal` (non-deductible)
  - Live **tax penalty** preview for informal expenses using Kenyan corporate tax (30%).

- **Tax Impact View**
  - Explains how informal expenses increase taxable profit.
  - Shows total corporate tax penalty created by non-eTIMS expenses.

- **M-Pesa STK Mock (`useMpesa` hook)**
  - Simulates Daraja 2.0 STK Push state machine:
    - `idle → pending → success / failed`
  - Validates Kenyan mobile formats (07xx / 2547xx).
  - Quick Bill UI to trigger a “payment” with success/failure feedback.

- **Mobile Layout**
  - Max width `430px` (iPhone 15/16 Pro size) centered.
  - Bottom navigation: `Home`, `Expenses`, `Tax`, `Settings`.
  - Uses safe-area insets for notched Android/iOS devices.

### Directory Structure (Key Files)

- `src/App.tsx` – Main app, dashboard tabs and M-Pesa Quick Bill.
- `src/layout/MainLayout.tsx` – Mobile wrapper + bottom navigation.
- `src/hooks/useMpesa.ts` – STK push state machine and validation.
- `src/lib/taxUtils.ts` – VAT, DST, corporate tax penalty and KES formatting.
- `src/components/dashboard/MarginCard.tsx` – Net Profit and readiness card.
- `src/components/dashboard/StatusCard.tsx` – Small KPI cards.
- `src/components/ui/BottomNav.tsx` – Bottom tab navigation.
- `src/components/ui/Logo.tsx` – Custom geometric logomark for KRA-Ready.
- `src/theme.ts` – Central brand color definitions.

### Getting Started

#### 1. Install dependencies

From the project root:

```bash
npm install
```

#### 2. Run the development server

```bash
npm run dev
```

- Open the URL printed in the terminal (usually `http://localhost:5173/`).
- Use `Ctrl + F5` to hard-refresh if you don’t see the latest UI.

#### 3. Build for production

```bash
npm run build
```

Then preview the build locally:

```bash
npm run preview
```

### Deploying to Vercel

This repo is configured to work on Vercel as a static Vite build.

1. **Push the project to GitHub/GitLab/Bitbucket.**
2. In the Vercel dashboard, **Import Project** and select this repo.
3. Vercel will auto-detect:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.  
   No extra settings are required; `vercel.json` is included to serve `index.html` for all routes.

### KES & Tax Rules (2026 Assumptions)

- All currency in the UI is formatted as **`KES 1,234`**.
- VAT: **16%** of gross sales.
- Digital Service Tax: **1.5%** of gross sales.
- Corporate tax: **30%** used for the penalty on non-eTIMS expenses.
- From June 2025 (and fully into 2026):
  - Expenses without an eTIMS-compliant receipt are treated as **non-deductible**, creating an extra corporate tax bill equal to `expense * 30%`.

### Extending the App

You can drive future features via short prompts like:

- **Charts / Analytics**  
  “Add a ‘Business Growth’ chart to the Analytics tab using a simple SVG-based bar chart. Show sales trends for the last 7 days in Nairobi vs Mombasa.”

- **eTIMS Receipts**  
  “Modify the sales flow so that every time a transaction is completed, it generates a ‘KRA-Compliant’ digital receipt mock-up.”

- **PWA Support**  
  “Generate the manifest.json and service-worker.js code needed to make this app installable on a Tecno or Samsung phone in Kenya.”

### Design Principles

- **Mobile-money first** – M-Pesa STK interactions are core to the UI.
- **Data-light** – No heavy libraries or chatty APIs; works well on spotty 3G.
- **High contrast** – Dark mode with Safaricom green + KRA red accent for legible metrics in bright outdoor conditions.


