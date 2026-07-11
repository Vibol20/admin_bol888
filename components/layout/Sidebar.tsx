"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  Newspaper,
  LineChart,
  Wallet,
  Star,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "AI Chat", icon: MessageCircle },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/analysis", label: "Match Analysis", icon: LineChart },
  { href: "/betting", label: "Betting Helper", icon: Wallet },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-pitch-950/70 md:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-floodlight-500/20 text-floodlight-500">
          <span className="font-display text-lg">💴</span>
        </div>
        <span className="font-display text-lg tracking-wide">{APP_NAME}</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-floodlight-500/15 text-floodlight-500"
                  : "text-mist-500 hover:bg-black/5 hover:text-pitch-900 dark:hover:bg-white/5 dark:hover:text-mist-100"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "transition-transform group-hover:scale-110",
                  active && "drop-shadow-[0_0_6px_rgba(15,191,143,0.6)]"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 text-xs text-mist-500">
        <p className="font-mono">v1.0.0 · Powered by Gemini</p>
      </div>
    </aside>
  );
}
