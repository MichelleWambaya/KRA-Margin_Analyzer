import React from "react";

export type BottomNavKey = "home" | "expenses" | "tax" | "settings" | "analytics" | "payments";

export interface BottomNavItem {
  key: BottomNavKey;
  label: string;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  activeKey: BottomNavKey;
  onChange: (key: BottomNavKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeKey,
  onChange,
}) => {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-20 border-t border-neutral-200 bg-neutral-50/90 px-2 pb-[env(safe-area-inset-bottom,0.5rem)] pt-2 backdrop-blur dark:border-white/10 dark:bg-neutral-950/90 md:px-4">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-1">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={[
                "flex flex-1 flex-col items-center rounded-full px-2 py-1.5 text-[11px] font-medium transition-colors",
                isActive
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                  : "text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
              ].join(" ")}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;


