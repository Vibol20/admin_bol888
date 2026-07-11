"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  MessageCircle,
  Newspaper,
  LineChart,
  Wallet,
  Star,
  Settings,
  Search,
} from "lucide-react";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { POPULAR_TEAMS, TOP_LEAGUES } from "@/lib/constants";

const COMMANDS = [
  { label: "Go to Home", href: "/", icon: Home, keywords: "home landing" },
  { label: "Open AI Chat", href: "/chat", icon: MessageCircle, keywords: "chat assistant ai" },
  { label: "Browse News", href: "/news", icon: Newspaper, keywords: "news transfer breaking" },
  { label: "Match Analysis", href: "/analysis", icon: LineChart, keywords: "analysis prediction preview match" },
  { label: "Betting Helper", href: "/betting", icon: Wallet, keywords: "betting odds value bets" },
  { label: "Favorites", href: "/favorites", icon: Star, keywords: "saved bookmarks" },
  { label: "Settings", href: "/settings", icon: Settings, keywords: "theme model settings language" },
  ...POPULAR_TEAMS.map((t) => ({
    label: `Team: ${t.name}`,
    href: `/chat?q=${encodeURIComponent(`Tell me about ${t.name}'s current form and squad`)}`,
    icon: Star,
    keywords: `team ${t.name.toLowerCase()} ${t.league.toLowerCase()}`,
  })),
  ...TOP_LEAGUES.map((l) => ({
    label: `League: ${l.name}`,
    href: `/news`,
    icon: Newspaper,
    keywords: `league ${l.name.toLowerCase()} ${l.country.toLowerCase()}`,
  })),
];

export default function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.keywords.includes(q)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="glass w-full max-w-lg overflow-hidden rounded-xl2 shadow-glass animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10">
          <Search size={16} className="text-mist-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-mist-500"
          />
          <kbd className="rounded border border-black/10 px-1.5 py-0.5 text-[10px] text-mist-500 dark:border-white/10">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-mist-500">
              No results found.
            </p>
          )}
          {filtered.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              onClick={() => {
                router.push(href);
                setOpen(false);
                setQuery("");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-floodlight-500/10"
            >
              <Icon size={16} className="text-floodlight-500" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
