import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import LiveClock from "./LiveClock";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-floodlight-glow px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
      {/* subtle pitch-line texture */}
      <div className="pointer-events-none absolute inset-0 bg-pitch-lines bg-[length:100%_28px] opacity-40" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <span className="eyebrow">Kickoff Terminal</span>
          <LiveClock />
        </div>

        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="animate-fade-up">
            <h1 className="font-display text-4xl leading-[1.05] tracking-wide sm:text-5xl md:text-6xl">
              Read the game
              <br />
              <span className="text-floodlight-500">before it's played.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm text-mist-500 md:text-base">
              Football AI Hub turns raw football chatter into sharp analysis —
              live news, an AI match analyst, and an assistant that talks
              tactics with you, all in one scoreboard-clean workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/analysis" className="btn-primary">
                Analyze a Match
                <ArrowRight size={16} />
              </Link>
              <Link href="/chat" className="btn-secondary">
                <MessageCircle size={16} />
                Ask the AI Assistant
              </Link>
            </div>
          </div>

          <div className="relative animate-float-slow">
            <div className="glass-card mx-auto max-w-sm p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">Sample Readout</span>
                <span className="flex items-center gap-1 text-[11px] text-live-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-live-500 animate-pulse-live" />
                  LIVE MODEL
                </span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <div className="text-center">
                  <div className="text-3xl">🔵</div>
                  <p className="mt-1 text-xs text-mist-500">Man City</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold tracking-widest">54%</p>
                  <p className="text-[10px] text-mist-500">WIN PROB</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl">⚪</div>
                  <p className="mt-1 text-xs text-mist-500">Real Madrid</p>
                </div>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div className="flex h-full w-full">
                  <div className="h-full bg-floodlight-500" style={{ width: "54%" }} />
                  <div className="h-full bg-amber-500" style={{ width: "22%" }} />
                  <div className="h-full bg-live-500" style={{ width: "24%" }} />
                </div>
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-mist-500">
                <span>Win</span>
                <span>Draw</span>
                <span>Loss</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
