import { Users } from "lucide-react";
import { POPULAR_TEAMS } from "@/lib/constants";

export default function PopularTeams() {
  return (
    <section className="px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <Users size={20} className="text-floodlight-500" />
          Popular Teams
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {POPULAR_TEAMS.map((team) => (
            <div
              key={team.id}
              className="glass-card flex min-w-[140px] shrink-0 flex-col items-center gap-2 p-4 text-center"
            >
              <span className="text-3xl">{team.logo}</span>
              <span className="text-xs font-semibold leading-tight">{team.name}</span>
              <span className="text-[10px] text-mist-500">{team.league}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
