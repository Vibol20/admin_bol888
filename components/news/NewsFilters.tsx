"use client";

import { cn } from "@/lib/utils";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { NewsCategory } from "@/types";

export default function NewsFilters({
  active,
  onChange,
}: {
  active: NewsCategory | "all";
  onChange: (cat: NewsCategory | "all") => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition",
          active === "all"
            ? "bg-floodlight-500 text-pitch-950"
            : "border border-black/10 text-mist-500 dark:border-white/10"
        )}
      >
        All
      </button>
      {NEWS_CATEGORIES.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition",
            active === c.value
              ? "bg-floodlight-500 text-pitch-950"
              : "border border-black/10 text-mist-500 dark:border-white/10"
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
