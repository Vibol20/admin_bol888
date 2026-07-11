"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, Newspaper, LineChart, Users } from "lucide-react";
import { FavoriteItem } from "@/types";
import { getAllFavorites, removeFavorite } from "@/lib/indexeddb";
import { timeAgo } from "@/lib/utils";
import { pushToast } from "@/hooks/useToast";

const TYPE_ICON = {
  news: Newspaper,
  team: Users,
  prediction: LineChart,
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "news" | "team" | "prediction">("all");

  useEffect(() => {
    getAllFavorites().then((f) => {
      setFavorites(f);
      setLoading(false);
    });
  }, []);

  async function remove(id: string) {
    await removeFavorite(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    pushToast("Removed from favorites", "info");
  }

  const filtered = favorites.filter((f) => filter === "all" || f.type === filter);

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <span className="eyebrow flex items-center gap-1.5">
            <Star size={13} /> Saved Locally
          </span>
          <h1 className="font-display text-3xl tracking-wide">Favorites</h1>
          <p className="mt-1 text-sm text-mist-500">
            News, predictions, and teams you've bookmarked — stored on this device.
          </p>
        </div>

        <div className="mb-5 flex gap-2">
          {(["all", "news", "prediction", "team"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
                filter === t
                  ? "bg-floodlight-500 text-pitch-950"
                  : "border border-black/10 text-mist-500 dark:border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-mist-500">Loading favorites…</p>
        ) : filtered.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-2 p-10 text-center">
            <Star size={28} className="text-mist-500" />
            <p className="font-display text-lg">Nothing saved yet</p>
            <p className="text-sm text-mist-500">
              Bookmark news articles or match analyses to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((f) => {
              const Icon = TYPE_ICON[f.type];
              return (
                <div key={f.id} className="glass-card flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-floodlight-500/15 text-floodlight-500">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{f.label}</p>
                    <p className="text-[11px] text-mist-500 capitalize">
                      {f.type} · saved {timeAgo(f.savedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(f.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-mist-500 hover:text-live-500 dark:border-white/10"
                    aria-label="Remove favorite"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
