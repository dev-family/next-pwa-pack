[![npm version](https://img.shields.io/npm/v/next-pwa-pack.svg?style=flat-square)](https://www.npmjs.com/package/next-pwa-pack)
[![npm downloads](https://img.shields.io/npm/dm/next-pwa-pack.svg?style=flat-square)](https://www.npmjs.com/package/next-pwa-pack)
[![license](https://img.shields.io/npm/l/next-pwa-pack.svg?style=flat-square)](./LICENSE)

[![GitHub](https://img.shields.io/badge/github-next--pwa--pack-blue?logo=github&style=flat-square)](https://github.com/dev-family/next-pwa-pack)

[Читать на русском](./README.ru.md)

# next-pwa-pack

**PWA cache provider for Next.js.**  
Automatically registers a service worker, caches pages and static assets, adds a PWA manifest and offline page, supports offline mode, SPA navigation, and advanced dev tools.

---

## 🚀 Quick Start

1. **Install the package:**

   ```bash
   yarn add next-pwa-pack
   # or
   npm install next-pwa-pack
   ```

2. **After installation** the following files will automatically appear:

   - `public/sw.js`
   - `public/manifest.json`
   - `public/offline.html`

     2.1 **If for some reason the files were not copied,** run the command:

   ```bash
   node node_modules/next-pwa-pack/scripts/copy-pwa-files.mjs
   or
   npx next-pwa-pack/scripts/copy-pwa-files.mjs
   ```

3. **Wrap your app with the provider:**

   ```tsx
   // _app.tsx or layout.tsx
   // if you need to keep the component server-side, create your own wrapper with "use client"
   import { PWAProvider } from "next-pwa-pack";

   export default function App({ children }) {
     return <PWAProvider>{children}</PWAProvider>;
   }
   ```

4. **Done!** Your app now supports PWA, offline mode, and page caching.

---

## Installation & Setup

When you install the package, PWA files (`sw.js`, `manifest.json`, `offline.html`) are automatically copied to the `public` directory.

- To copy files again, run:
  ```bash
  node node_modules/next-pwa-pack/scripts/copy-pwa-files.mjs
   or
   npx next-pwa-pack/scripts/copy-pwa-files.mjs
  ```

> **Note:** The script will not overwrite files that already exist in the `public` directory. If you want to update a file, delete it first and then re-run the script.

---



## 🛠️ Customization

### Manifest.json

After installing the package, a basic manifest will appear in `public/manifest.json`. You can edit it directly, adding your own icons, colors, app name, and other parameters:

```json
{
  "name": "MyApp",
  "short_name": "MyApp",
  "theme_color": "#ff0000",
  "background_color": "#ffffff",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Path

- You can specify a custom path via the `swPath` prop:
  ```tsx
  <PWAProvider swPath="/custom-sw.js">{children}</PWAProvider>
  ```

---

## ⚡ Dev Tools

With the `devMode` prop, a "PWA Dev Tools" panel appears (in the bottom left corner):

```tsx
<PWAProvider devMode>{children}</PWAProvider>
```

**Panel features:**

- Online/offline status
- App update button when a new version is available
- Cache clearing
- Force service worker reload
- Force cache update for the current page
- Full service worker and cache removal
- Global cache enable/disable (until page reload)

---

## 🧩 API & Hooks

### Hook `usePWAStatus`

Tracks the status of PWA/Service Worker:

```tsx
import { usePWAStatus } from "next-pwa-pack";
const { online, hasUpdate, swInstalled, update } = usePWAStatus();
```

- `online` — online/offline status
- `hasUpdate` — is an update available
- `swInstalled` — is the service worker installed
- `update()` — activate the new app version

---

### Utilities for cache and SW management

```ts
import {
  clearAllCache,
  reloadServiceWorker,
  updatePageCache,
  unregisterServiceWorkerAndClearCache,
  updateSWCache,
  disablePWACache,
  enablePWACache,
} from "next-pwa-pack";
```

- `clearAllCache()` — clear all caches
- `reloadServiceWorker()` — reload the service worker and the page
- `updatePageCache(url?)` — update the cache for a page (current by default)
- `unregisterServiceWorkerAndClearCache()` — remove the service worker and cache
- `updateSWCache(urls)` — update cache for multiple pages in all tabs
- `disablePWACache()` — temporarily disable cache (until reload)
- `enablePWACache()` — re-enable cache

---

### Cache Exclusions

In `public/sw.js` you can specify paths that should not be cached:

```js
const CACHE_EXCLUDE = ["/api/", "/admin"];
```

---

## 🏗️ How it works

- **Service Worker** caches HTML and static assets, supports TTL (10 minutes by default).
- **Offline.html** — the page shown when offline.
- **SPA navigation** — pages are cached even during client-side navigation.
- **Dev Tools** — allow cache and SW management directly from the UI.

---

## ❓ FAQ

- **Cache disabling** is valid only until the page reloads.
- **Old cache** is not deleted when disabled, just not used.
- **Re-enable cache** — with the button or by reloading the page.
- **Files didn't appear?**  
  Run:
  ```bash
  node node_modules/next-pwa-pack/scripts/copy-pwa-files.mjs
  ```

---

## 📦 Exported components

- `PWAProvider` — wrapper for the application
- `PWAProvider` — status hook
- All utilities for cache and SW management
