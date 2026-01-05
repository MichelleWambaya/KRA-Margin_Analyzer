import React from "react";
import { useTheme, ThemeMode } from "../../hooks/useTheme";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const getLabel = (mode: ThemeMode): string => {
    if (mode === "light") return "Light";
    if (mode === "dark") return "Dark";
    return "System";
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
      title={`Theme: ${getLabel(theme)} (click to cycle)`}
      aria-label={`Current theme: ${getLabel(theme)}. Click to switch theme.`}
    >
      <span className="hidden sm:inline">{getLabel(theme)}</span>
    </button>
  );
};

export default ThemeToggle;

