import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-floodlight-500/15 text-floodlight-500">
        <SearchX size={30} />
      </div>
      <h1 className="font-display text-3xl tracking-wide">Offside — Page Not Found</h1>
      <p className="max-w-sm text-sm text-mist-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn-primary mt-3">
        <Home size={16} /> Back to Home
      </Link>
    </div>
  );
}
