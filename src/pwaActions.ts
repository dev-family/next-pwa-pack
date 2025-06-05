/**
 * Clears all caches related to the service worker.
 *
 * @example
 * ```ts
 * import { clearAllCache } from "next-pwa-pack";
 * await clearAllCache();
 * ```
 */
export async function clearAllCache() {
  const keys = await caches.keys();
  await Promise.all(keys.map((k) => caches.delete(k)));
}

/**
 * Reload service worker
 *
 * @example
 * ```ts
 * import { reloadServiceWorker } from "next-pwa-pack";
 * await reloadServiceWorker();
 * ```
 */
export async function reloadServiceWorker() {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  }
}

/**
 * Updates the cache for the page.
 *
 * @param url - url page to update cache (default is current page)
 * @example
 * ```ts
 * import { updatePageCache } from "next-pwa-pack";
 * await updatePageCache("/page");
 * ```
 */
export function updatePageCache(url?: string) {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "REVALIDATE_URL",
      url: url || window.location.href,
    });
  }
}

/**
 * Unregisters the service worker and clears the cache.
 *
 * @example
 * ```ts
 * import { unregisterServiceWorkerAndClearCache } from "next-pwa-pack";
 * await unregisterServiceWorkerAndClearCache();
 * ```
 */
export async function unregisterServiceWorkerAndClearCache() {
  if ("serviceWorker" in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((reg) => reg.unregister()));
    await clearAllCache();
  }
}

/**
 * Signals the client to update the cache for multiple urls in other tabs.
 * Can be called after revalidateTag on the client.
 * @param urls - array of urls to update cache
 */
export function signalSWRevalidate(urls: string[]) {
  localStorage.setItem(
    "swRevalidate",
    JSON.stringify({ urls, ts: Date.now() })
  );
}

/**
 * Trigger signal for all tabs and update cache in current tab.
 * Can be called after revalidateTag on the client.
 * @param urls - array of urls to update cache
 */
export function updateSWCache(urls: string[]) {
  signalSWRevalidate(urls); // Signal for other tabs
  urls.forEach(updatePageCache); // Update cache in current tab
}

/**
 * Disables all PWA cache globally (until reload or enablePWACache is called).
 */
export function disablePWACache() {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "DISABLE_CACHE" });
  }
}

/**
 * Enables all PWA cache globally (after disablePWACache).
 */
export function enablePWACache() {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "ENABLE_CACHE" });
  }
}
