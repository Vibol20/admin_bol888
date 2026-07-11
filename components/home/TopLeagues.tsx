import { Trophy } from "lucide-react";
import { TOP_LEAGUES } from "@/lib/constants";

export default function TopLeagues() {
  return (
    <section className="px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-floodlight-500" />
          Top Leagues
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {TOP_LEAGUES.map((league) => (
            <div
              key={league.id}
              className="glass-card flex flex-col items-center gap-2 p-4 text-center"
            >
              <span className="text-3xl">{league.logo}</span>
              <span className="text-xs font-semibold leading-tight">{league.name}</span>
              <span className="text-[10px] text-mist-500">{league.country}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
