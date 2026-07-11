"use client";

import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToasts } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToasts();

  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 md:bottom-6">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "glass pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-glass animate-fade-up",
              toast.type === "success" && "border-floodlight-500/40",
              toast.type === "error" && "border-live-500/40"
            )}
          >
            <Icon
              size={16}
              className={cn(
                toast.type === "success" && "text-floodlight-500",
                toast.type === "error" && "text-live-500",
                toast.type === "info" && "text-mist-500"
              )}
            />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-mist-500 hover:text-pitch-900 dark:hover:text-mist-100"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
