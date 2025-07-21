import { NextRequest, PWAMiddlewareConfig } from "../types";

const connections = new Set<ReadableStreamDefaultController>();

function broadcastEvent(data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`;

  console.log("[PWA-SSE] Broadcasting:", data);
  console.log("[PWA-SSE] Active connections:", connections.size);

  connections.forEach((controller) => {
    try {
      controller.enqueue(message);
    } catch (error) {
      connections.delete(controller);
    }
  });
}


export function withPWA(
  originalMiddleware: (request: any) => any,
  config = {
    webhookPath: "/api/pwa/revalidate",
    sseEndpoint: "/api/pwa/cache-events",
    revalidationSecret: process.env.REVALIDATION_SECRET!,
  }
) {
  return function PWAMiddleware(request: any) {
    const url = request.nextUrl;

    if (url.pathname === config?.webhookPath && request.method === "POST") {
      return handleRevalidation(request, config);
    }

    if (url.pathname === config?.sseEndpoint && request.method === "GET") {
      return handleSSE(request);
    }

    return originalMiddleware(request);
  };
}

async function handleRevalidation(
  request: NextRequest,
  config: PWAMiddlewareConfig
) {
  try {
    const { tags, secret, urls } = await request.json();

    if (secret !== config.revalidationSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log("[PWA] Revalidation request:", { tags, urls });

    const revalidateEvent = {
      type: "revalidate" as const,
      tags,
      urls,
      timestamp: new Date().toISOString(),
    };

    broadcastEvent(revalidateEvent);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Revalidation completed",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[PWA] Revalidation error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

function handleSSE(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      connections.add(controller);

      const connectedEvent = {
        type: "connected",
        timestamp: new Date().toISOString(),
      };

      controller.enqueue(`data: ${JSON.stringify(connectedEvent)}\n\n`);

      request.signal.addEventListener("abort", () => {
        connections.delete(controller);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
