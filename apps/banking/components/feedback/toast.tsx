"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

interface Toast {
  id: number;
  text: string;
}

interface ToastContextValue {
  showToast: (text: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** ToastLayer (F107): announced politely, anchored above the bottom navigation. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const showToast = useCallback((text: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, text }]);
    setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="above-bottom-nav pointer-events-none fixed inset-x-4 z-50 flex flex-col items-center gap-2"
      >
        {toasts.map((toast) => (
          <p
            key={toast.id}
            className="max-w-full rounded-(--radius-control) bg-ink px-4 py-3 text-sm text-white shadow-(--shadow-raised)"
          >
            {toast.text}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within ToastProvider");
  return value;
}
