"use client";
import { useEffect } from "react";

interface RegisterSWProps {
  swPath?: string;
}

export default function RegisterSW({ swPath = "/sw.js" }: RegisterSWProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(swPath)
        .then((reg) => {
          console.log("[PWA] Service Worker registered", reg);
        })
        .catch((err) => {
          console.error("[PWA] SW registration failed", err);
        });
    }
  }, [swPath]);

  return null;
}
