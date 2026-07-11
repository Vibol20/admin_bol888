import { Sparkles } from "lucide-react";
import { SUGGESTED_PROMPTS } from "@/lib/constants";

export default function SuggestedPrompts({
  onSelect,
}: {
  onSelect: (prompt: string) => void;
}) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-floodlight-500/15 text-floodlight-500">
        <Sparkles size={26} />
      </div>
      <h2 className="font-display text-xl tracking-wide">
        Ask the AI Football Assistant
      </h2>
      <p className="mt-2 text-sm text-mist-500">
        Tactics, form, history, or match context — start with a prompt below
        or type your own question.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="rounded-full border border-black/10 bg-white/50 px-3.5 py-2 text-xs text-mist-500 transition hover:border-floodlight-500/40 hover:text-floodlight-500 dark:border-white/10 dark:bg-white/[0.04]"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
