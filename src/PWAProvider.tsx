"use client";
import { ReactNode } from "react";
import RegisterSW from "./RegisterSW";
import CacheCurrentPage from "./CacheCurrentPage";
import DevPWAStatus from "./DevPWAStatus";
import SWRevalidateListener from "./SWRevalidateListener";

interface PWAProviderProps {
  children: ReactNode;
  swPath?: string;
  devMode?: boolean;
}
/**
 * PWAProvider — wrapper for automatic service worker registration and page caching.
 *
 * @param children - React children
 * @param swPath - path to service worker (default /sw.js)
 * @param devMode - development mode with dev tools indicator and actions (left bottom corner of the screen) (default false)
 *
 * @example
 * ```tsx
 * import { PWAProvider } from "next-pwa-pack";
 * export default function layout({ children }) {
 *   return <PWAProvider>{children}</PWAProvider>;
 * }
 * ```
 */
export default function PWAProvider({
  children,
  swPath,
  devMode = false,
}: PWAProviderProps) {
  return (
    <>
      <RegisterSW swPath={swPath} />
      <CacheCurrentPage />
      <SWRevalidateListener />
      {devMode && <DevPWAStatus />}
      {children}
    </>
  );
}
