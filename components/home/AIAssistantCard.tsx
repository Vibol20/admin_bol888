import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { SUGGESTED_PROMPTS } from "@/lib/constants";

export default function AIAssistantCard() {
  return (
    <section className="px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card relative overflow-hidden p-6 md:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-floodlight-500/20 blur-3xl" />
          <span className="eyebrow flex items-center gap-1.5">
            <Sparkles size={13} /> AI Assistant
          </span>
          <h2 className="mt-2 max-w-lg font-display text-2xl tracking-wide md:text-3xl">
            Talk tactics, stats, and storylines — anytime.
          </h2>
          <p className="mt-2 max-w-lg text-sm text-mist-500">
            Ask about form, formations, transfer rumors, or historic rivalries.
            Streamed answers, markdown formatting, and full conversation history.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
              <Link
                key={p}
                href={{ pathname: "/chat", query: { q: p } }}
                className="rounded-full border border-black/10 bg-white/50 px-3 py-1.5 text-xs text-mist-500 transition hover:border-floodlight-500/40 hover:text-floodlight-500 dark:border-white/10 dark:bg-white/[0.04]"
              >
                {p}
              </Link>
            ))}
          </div>

          <Link href="/chat" className="btn-primary mt-6">
            Start chatting <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
