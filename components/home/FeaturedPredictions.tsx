import Link from "next/link";
import { Target, ArrowRight } from "lucide-react";

const TEASERS = [
  {
    match: "Man City vs Real Madrid",
    verdict: "Tight tactical battle expected, slight edge to the hosts.",
    confidence: 72,
  },
  {
    match: "Arsenal vs Chelsea",
    verdict: "High-tempo London derby with goals at both ends likely.",
    confidence: 65,
  },
  {
    match: "Bayern vs Dortmund",
    verdict: "Bayern's home form suggests a comfortable points haul.",
    confidence: 78,
  },
];

export default function FeaturedPredictions() {
  return (
    <section className="px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title flex items-center gap-2">
            <Target size={20} className="text-floodlight-500" />
            Featured Predictions
          </h2>
          <Link href="/analysis" className="text-xs font-medium text-floodlight-500 hover:underline">
            Run your own analysis →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TEASERS.map((t, i) => (
            <Link
              key={i}
              href="/analysis"
              className="glass-card flex flex-col gap-3 p-5"
            >
              <p className="font-display text-base tracking-wide">{t.match}</p>
              <p className="flex-1 text-sm text-mist-500">{t.verdict}</p>
              <div>
                <div className="mb-1 flex justify-between font-mono text-[11px] text-mist-500">
                  <span>AI Confidence</span>
                  <span>{t.confidence}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-floodlight-500"
                    style={{ width: `${t.confidence}%` }}
                  />
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-floodlight-500">
                Full breakdown <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
