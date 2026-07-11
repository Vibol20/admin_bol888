"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { COMPETITIONS } from "@/lib/constants";
import { BettingHelperInput } from "@/types";

export default function BettingForm({
  onSubmit,
  loading,
}: {
  onSubmit: (input: BettingHelperInput) => void;
  loading: boolean;
}) {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [competition, setCompetition] = useState(COMPETITIONS[0]);
  const [odds, setOdds] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!homeTeam.trim() || !awayTeam.trim()) return;
    onSubmit({ homeTeam, awayTeam, competition, odds: odds || undefined });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-500">
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
        <p>
          Educational tool only. Outcomes are never guaranteed — please gamble
          responsibly and within your means.
        </p>
      </div>

      <form onSubmit={submit} className="glass-card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-mist-500">Home Team</label>
            <input
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              placeholder="e.g. Liverpool"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-mist-500">Away Team</label>
            <input
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              placeholder="e.g. Newcastle"
              className="input-field"
              required
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-mist-500">Competition</label>
            <select
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
              className="input-field"
            >
              {COMPETITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-mist-500">
              Odds <span className="text-mist-500/70">(optional)</span>
            </label>
            <input
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              placeholder="e.g. Home 2.1 / Draw 3.4 / Away 3.3"
              className="input-field"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? "Generating ideas..." : "Get Betting Ideas"}
        </button>
      </form>
    </div>
  );
}
