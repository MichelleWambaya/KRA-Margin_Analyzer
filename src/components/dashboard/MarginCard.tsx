import React from "react";
import { MarginBreakdown, formatKES } from "../../lib/taxUtils";

export interface MarginCardProps {
  margin: MarginBreakdown;
  etimsReadiness: number; // 0–100
}

export const MarginCard: React.FC<MarginCardProps> = ({
  margin,
  etimsReadiness,
}) => {
  const readinessClamped = Math.max(0, Math.min(100, Math.round(etimsReadiness)));
  const readinessColour =
    readinessClamped >= 80
      ? "text-emerald-400"
      : readinessClamped >= 50
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3 shadow-lg shadow-black/40 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Net Profit (After KRA)
          </p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {formatKES(margin.netProfit)}
          </p>
        </div>
        <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-300">
            eTIMS Readiness
          </p>
          <p className={`text-sm font-bold ${readinessColour}`}>
            {readinessClamped}%
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-neutral-300">
        <div className="space-y-1">
          <p className="flex items-center justify-between">
            <span className="text-neutral-400">Gross Sales</span>
            <span className="font-medium">{formatKES(margin.grossSales)}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-neutral-400">Input Costs</span>
            <span className="font-medium text-amber-300">
              -{formatKES(margin.inputCosts)}
            </span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="flex items-center justify-between">
            <span className="text-neutral-400">VAT @16%</span>
            <span className="font-medium text-amber-300">
              -{formatKES(margin.vat)}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-neutral-400">DST @1.5%</span>
            <span className="font-medium text-amber-300">
              -{formatKES(margin.digitalServiceTax)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-white/5 pt-2 text-xs text-neutral-300">
        <p className="flex items-center justify-between">
          <span className="text-neutral-400">
            Tax Penalty (Non‑eTIMS expenses)
          </span>
          <span className="font-semibold text-red-400">
            -{formatKES(margin.taxPenalty)}
          </span>
        </p>
      </div>
    </section>
  );
};

export default MarginCard;


