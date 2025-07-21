import { useEffect, useState } from "react";

export type PWAStatus = {
  online: boolean;
  hasUpdate: boolean;
  swInstalled: boolean;
  update: () => void;
};

/**
 * usePWAStatus — hook for tracking the status of PWA/Service Worker.
 * Returns the online/offline status, the presence of an update, whether the SW is installed, and a function to update.
 *
 * @example
 * const { online, hasUpdate, swInstalled, update } = usePWAStatus();
 * if (!online) return <div>You are offline</div>;
 * if (hasUpdate) return <button onClick={update}>Update application</button>;
 */
export function usePWAStatus(): PWAStatus {
  const [online, setOnline] = useState(true);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [swInstalled, setSwInstalled] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) setSwInstalled(true);
        if (reg && reg.waiting) setHasUpdate(true);
      });
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        setHasUpdate(false);
      });
    }
  }, []);

  // Function for updating the application (activation of a new SW)
  const update = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      });
    }
  };

  return { online, hasUpdate, swInstalled, update };
}
