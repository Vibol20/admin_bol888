"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { COMPETITIONS } from "@/lib/constants";
import { MatchAnalysisInput } from "@/types";

export default function AnalysisForm({
  onSubmit,
  loading,
}: {
  onSubmit: (input: MatchAnalysisInput) => void;
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
    <form onSubmit={submit} className="glass-card space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-500">Home Team</label>
          <input
            value={homeTeam}
            onChange={(e) => setHomeTeam(e.target.value)}
            placeholder="e.g. Manchester City"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-500">Away Team</label>
          <input
            value={awayTeam}
            onChange={(e) => setAwayTeam(e.target.value)}
            placeholder="e.g. Real Madrid"
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
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-mist-500">
            Odds / Context <span className="text-mist-500/70">(optional)</span>
          </label>
          <input
            value={odds}
            onChange={(e) => setOdds(e.target.value)}
            placeholder="e.g. Home 1.85 / Draw 3.6 / Away 4.2"
            className="input-field"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Analyzing match..." : "Generate AI Analysis"}
      </button>
    </form>
  );
}
