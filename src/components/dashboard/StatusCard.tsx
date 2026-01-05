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
      ? "text-emerald-600 dark:text-emerald-400"
      : variant === "danger"
      ? "text-red-600 dark:text-red-400"
      : "text-neutral-900 dark:text-neutral-100";

  return (
    <article className="flex flex-col gap-1 rounded-xl border border-neutral-300 bg-neutral-100 px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-800 dark:text-neutral-400">
        {label}
      </p>
      <p className={`text-lg font-semibold ${colour}`}>{formatKES(value)}</p>
      {trendLabel ? (
        <p className="text-[11px] text-neutral-800 dark:text-neutral-400">{trendLabel}</p>
      ) : null}
    </article>
  );
};

export default StatusCard;


