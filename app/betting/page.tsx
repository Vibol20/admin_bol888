"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import BettingForm from "@/components/betting/BettingForm";
import BettingResult from "@/components/betting/BettingResult";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS, DEFAULT_SETTINGS } from "@/lib/constants";
import { AppSettings, BettingHelperInput, BettingHelperResult } from "@/types";
import { pushToast } from "@/hooks/useToast";

export default function BettingPage() {
  const [settings] = useLocalStorage<AppSettings>(
    LOCAL_STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BettingHelperResult | null>(null);

  async function generate(payload: BettingHelperInput) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          model: settings.model,
          temperature: settings.temperature,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate suggestions");
      setResult(data);
    } catch (err: any) {
      pushToast(err.message || "Failed to generate suggestions", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <span className="eyebrow flex items-center gap-1.5">
            <Wallet size={13} /> Educational Only
          </span>
          <h1 className="font-display text-3xl tracking-wide">Betting Helper</h1>
          <p className="mt-1 text-sm text-mist-500">
            Explore value bet ideas, safer picks, and accumulator suggestions with
            AI-generated reasoning. For education and entertainment only.
          </p>
        </div>

        <BettingForm onSubmit={generate} loading={loading} />

        <div className="mt-6">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}
          {!loading && result && <BettingResult result={result} />}
          {!loading && !result && (
            <div className="glass-card mt-2 flex flex-col items-center gap-2 p-10 text-center">
              <Wallet size={28} className="text-mist-500" />
              <p className="font-display text-lg">No suggestions yet</p>
              <p className="text-sm text-mist-500">
                Fill in a matchup above to explore AI betting ideas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
