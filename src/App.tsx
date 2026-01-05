import React, { useMemo, useState } from "react";
import MainLayout from "./layout/MainLayout";
import { BottomNavItem, BottomNavKey } from "./components/ui/BottomNav";
import Logo from "./components/ui/Logo";
import MarginCard from "./components/dashboard/MarginCard";
import StatusCard from "./components/dashboard/StatusCard";
import {
  MarginInputs,
  calculateMargin,
  calculateNonCompliantExpensePenalty,
  formatKES,
} from "./lib/taxUtils";
import { useMpesa } from "./hooks/useMpesa";

type ExpenseType = "etims" | "informal";

interface Expense {
  id: string;
  label: string;
  amount: number;
  type: ExpenseType;
}

const kraNavItems: BottomNavItem[] = [
  { key: "home", label: "Home" },
  { key: "expenses", label: "Expenses" },
  { key: "tax", label: "Tax" },
  { key: "settings", label: "Settings" },
];

const initialExpenses: Expense[] = [
  {
    id: "1",
    label: "Stock from wholesaler",
    amount: 15000,
    type: "etims",
  },
  {
    id: "2",
    label: "Cash fuel (no receipt)",
    amount: 3500,
    type: "informal",
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BottomNavKey>("home");

  const [grossSales, setGrossSales] = useState<number>(65000);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const [newExpenseLabel, setNewExpenseLabel] = useState<string>("");
  const [newExpenseAmount, setNewExpenseAmount] = useState<string>("");
  const [newExpenseType, setNewExpenseType] = useState<ExpenseType>("etims");

  const {
    status: mpesaStatus,
    meta: mpesaMeta,
    error: mpesaError,
    isPending: isMpesaPending,
    isSuccess: isMpesaSuccess,
    initiateStkPush,
    reset: resetMpesa,
  } = useMpesa();

  const [mpesaPhone, setMpesaPhone] = useState<string>("07");
  const [mpesaAmount, setMpesaAmount] = useState<string>("1500");

  const inputCosts = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const nonCompliantExpenseTotal = useMemo(
    () =>
      expenses
        .filter((e) => e.type === "informal")
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const marginInputs: MarginInputs = {
    grossSales,
    inputCosts,
    nonCompliantExpenseTotal,
  };

  const margin = calculateMargin(marginInputs);

  const etimsReadiness = useMemo(() => {
    if (expenses.length === 0) return 100;
    const compliantCount = expenses.filter((e) => e.type === "etims").length;
    return (compliantCount / expenses.length) * 100;
  }, [expenses]);

  const taxPenaltyPreview = useMemo(() => {
    const amount = parseFloat(newExpenseAmount || "0");
    if (!amount || newExpenseType !== "informal") return 0;
    return calculateNonCompliantExpensePenalty(amount);
  }, [newExpenseAmount, newExpenseType]);

  const handleAddExpense = () => {
    const amount = parseFloat(newExpenseAmount || "0");
    if (!newExpenseLabel.trim() || !amount || amount <= 0) return;

    setExpenses((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        label: newExpenseLabel.trim(),
        amount,
        type: newExpenseType,
      },
    ]);

    setNewExpenseLabel("");
    setNewExpenseAmount("");
    setNewExpenseType("etims");
  };

  const handleQuickBill = () => {
    const amount = parseFloat(mpesaAmount || "0");
    initiateStkPush({ phoneNumber: mpesaPhone, amount });
  };

  const renderHomeTab = () => (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <Logo withWordmark size={32} />
        <p className="max-w-[9rem] text-right text-[11px] text-neutral-300">
          Real‑time profit after KRA, VAT & eTIMS rules.
        </p>
      </header>

      <MarginCard margin={margin} etimsReadiness={etimsReadiness} />

      <section className="grid grid-cols-3 gap-2">
        <StatusCard
          label="Gross Sales Today"
          value={grossSales}
          trendLabel="Simulated Nairobi duka"
          variant="success"
        />
        <StatusCard
          label="Total Expenses"
          value={inputCosts}
          trendLabel="Stock, fuel, rent"
        />
        <StatusCard
          label="Non‑eTIMS"
          value={nonCompliantExpenseTotal}
          trendLabel="Fully non‑deductible"
          variant="danger"
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-neutral-900/80 p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-300">
              Recent Transactions
            </p>
            <p className="text-[11px] text-neutral-400">
              Quick snapshot of the last activity.
            </p>
          </div>
          <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            Data‑light
          </span>
        </div>
        <ul className="mt-2 space-y-1.5 text-xs">
          {expenses
            .slice(-3)
            .reverse()
            .map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between rounded-lg bg-neutral-800/80 px-2 py-1"
              >
                <span className="truncate text-neutral-200">
                  {expense.label}
                </span>
                <span
                  className={
                    expense.type === "etims"
                      ? "text-emerald-300"
                      : "text-red-300"
                  }
                >
                  {formatKES(expense.amount)}
                </span>
              </li>
            ))}
        </ul>
      </section>

      <section className="sticky bottom-20 left-0 right-0">
        <div className="rounded-full bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-800/50">
          Log more expenses under{" "}
          <span className="font-bold">eTIMS Compliant</span> to protect profit.
        </div>
      </section>
    </div>
  );

  const renderExpensesTab = () => (
    <div className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
          Expense Logger
        </p>
        <p className="text-sm text-neutral-300">
          Tag each cost as eTIMS Compliant or Informal.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-neutral-900/80 p-3">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-300">
            Expense label
          </label>
          <input
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
            placeholder="E.g. Wholesale stock, rent, fuel"
            value={newExpenseLabel}
            onChange={(e) => setNewExpenseLabel(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-300">
              Amount (KES)
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
              type="number"
              min={0}
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-1 flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setNewExpenseType("etims")}
            className={[
              "flex-1 rounded-full border px-3 py-1.5 font-medium transition-colors",
              newExpenseType === "etims"
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                : "border-neutral-700 bg-neutral-900 text-neutral-300",
            ].join(" ")}
          >
            eTIMS Compliant
          </button>
          <button
            type="button"
            onClick={() => setNewExpenseType("informal")}
            className={[
              "flex-1 rounded-full border px-3 py-1.5 font-medium transition-colors",
              newExpenseType === "informal"
                ? "border-red-500 bg-red-500/20 text-red-300"
                : "border-neutral-700 bg-neutral-900 text-neutral-300",
            ].join(" ")}
          >
            Informal
          </button>
        </div>

        {taxPenaltyPreview > 0 && (
          <p className="mt-1 text-[11px] text-red-300">
            This informal expense will add{" "}
            <span className="font-semibold">
              {formatKES(taxPenaltyPreview)}
            </span>{" "}
            in extra corporate tax because it is 100% non‑deductible in 2026.
          </p>
        )}

        <button
          type="button"
          onClick={handleAddExpense}
          className="mt-2 w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-800/60 disabled:cursor-not-allowed disabled:bg-neutral-700"
          disabled={!newExpenseLabel.trim() || !newExpenseAmount}
        >
          Add Expense
        </button>
      </section>

      <section className="space-y-2 rounded-2xl border border-white/10 bg-neutral-900/80 p-3 text-xs">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-neutral-200">All Expenses</p>
          <p className="text-neutral-400">
            eTIMS:{" "}
            <span className="font-semibold text-emerald-300">
              {expenses.filter((e) => e.type === "etims").length}
            </span>{" "}
            · Informal:{" "}
            <span className="font-semibold text-red-300">
              {expenses.filter((e) => e.type === "informal").length}
            </span>
          </p>
        </div>
        <ul className="mt-1 space-y-1.5">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between rounded-lg bg-neutral-800/80 px-2 py-1.5"
            >
              <div>
                <p className="text-xs font-medium text-neutral-100">
                  {expense.label}
                </p>
                <p className="text-[10px] text-neutral-400">
                  {expense.type === "etims"
                    ? "eTIMS Compliant – deductible"
                    : "Informal – non‑deductible"}
                </p>
              </div>
              <span
                className={
                  expense.type === "etims"
                    ? "text-emerald-300"
                    : "text-red-300"
                }
              >
                {formatKES(expense.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  const renderTaxTab = () => (
    <div className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
          Tax Impact
        </p>
        <p className="text-sm text-neutral-300">
          Understand how non‑eTIMS expenses hit your profit.
        </p>
      </header>

      <section className="space-y-2 rounded-2xl border border-white/10 bg-neutral-900/80 p-3 text-xs">
        <p className="text-neutral-300">
          Since June 2025, informal expenses without an eTIMS receipt are{" "}
          <span className="font-semibold text-red-300">
            100% non‑deductible
          </span>
          . That means your taxable profit increases by the full amount.
        </p>
        <p className="text-neutral-300">
          For your duka, this adds a corporate tax penalty of{" "}
          <span className="font-semibold">
            {formatKES(margin.taxPenalty)}
          </span>{" "}
          on current informal expenses.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-red-700/60 bg-red-950/40 p-3 text-xs">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-red-300">
          Live Penalty Calculator
        </p>
        <p className="text-neutral-200">
          Enter a single informal expense to see the extra tax you will pay.
        </p>
        <div className="flex gap-2">
          <input
            className="w-full flex-1 rounded-lg border border-red-600/60 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-red-500 focus:border-red-500 focus:ring-1"
            type="number"
            min={0}
            placeholder="Amount in KES"
            value={newExpenseAmount}
            onChange={(e) => {
              setNewExpenseAmount(e.target.value);
              setNewExpenseType("informal");
            }}
          />
        </div>
        {taxPenaltyPreview > 0 && (
          <p className="text-sm text-red-100">
            Extra tax on this one informal cost:{" "}
            <span className="font-semibold">
              {formatKES(taxPenaltyPreview)}
            </span>
            .
          </p>
        )}
      </section>

      <section className="space-y-2 rounded-2xl border border-emerald-600/60 bg-emerald-950/40 p-3 text-xs">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
          eTIMS Readiness Score
        </p>
        <p className="text-neutral-100">
          Your current readiness is{" "}
          <span className="font-semibold text-emerald-300">
            {Math.round(etimsReadiness)}%
          </span>
          . Move informal costs to eTIMS‑compliant suppliers to lift this to
          100%.
        </p>
      </section>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
          Settings
        </p>
        <p className="text-sm text-neutral-300">
          Basic configuration for your KRA‑Ready workspace.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-neutral-900/80 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-neutral-200">Daily Gross Sales</span>
          <input
            className="w-28 rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1 text-right text-xs text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
            type="number"
            min={0}
            value={grossSales}
            onChange={(e) => setGrossSales(parseFloat(e.target.value || "0"))}
          />
        </div>
        <p className="text-[11px] text-neutral-400">
          Adjust this to match a typical day for your shop. All profit
          calculations update automatically.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-neutral-900/80 p-3 text-xs">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          About
        </p>
        <p className="text-neutral-200">
          KRA‑Ready Margin Analyzer focuses on{" "}
          <span className="font-semibold">mobile‑money</span>,{" "}
          <span className="font-semibold">data‑light</span> workflows that feel
          native on Kenyan Android devices.
        </p>
      </section>
    </div>
  );

  const renderQuickBill = () => (
    <section className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-neutral-900/90 p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-300">
            Quick Bill via M‑Pesa
          </p>
          <p className="text-[11px] text-neutral-400">
            Simulated Daraja STK push for dukas.
          </p>
        </div>
        <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          STK Mock
        </span>
      </div>

      <div className="mt-2 flex gap-2">
        <input
          className="w-full max-w-[9rem] rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-xs text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
          placeholder="07xx..."
          value={mpesaPhone}
          onChange={(e) => setMpesaPhone(e.target.value)}
        />
        <input
          className="w-full max-w-[6rem] rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-xs text-white outline-none ring-emerald-500 focus:border-emerald-500 focus:ring-1"
          type="number"
          min={0}
          value={mpesaAmount}
          onChange={(e) => setMpesaAmount(e.target.value)}
        />
        <button
          type="button"
          onClick={handleQuickBill}
          disabled={isMpesaPending}
          className="flex-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-800/50 disabled:cursor-not-allowed disabled:bg-neutral-700"
        >
          {isMpesaPending ? "Pushing…" : "Quick Bill"}
        </button>
      </div>

      {mpesaStatus !== "idle" && (
        <div className="mt-2 text-[11px]">
          {mpesaStatus === "pending" && (
            <p className="text-neutral-300">
              STK push sent to your phone. Enter PIN to complete.
            </p>
          )}
          {mpesaStatus === "success" && mpesaMeta && (
            <p className="text-emerald-300">
              Payment of{" "}
              <span className="font-semibold">
                {formatKES(mpesaMeta.amount)}
              </span>{" "}
              to till reference{" "}
              <span className="font-mono text-xs">{mpesaMeta.reference}</span>{" "}
              completed.
            </p>
          )}
          {mpesaStatus === "failed" && (
            <p className="text-red-300">
              {mpesaError || "STK push failed. Try again."}
            </p>
          )}
          {(mpesaStatus === "success" || mpesaStatus === "failed") && (
            <button
              type="button"
              className="mt-1 text-[11px] font-medium text-emerald-400 underline underline-offset-2"
              onClick={resetMpesa}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </section>
  );

  let content: React.ReactNode;
  if (activeTab === "home") content = renderHomeTab();
  else if (activeTab === "expenses") content = renderExpensesTab();
  else if (activeTab === "tax") content = renderTaxTab();
  else content = renderSettingsTab();

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      navItems={kraNavItems}
    >
      {content}
      {renderQuickBill()}
    </MainLayout>
  );
};

export default App;


