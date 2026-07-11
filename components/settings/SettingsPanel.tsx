"use client";

import { useRef } from "react";
import { Moon, Sun, Globe, Cpu, Thermometer, Trash2, Download, Upload } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS, DEFAULT_SETTINGS } from "@/lib/constants";
import { AppSettings } from "@/types";
import { exportAllLocalData, importAllLocalData, clearAllLocalData } from "@/lib/storage";
import { pushToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const MODELS = [
  { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash-Lite (fastest & cheapest)" },
  { value: "gemini-3.5-flash", label: "Gemini 3.5 Flash (most intelligent, slower)" },
  { value: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro Preview (deep reasoning, slowest)" },
];

export default function SettingsPanel() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    LOCAL_STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  function exportSettings() {
    const json = exportAllLocalData(Object.values(LOCAL_STORAGE_KEYS));
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `football-ai-hub-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast("Settings exported", "success");
  }

  function importSettings(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importAllLocalData(String(reader.result), Object.values(LOCAL_STORAGE_KEYS));
      if (ok) {
        pushToast("Settings imported — reloading", "success");
        setTimeout(() => window.location.reload(), 800);
      } else {
        pushToast("Invalid settings file", "error");
      }
    };
    reader.readAsText(file);
  }

  function clearData() {
    if (!confirm("This will clear all locally stored data (settings, favorites, chat history). Continue?")) return;
    clearAllLocalData(Object.values(LOCAL_STORAGE_KEYS));
    pushToast("Local data cleared — reloading", "info");
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <div className="space-y-4">
      {/* Theme */}
      <div className="glass-card p-5">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mist-500">
          {settings.theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
          Appearance
        </p>
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSettings((s) => ({ ...s, theme: t }))}
              className={cn(
                "flex-1 rounded-xl border px-4 py-3 text-sm font-medium capitalize transition",
                settings.theme === t
                  ? "border-floodlight-500 bg-floodlight-500/10 text-floodlight-500"
                  : "border-black/10 text-mist-500 dark:border-white/10"
              )}
            >
              {t} mode
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="glass-card p-5">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mist-500">
          <Globe size={14} /> Language
        </p>
        <div className="flex gap-2">
          {[
            { value: "en", label: "English" },
            { value: "km", label: "ខ្មែរ (Khmer)" },
          ].map((l) => (
            <button
              key={l.value}
              onClick={() => setSettings((s) => ({ ...s, language: l.value as "en" | "km" }))}
              className={cn(
                "flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition",
                settings.language === l.value
                  ? "border-floodlight-500 bg-floodlight-500/10 text-floodlight-500"
                  : "border-black/10 text-mist-500 dark:border-white/10"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-mist-500">
          Sets your preferred UI language. Chat responses follow whichever language you type in.
        </p>
      </div>

      {/* Model */}
      <div className="glass-card p-5">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mist-500">
          <Cpu size={14} /> Gemini Model
        </p>
        <select
          value={settings.model}
          onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value as AppSettings["model"] }))}
          className="input-field"
        >
          {MODELS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Temperature */}
      <div className="glass-card p-5">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mist-500">
          <Thermometer size={14} /> Creativity (Temperature): {settings.temperature.toFixed(1)}
        </p>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={settings.temperature}
          onChange={(e) => setSettings((s) => ({ ...s, temperature: parseFloat(e.target.value) }))}
          className="w-full accent-floodlight-500"
        />
        <div className="mt-1 flex justify-between text-[11px] text-mist-500">
          <span>Precise</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Data management */}
      <div className="glass-card p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-mist-500">Local Data</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportSettings} className="btn-secondary text-xs">
            <Download size={14} /> Export settings
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs">
            <Upload size={14} /> Import settings
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={importSettings}
          />
          <button
            onClick={clearData}
            className="btn-secondary text-xs !border-live-500/40 !text-live-500"
          >
            <Trash2 size={14} /> Clear all local data
          </button>
        </div>
        <p className="mt-2 text-[11px] text-mist-500">
          All data (settings, favorites, chat history) is stored only on this device via
          localStorage and IndexedDB — nothing is sent to a server or database.
        </p>
      </div>
    </div>
  );
}
