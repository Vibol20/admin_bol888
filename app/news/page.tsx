"use client";

import { useState } from "react";
import NewsGrid from "@/components/news/NewsGrid";
import NewsFilters from "@/components/news/NewsFilters";
import { NewsCategory } from "@/types";

export default function NewsPage() {
  const [category, setCategory] = useState<NewsCategory | "all">("all");

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <span className="eyebrow">Newsroom</span>
          <h1 className="font-display text-3xl tracking-wide">Football News</h1>
          <p className="mt-1 text-sm text-mist-500">
            AI-curated storylines across transfers, previews, reports, and more.
          </p>
        </div>

        <div className="mb-6">
          <NewsFilters active={category} onChange={setCategory} />
        </div>

        <NewsGrid category={category} count={9} title={category === "all" ? "All Stories" : undefined} />
      </div>
    </div>
  );
}
