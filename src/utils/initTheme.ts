import { getSystemTheme, applyTheme, ThemeMode } from "../hooks/useTheme";

export const initTheme = () => {
  const stored = localStorage.getItem("kra-ready-theme") || "system";
  const mode = (stored === "light" || stored === "dark" ? stored : "system") as ThemeMode;
  applyTheme(mode);
};

