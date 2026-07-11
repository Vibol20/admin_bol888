"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <div className="font-mono text-2xl tracking-widest text-floodlight-500">--:--:--</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live-500" />
      </span>
      <span className="font-mono text-2xl tracking-widest text-floodlight-500">
        {time.toLocaleTimeString([], { hour12: false })}
      </span>
      <span className="text-xs text-mist-500">
        {time.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </span>
    </div>
  );
}
