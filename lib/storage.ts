"use client";

/** Safe localStorage read/write helpers (no-ops on the server). */

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable - fail silently
  }
}

export function removeLocal(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function exportAllLocalData(keys: string[]): string {
  const data: Record<string, unknown> = {};
  keys.forEach((k) => {
    const raw = window.localStorage.getItem(k);
    if (raw) {
      try {
        data[k] = JSON.parse(raw);
      } catch {
        data[k] = raw;
      }
    }
  });
  return JSON.stringify(data, null, 2);
}

export function importAllLocalData(json: string, keys: string[]): boolean {
  try {
    const data = JSON.parse(json);
    keys.forEach((k) => {
      if (data[k] !== undefined) {
        window.localStorage.setItem(k, JSON.stringify(data[k]));
      }
    });
    return true;
  } catch {
    return false;
  }
}

export function clearAllLocalData(keys: string[]): void {
  keys.forEach((k) => window.localStorage.removeItem(k));
}
