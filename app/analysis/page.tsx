"use client";

import { useState } from "react";
import { LineChart } from "lucide-react";
import AnalysisForm from "@/components/analysis/AnalysisForm";
import AnalysisResult from "@/components/analysis/AnalysisResult";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS, DEFAULT_SETTINGS } from "@/lib/constants";
import { AppSettings, MatchAnalysisInput, MatchAnalysisResult } from "@/types";
import { pushToast } from "@/hooks/useToast";

export default function AnalysisPage() {
  const [settings] = useLocalStorage<AppSettings>(
    LOCAL_STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchAnalysisResult | null>(null);
  const [input, setInput] = useState<MatchAnalysisInput | null>(null);

  async function runAnalysis(payload: MatchAnalysisInput) {
    setLoading(true);
    setResult(null);
    setInput(payload);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          model: settings.model,
          temperature: settings.temperature,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze match");
      setResult(data);
    } catch (err: any) {
      pushToast(err.message || "Failed to analyze match", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <span className="eyebrow flex items-center gap-1.5">
            <LineChart size={13} /> AI Match Analyst
          </span>
          <h1 className="font-display text-3xl tracking-wide">AI Match Analysis</h1>
          <p className="mt-1 text-sm text-mist-500">
            Enter two teams and get a full tactical breakdown, probabilities, and a final verdict.
          </p>
        </div>

        <AnalysisForm onSubmit={runAnalysis} loading={loading} />

        <div className="mt-6">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}
          {!loading && result && input && (
            <AnalysisResult result={result} input={input} />
          )}
          {!loading && !result && (
            <div className="glass-card mt-2 flex flex-col items-center gap-2 p-10 text-center">
              <LineChart size={28} className="text-mist-500" />
              <p className="font-display text-lg">No analysis yet</p>
              <p className="text-sm text-mist-500">
                Fill in the matchup above to generate an AI breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
