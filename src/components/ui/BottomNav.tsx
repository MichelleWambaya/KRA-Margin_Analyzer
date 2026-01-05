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
    <nav className="sticky bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-neutral-950/90 px-2 pb-[env(safe-area-inset-bottom,0.5rem)] pt-2 backdrop-blur">
      <div className="mx-auto flex max-w-[430px] items-center justify-between gap-1">
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
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100",
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


