"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Newspaper } from "lucide-react";
import NewsCard from "./NewsCard";
import { NewsCardSkeleton } from "@/components/ui/Skeleton";
import { NewsItem, NewsCategory } from "@/types";
import { cacheNews, getCachedNews } from "@/lib/indexeddb";
import { pushToast } from "@/hooks/useToast";

export default function NewsGrid({
  category = "all",
  count = 9,
  title,
}: {
  category?: NewsCategory | "all";
  count?: number;
  title?: string;
}) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(forceRefresh = false) {
    const cacheKey = `news_${category}_${count}`;
    if (!forceRefresh) {
      const cached = await getCachedNews(cacheKey);
      if (cached && cached.length > 0) {
        setItems(cached);
        setLoading(false);
        return;
      }
    }
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load news");
      setItems(data.items);
      cacheNews(cacheKey, data.items);
    } catch (err: any) {
      pushToast(err.message || "Failed to load news", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, count]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title flex items-center gap-2">
          <Newspaper size={20} className="text-floodlight-500" />
          {title || "Latest News"}
        </h2>
        <button
          onClick={() => {
            setRefreshing(true);
            load(true);
          }}
          className="btn-secondary !px-3 !py-1.5 text-xs"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card flex flex-col items-center gap-2 p-10 text-center">
          <Newspaper size={28} className="text-mist-500" />
          <p className="font-display text-lg">No stories yet</p>
          <p className="text-sm text-mist-500">
            Refresh to generate the latest AI football stories.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
