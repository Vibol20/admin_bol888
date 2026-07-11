"use client";

import { useCallback, useEffect, useState } from "react";
import { ToastMessage } from "@/types";
import { uid } from "@/lib/utils";

type Listener = (toasts: ToastMessage[]) => void;

let toasts: ToastMessage[] = [];
const listeners: Set<Listener> = new Set();

function emit() {
  listeners.forEach((l) => l(toasts));
}

export function pushToast(message: string, type: ToastMessage["type"] = "info") {
  const toast: ToastMessage = { id: uid("toast"), message, type };
  toasts = [...toasts, toast];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== toast.id);
    emit();
  }, 3500);
}

export function useToasts() {
  const [state, setState] = useState<ToastMessage[]>(toasts);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, []);

  return { toasts: state, dismiss };
}
