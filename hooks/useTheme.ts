"use client";

import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { LOCAL_STORAGE_KEYS, DEFAULT_SETTINGS } from "@/lib/constants";
import { AppSettings } from "@/types";

export function useTheme() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    LOCAL_STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.theme]);

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  };

  return { settings, setSettings, toggleTheme };
}
