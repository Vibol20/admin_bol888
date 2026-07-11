"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { settings, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/60 text-pitch-900 transition-all hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.06] dark:text-mist-100 dark:hover:bg-white/10"
    >
      {settings.theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
