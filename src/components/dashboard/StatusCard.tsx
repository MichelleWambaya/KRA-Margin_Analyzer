import React from "react";
import { formatKES } from "../../lib/taxUtils";

export interface StatusCardProps {
  label: string;
  value: number;
  trendLabel?: string;
  variant?: "default" | "success" | "danger";
}

export const StatusCard: React.FC<StatusCardProps> = ({
  label,
  value,
  trendLabel,
  variant = "default",
}) => {
  const colour =
    variant === "success"
      ? "text-emerald-400"
      : variant === "danger"
      ? "text-red-400"
      : "text-neutral-100";

  return (
    <article className="flex flex-col gap-1 rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-2.5 shadow-sm shadow-black/40">
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className={`text-lg font-semibold ${colour}`}>{formatKES(value)}</p>
      {trendLabel ? (
        <p className="text-[11px] text-neutral-400">{trendLabel}</p>
      ) : null}
    </article>
  );
};

export default StatusCard;


