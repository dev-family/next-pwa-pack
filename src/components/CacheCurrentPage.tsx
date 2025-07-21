"use client";
import { useEffect } from "react";

export default function CacheCurrentPage() {
  useEffect(() => {
    let unsubscribed = false;

    const cachePage = async () => {
      if (
        "serviceWorker" in navigator &&
        navigator.serviceWorker.controller &&
        navigator.onLine
      ) {
        try {
          const url = window.location.href;
          const response = await fetch(url, {
            headers: {
              // Required for SSR-HTML
              Accept: "text/html",
            },
          });
          const html = await response.text();
          navigator.serviceWorker.controller.postMessage({
            type: "CACHE_CURRENT_HTML",
            url,
            html,
            ts: Date.now(),
          });
          console.log("[CacheCurrentPage] Cached via fetch:", url);
        } catch (err) {
          console.error("[CacheCurrentPage] fetch failed", err);
        }
      }
    };

    // Function that waits for the controller to appear
    const ensureSWReadyAndCache = () => {
      if ("serviceWorker" in navigator && navigator.onLine) {
        if (navigator.serviceWorker.controller) {
          cachePage();
        } else {
          // Wait for the controller to appear
          const onControllerChange = () => {
            if (!unsubscribed) cachePage();
            navigator.serviceWorker.removeEventListener(
              "controllerchange",
              onControllerChange
            );
          };
          navigator.serviceWorker.addEventListener(
            "controllerchange",
            onControllerChange
          );
        }
      }
    };

    ensureSWReadyAndCache();

    // SPA navigation, intercept pushState and replaceState methods of history
    const wrapHistoryMethod = (type: "pushState" | "replaceState") => {
      const orig = history[type];
      history[type] = function (...args) {
        const result = orig.apply(this, args);
        window.dispatchEvent(new Event("next-navigate"));
        return result;
      };
    };

    wrapHistoryMethod("pushState"); // for normal navigation
    wrapHistoryMethod("replaceState"); // for replacing the current page

    window.addEventListener("popstate", ensureSWReadyAndCache); // for backward/forward navigation
    window.addEventListener("next-navigate", ensureSWReadyAndCache); // for SPA navigation

    return () => {
      unsubscribed = true;
      window.removeEventListener("popstate", ensureSWReadyAndCache);
      window.removeEventListener("next-navigate", ensureSWReadyAndCache);
    };
  }, []);

  return null;
}
