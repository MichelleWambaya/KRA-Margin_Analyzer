import React from "react";
import { BRAND_COLORS } from "../../theme";

export interface LogoProps {
  size?: number;
  withWordmark?: boolean;
}

/**
 * Simple geometric logomark built from basic shapes and text.
 * This is deliberately minimal and non‑derivative to avoid copyright issues.
 */
export const Logo: React.FC<LogoProps> = ({ size = 32, withWordmark = false }) => {
  return (
    <div className="inline-flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="kra-ready-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={BRAND_COLORS.primary} />
            <stop offset="100%" stopColor={BRAND_COLORS.danger} />
          </linearGradient>
        </defs>

        {/* Circular base */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill={BRAND_COLORS.background}
          stroke="url(#kra-ready-gradient)"
          strokeWidth="2"
        />

        {/* Ascending margin bars */}
        <rect x="10" y="22" width="4" height="8" fill={BRAND_COLORS.primary} rx="1" />
        <rect x="18" y="18" width="4" height="12" fill={BRAND_COLORS.primary} rx="1" />
        <rect x="26" y="12" width="4" height="18" fill={BRAND_COLORS.danger} rx="1" />

        {/* K‑shaped tick for compliance */}
        <path
          d="M11 16 L15 20 L11 24"
          stroke={BRAND_COLORS.primary}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {withWordmark && (
        <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          KRA‑Ready
          <span className="ml-1 text-[11px] font-normal uppercase text-emerald-700 dark:text-emerald-300">
            Margin
          </span>
        </span>
      )}
    </div>
  );
};

export default Logo;


