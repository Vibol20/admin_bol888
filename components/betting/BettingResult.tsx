"use client";

import { AlertTriangle, TrendingUp, ShieldCheck, Layers, Goal, Users2, Split } from "lucide-react";
import { BettingHelperResult, BettingSuggestion } from "@/types";
import { cn } from "@/lib/utils";

const RISK_COLOR: Record<string, string> = {
  Low: "text-floodlight-500 bg-floodlight-500/15",
  Medium: "text-amber-500 bg-amber-500/15",
  High: "text-live-500 bg-live-500/15",
};

const GROUPS: { key: keyof BettingHelperResult; label: string; icon: any }[] = [
  { key: "valueBets", label: "Value Bet Ideas", icon: TrendingUp },
  { key: "saferPicks", label: "Safer Picks", icon: ShieldCheck },
  { key: "accumulator", label: "Accumulator Suggestions", icon: Layers },
  { key: "overUnder", label: "Over/Under Ideas", icon: Goal },
  { key: "btts", label: "Both Teams To Score", icon: Users2 },
  { key: "doubleChance", label: "Double Chance Ideas", icon: Split },
];

export default function BettingResult({ result }: { result: BettingHelperResult }) {
  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-500">
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
        <p>{result.disclaimer}</p>
      </div>

      {GROUPS.map(({ key, label, icon: Icon }) => {
        const items = result[key] as BettingSuggestion[];
        if (!Array.isArray(items) || items.length === 0) return null;
        return (
          <div key={key} className="glass-card p-5">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mist-500">
              <Icon size={14} className="text-floodlight-500" />
              {label}
            </p>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="rounded-xl border border-black/10 p-3.5 dark:border-white/10">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{item.suggestion}</p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        RISK_COLOR[item.riskLevel] || "bg-black/10"
                      )}
                    >
                      {item.riskLevel} risk
                    </span>
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-mist-500">
                    {item.type}
                  </p>
                  <p className="mt-1.5 text-xs text-mist-500">{item.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
