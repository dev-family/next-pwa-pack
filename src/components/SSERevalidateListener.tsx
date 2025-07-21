"use client";

import { useEffect, useRef } from "react";
import { updateSWCache } from "../pwaActions";
import { SSEEvent } from "../types";

interface SSERevalidateListenerProps {
  sseEndpoint?: string;
  enabled?: boolean;
}

export default function SSERevalidateListener({
  sseEndpoint = "/api/pwa/cache-events",
  enabled = true,
}: SSERevalidateListenerProps) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      console.log("[PWA-SSE] SSE disabled or not in browser");
      return;
    }

    console.log("[PWA-SSE] Starting SSE listener for:", sseEndpoint);

    const eventSource = new EventSource(sseEndpoint);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("[PWA-SSE] Connected to server");
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);
        console.log("[PWA-SSE] Received event:", data);

        if (data.type === "revalidate") {
          // Ревалидация по URL (для service worker кеша)
          if (data.urls && Array.isArray(data.urls)) {
            console.log("[PWA-SSE] Revalidating URLs:", data.urls);
            updateSWCache(data.urls);
          }
        }
      } catch (error) {
        console.warn("[PWA-SSE] Failed to parse message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.warn("[PWA-SSE] Connection error:", error);
    };

    return () => {
      console.log("[PWA-SSE] Cleaning up SSE connection");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [sseEndpoint, enabled]);

  return null;
}
