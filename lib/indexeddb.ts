"use client";

import { openDB, DBSchema, IDBPDatabase } from "idb";
import { ChatSession, FavoriteItem, NewsItem } from "@/types";

interface FootballDB extends DBSchema {
  chatSessions: {
    key: string;
    value: ChatSession;
    indexes: { "by-updatedAt": number };
  };
  favorites: {
    key: string;
    value: FavoriteItem;
  };
  newsCache: {
    key: string;
    value: { key: string; items: NewsItem[]; cachedAt: number };
  };
}

let dbPromise: Promise<IDBPDatabase<FootballDB>> | null = null;

export function getDB() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB<FootballDB>("football-ai-hub", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("chatSessions")) {
          const store = db.createObjectStore("chatSessions", { keyPath: "id" });
          store.createIndex("by-updatedAt", "updatedAt");
        }
        if (!db.objectStoreNames.contains("favorites")) {
          db.createObjectStore("favorites", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("newsCache")) {
          db.createObjectStore("newsCache", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveChatSession(session: ChatSession) {
  const db = await getDB();
  if (!db) return;
  await db.put("chatSessions", session);
}

export async function getAllChatSessions(): Promise<ChatSession[]> {
  const db = await getDB();
  if (!db) return [];
  const all = await db.getAll("chatSessions");
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteChatSession(id: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete("chatSessions", id);
}

export async function saveFavorite(item: FavoriteItem) {
  const db = await getDB();
  if (!db) return;
  await db.put("favorites", item);
}

export async function getAllFavorites(): Promise<FavoriteItem[]> {
  const db = await getDB();
  if (!db) return [];
  const all = await db.getAll("favorites");
  return all.sort((a, b) => b.savedAt - a.savedAt);
}

export async function removeFavorite(id: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete("favorites", id);
}

export async function cacheNews(key: string, items: NewsItem[]) {
  const db = await getDB();
  if (!db) return;
  await db.put("newsCache", { key, items, cachedAt: Date.now() });
}

export async function getCachedNews(
  key: string,
  maxAgeMs = 1000 * 60 * 30
): Promise<NewsItem[] | null> {
  const db = await getDB();
  if (!db) return null;
  const entry = await db.get("newsCache", key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > maxAgeMs) return null;
  return entry.items;
}
