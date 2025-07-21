"use client";

import { useEffect } from "react";
import { updatePageCache } from "../pwaActions";

export default function SWRevalidateListener() {
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "swRevalidate" && e.newValue) {
        try {
          const { urls } = JSON.parse(e.newValue);
          if (Array.isArray(urls)) {
            urls.forEach(updatePageCache);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  return null;
}
