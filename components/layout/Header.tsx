"use client";

import { Search, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CommandPalette from "@/components/ui/CommandPalette";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { APP_NAME } from "@/lib/constants";

export default function Header() {
  const { setOpen } = useCommandPalette();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/5 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-white/5 dark:bg-pitch-900/70 md:px-8">
        <div className="flex items-center gap-2 md:hidden">
          <span className="font-display text-lg tracking-wide">{APP_NAME}</span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex w-full max-w-md items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm text-mist-500 transition hover:border-floodlight-500/40 dark:border-white/10 dark:bg-white/[0.06] md:w-72"
        >
          <Search size={15} />
          <span className="flex-1 text-left">Search teams, news, matches...</span>
          <kbd className="hidden rounded border border-black/10 px-1.5 py-0.5 font-mono text-[10px] dark:border-white/10 md:inline">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-floodlight-500/30 bg-floodlight-500/10 px-3 py-1.5 text-xs font-medium text-floodlight-500 md:flex">
            <Sparkles size={13} />
            Gemini Powered
          </span>
          <ThemeToggle />
        </div>
      </header>
      <CommandPalette />
    </>
  );
}
