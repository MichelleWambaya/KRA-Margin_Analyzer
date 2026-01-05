import React from "react";
import BottomNav, { BottomNavKey, BottomNavItem } from "../components/ui/BottomNav";

export interface MainLayoutProps {
  activeTab: BottomNavKey;
  onTabChange: (key: BottomNavKey) => void;
  children: React.ReactNode;
  /**
   * Optional custom nav items. Defaults to:
   * [Home, Analytics, Payments, Settings] as per base SaaS layout.
   */
  navItems?: BottomNavItem[];
}

const defaultNavItems: BottomNavItem[] = [
  { key: "home", label: "Home" },
  { key: "analytics", label: "Analytics" },
  { key: "payments", label: "Payments" },
  { key: "settings", label: "Settings" },
];

export const MainLayout: React.FC<MainLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
  navItems,
}) => {
  const items = navItems ?? defaultNavItems;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-neutral-950 px-3 pt-[env(safe-area-inset-top,0.75rem)]">
        <main className="flex-1 pb-4 pt-2">{children}</main>
      </div>

      <BottomNav items={items} activeKey={activeTab} onChange={onTabChange} />
    </div>
  );
};

export default MainLayout;


