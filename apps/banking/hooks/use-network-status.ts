"use client";

import { useEffect, useState } from "react";

interface NetworkStatus {
  online: boolean;
  /** True on 2g/slow-2g connections where heavy assets should not load (F111). */
  slow: boolean;
}

interface NetworkInformationLike {
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({ online: true, slow: false });

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    const update = () => {
      const effectiveType = connection?.effectiveType ?? "";
      setStatus({
        online: navigator.onLine,
        slow: effectiveType === "2g" || effectiveType === "slow-2g",
      });
    };
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    connection?.addEventListener?.("change", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      connection?.removeEventListener?.("change", update);
    };
  }, []);

  return status;
}
