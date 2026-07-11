"use client";

import { useState } from "react";
import Image from "next/image";
import { Bookmark, Share2, Sparkles } from "lucide-react";
import { NewsItem } from "@/types";
import { timeAgo, uid, cn } from "@/lib/utils";
import { saveFavorite, removeFavorite, getAllFavorites } from "@/lib/indexeddb";
import { pushToast } from "@/hooks/useToast";
import { useEffect } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  breaking: "bg-live-500/15 text-live-500",
  transfer: "bg-amber-500/15 text-amber-500",
  preview: "bg-floodlight-500/15 text-floodlight-500",
  report: "bg-blue-500/15 text-blue-400",
  injury: "bg-red-500/15 text-red-400",
  manager: "bg-purple-500/15 text-purple-400",
  international: "bg-teal-500/15 text-teal-400",
  women: "bg-pink-500/15 text-pink-400",
  youth: "bg-indigo-500/15 text-indigo-400",
};

export default function NewsCard({ item }: { item: NewsItem }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  useEffect(() => {
    getAllFavorites().then((favs) => {
      setBookmarked(favs.some((f) => f.refId === item.id));
    });
  }, [item.id]);

  async function toggleBookmark() {
    if (bookmarked) {
      const favs = await getAllFavorites();
      const match = favs.find((f) => f.refId === item.id);
      if (match) await removeFavorite(match.id);
      setBookmarked(false);
      pushToast("Removed from favorites", "info");
    } else {
      await saveFavorite({
        id: uid("fav"),
        type: "news",
        refId: item.id,
        label: item.title,
        savedAt: Date.now(),
        data: item,
      });
      setBookmarked(true);
      pushToast("Saved to favorites", "success");
    }
  }

  async function share() {
    const shareData = {
      title: item.title,
      text: item.summary,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${item.title}\n\n${item.summary}`);
        pushToast("Copied to clipboard", "success");
      }
    } catch {
      // user cancelled share - ignore
    }
  }

  async function generateAiSummary() {
    if (aiSummary) {
      setAiSummary(null);
      return;
    }
    setSummarizing(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `In exactly one punchy sentence, give the key takeaway a fan needs from this football news:\n\nTitle: ${item.title}\nSummary: ${item.summary}`,
            },
          ],
        }),
      });
      if (!res.ok || !res.body) throw new Error("Failed to summarize");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        // Vercel AI SDK data stream protocol: text chunks are prefixed with 0:"..."
        chunk.split("\n").forEach((line) => {
          const m = line.match(/^0:"(.*)"$/);
          if (m) {
            try {
              text += JSON.parse(`"${m[1]}"`);
            } catch {
              text += m[1];
            }
          }
        });
      }
      setAiSummary(text || "Couldn't generate a summary this time.");
    } catch {
      pushToast("AI summary failed. Try again.", "error");
    } finally {
      setSummarizing(false);
    }
  }

  return (
    <article className="glass-card group flex flex-col overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur",
            CATEGORY_COLORS[item.category] || "bg-black/40 text-white"
          )}
        >
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base leading-snug tracking-wide">
          {item.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm text-mist-500">
          {item.summary}
        </p>

        {aiSummary && (
          <div className="flex items-start gap-2 rounded-lg border border-floodlight-500/30 bg-floodlight-500/10 p-2.5 text-xs text-floodlight-500">
            <Sparkles size={13} className="mt-0.5 shrink-0" />
            <span>{aiSummary}</span>
          </div>
        )}

        <div className="mt-1 flex items-center justify-between text-[11px] text-mist-500">
          <span>
            {item.source} · {timeAgo(item.publishedAt)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 border-t border-black/5 pt-3 dark:border-white/10">
          <button
            onClick={generateAiSummary}
            disabled={summarizing}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-floodlight-500/10 px-3 py-1.5 text-xs font-medium text-floodlight-500 transition hover:bg-floodlight-500/20 disabled:opacity-50"
          >
            <Sparkles size={13} />
            {summarizing ? "Thinking..." : aiSummary ? "Hide AI take" : "AI Summary"}
          </button>
          <button
            onClick={toggleBookmark}
            aria-label="Bookmark"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10",
              bookmarked && "border-amber-500/40 bg-amber-500/15 text-amber-500"
            )}
          >
            <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={share}
            aria-label="Share"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 dark:border-white/10"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
