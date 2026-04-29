"use client";

import { useEffect, useState } from "react";
import { AppButton } from "@/components/ui/AppButton";

const THEME_KEY = "khlia-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }

  return (
    <AppButton type="button" variant="ghost" size="sm" onClick={toggleTheme} className="px-3">
      {dark ? "نهاري" : "ليلي"}
    </AppButton>
  );
}

