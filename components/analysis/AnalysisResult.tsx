"use client";

import { useState } from "react";
import { Bookmark, ShieldCheck, ShieldAlert, ShieldX, Gauge } from "lucide-react";
import { MatchAnalysisResult, MatchAnalysisInput } from "@/types";
import { cn, uid } from "@/lib/utils";
import { saveFavorite } from "@/lib/indexeddb";
import { pushToast } from "@/hooks/useToast";

const RISK_ICON = {
  Low: ShieldCheck,
  Medium: ShieldAlert,
  High: ShieldX,
};

const RISK_COLOR = {
  Low: "text-floodlight-500 bg-floodlight-500/15",
  Medium: "text-amber-500 bg-amber-500/15",
  High: "text-live-500 bg-live-500/15",
};

export default function AnalysisResult({
  result,
  input,
}: {
  result: MatchAnalysisResult;
  input: MatchAnalysisInput;
}) {
  const [saved, setSaved] = useState(false);
  const RiskIcon = RISK_ICON[result.riskLevel] || ShieldAlert;

  async function save() {
    await saveFavorite({
      id: uid("fav"),
      type: "prediction",
      refId: uid("pred"),
      label: `${input.homeTeam} vs ${input.awayTeam}`,
      savedAt: Date.now(),
      data: { input, result },
    });
    setSaved(true);
    pushToast("Analysis saved to favorites", "success");
  }

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Header */}
      <div className="glass-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="eyebrow">{input.competition}</p>
          <h3 className="font-display text-2xl tracking-wide">
            {input.homeTeam} <span className="text-mist-500">vs</span> {input.awayTeam}
          </h3>
        </div>
        <button
          onClick={save}
          disabled={saved}
          className="btn-secondary !px-3 !py-1.5 text-xs disabled:opacity-50"
        >
          <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save Analysis"}
        </button>
      </div>

      {/* Win probability */}
      <div className="glass-card p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-mist-500">
          Win Probability
        </p>
        <div className="grid grid-cols-3 gap-3 text-center font-mono">
          <div>
            <p className="text-2xl font-semibold text-floodlight-500">{result.winProbability.home}%</p>
            <p className="text-[11px] text-mist-500">{input.homeTeam}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-amber-500">{result.winProbability.draw}%</p>
            <p className="text-[11px] text-mist-500">Draw</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-live-500">{result.winProbability.away}%</p>
            <p className="text-[11px] text-mist-500">{input.awayTeam}</p>
          </div>
        </div>
        <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div className="h-full bg-floodlight-500" style={{ width: `${result.winProbability.home}%` }} />
          <div className="h-full bg-amber-500" style={{ width: `${result.winProbability.draw}%` }} />
          <div className="h-full bg-live-500" style={{ width: `${result.winProbability.away}%` }} />
        </div>
      </div>

      {/* Preview */}
      <div className="glass-card p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mist-500">Match Preview</p>
        <p className="text-sm leading-relaxed">{result.preview}</p>
      </div>

      {/* Form + strengths/weaknesses */}
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { team: input.homeTeam, form: result.homeForm, strengths: result.homeStrengths, weaknesses: result.homeWeaknesses },
          { team: input.awayTeam, form: result.awayForm, strengths: result.awayStrengths, weaknesses: result.awayWeaknesses },
        ].map((t, i) => (
          <div key={i} className="glass-card space-y-3 p-5">
            <p className="font-display text-lg tracking-wide">{t.team}</p>
            <p className="text-xs text-mist-500">{t.form}</p>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase text-floodlight-500">Strengths</p>
              <ul className="list-disc space-y-1 pl-4 text-xs text-mist-500">
                {t.strengths.map((s, j) => <li key={j}>{s}</li>)}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase text-live-500">Weaknesses</p>
              <ul className="list-disc space-y-1 pl-4 text-xs text-mist-500">
                {t.weaknesses.map((s, j) => <li key={j}>{s}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Key players */}
      <div className="glass-card p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-mist-500">Key Players</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.keyPlayers.map((p, i) => (
            <div key={i} className="rounded-xl border border-black/10 p-3 dark:border-white/10">
              <p className="text-sm font-semibold">{p.player}</p>
              <p className="text-[11px] text-mist-500">{p.team}</p>
              <p className="mt-1 text-xs text-mist-500">{p.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Expected Goals" value={`${result.expectedGoals.home} - ${result.expectedGoals.away}`} />
        <StatCard label="Correct Score" value={result.correctScore} />
        <StatCard label="Asian Handicap" value={result.asianHandicap} />
        <StatCard label="Over/Under" value={result.overUnder} />
        <StatCard label="BTTS" value={result.btts} />
        <StatCard
          label="Risk Level"
          value={result.riskLevel}
          icon={<RiskIcon size={16} />}
          badgeClass={RISK_COLOR[result.riskLevel]}
        />
        <StatCard
          label="Confidence"
          value={`${result.confidenceScore}%`}
          icon={<Gauge size={16} />}
        />
      </div>

      {/* Important factors */}
      <div className="glass-card p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mist-500">Important Factors</p>
        <ul className="list-disc space-y-1 pl-4 text-sm text-mist-500">
          {result.importantFactors.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </div>

      {/* Final verdict */}
      <div className="glass-card border-floodlight-500/30 p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-floodlight-500">Final Verdict</p>
        <p className="text-sm leading-relaxed">{result.finalVerdict}</p>
      </div>

      <p className="text-center text-[11px] text-mist-500">
        AI-generated analysis for informational purposes only. Not a guarantee of any outcome.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  badgeClass,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  badgeClass?: string;
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-mist-500">{label}</p>
      <div
        className={cn(
          "mt-1 flex items-center gap-1.5 font-mono text-lg font-semibold",
          badgeClass && "inline-flex rounded-full px-2.5 py-1 text-sm",
          badgeClass
        )}
      >
        {icon}
        {value}
      </div>
    </div>
  );
}
