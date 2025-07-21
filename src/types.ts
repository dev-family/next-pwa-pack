export interface SSEConnectedEvent {
  type: "connected";
  timestamp: string;
}

export interface SSERevalidateEvent {
  type: "revalidate";
  tag?: string;
  tags?: string[];
  urls?: string[];
  timestamp: string;
}

export type SSEEvent = SSEConnectedEvent | SSERevalidateEvent;

export interface NextRequest {
  nextUrl: URL;
  method: string;
  json(): Promise<any>;
  signal: AbortSignal;
}



export interface PWAMiddlewareConfig {
  revalidationSecret: string;
  sseEndpoint?: string;
  webhookPath?: string;
}
