"use client";

import { CalendarClock } from "lucide-react";
import Link from "next/link";

interface Fixture {
  home: string;
  away: string;
  homeIcon: string;
  awayIcon: string;
  competition: string;
  time: string;
  status: "upcoming" | "live" | "finished";
  score?: string;
}

const FIXTURES: Fixture[] = [
  { home: "Arsenal", away: "Chelsea", homeIcon: "🔴", awayIcon: "🔵", competition: "Premier League", time: "17:30", status: "upcoming" },
  { home: "Real Madrid", away: "Barcelona", homeIcon: "⚪", awayIcon: "🔴", competition: "La Liga", time: "20:00", status: "upcoming" },
  { home: "Inter Milan", away: "AC Milan", homeIcon: "⚫", awayIcon: "🔴", competition: "Serie A", time: "LIVE", status: "live", score: "1-1" },
  { home: "Bayern Munich", away: "Dortmund", homeIcon: "🔴", awayIcon: "🟡", competition: "Bundesliga", time: "FT", status: "finished", score: "2-0" },
  { home: "PSG", away: "Marseille", homeIcon: "🔵", awayIcon: "⚪", competition: "Ligue 1", time: "21:00", status: "upcoming" },
];

const STATUS_STYLES: Record<Fixture["status"], string> = {
  upcoming: "text-mist-500",
  live: "text-live-500",
  finished: "text-mist-500",
};

export default function TodayMatches() {
  return (
    <section className="px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title flex items-center gap-2">
            <CalendarClock size={20} className="text-floodlight-500" />
            Today's Matches
          </h2>
          <Link href="/analysis" className="text-xs font-medium text-floodlight-500 hover:underline">
            Analyze any matchup →
          </Link>
        </div>

        <div className="glass-card divide-y divide-black/5 dark:divide-white/10">
          {FIXTURES.map((f, i) => (
            <div key={i} className="flex items-center justify-between gap-3 p-4">
              <div className="flex flex-1 items-center gap-2 text-sm font-medium">
                <span className="text-lg">{f.homeIcon}</span>
                <span className="w-24 truncate sm:w-auto">{f.home}</span>
              </div>

              <div className="flex flex-col items-center gap-0.5 px-2">
                {f.status === "live" || f.status === "finished" ? (
                  <span className="font-mono text-base font-semibold">{f.score}</span>
                ) : (
                  <span className="font-mono text-sm text-mist-500">vs</span>
                )}
                <span className={`flex items-center gap-1 font-mono text-[11px] ${STATUS_STYLES[f.status]}`}>
                  {f.status === "live" && (
                    <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-live-500" />
                  )}
                  {f.time}
                </span>
              </div>

              <div className="flex flex-1 items-center justify-end gap-2 text-right text-sm font-medium">
                <span className="w-24 truncate sm:w-auto">{f.away}</span>
                <span className="text-lg">{f.awayIcon}</span>
              </div>

              <span className="hidden shrink-0 text-[11px] text-mist-500 md:block md:w-32">
                {f.competition}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-mist-500">
          Demo fixtures shown for illustration — connect a live sports data source for real-time scores.
        </p>
      </div>
    </section>
  );
}
