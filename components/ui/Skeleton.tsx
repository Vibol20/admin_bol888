import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function NewsCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="glass-card flex items-center justify-between p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 px-4 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}
