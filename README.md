<p align="center">
   <a href="https://github.com/dev-family/next-pwa-pack">
    <img src="https://img.shields.io/badge/github-next--pwa--pack-643add?logo=github&style=flat-square?color=643add&labelColor=86ce2c" alt="Version" />
  </a>
   <a href="https://www.npmjs.com/package/next-pwa-pack">
    <img src="https://img.shields.io/npm/v/next-pwa-pack.svg?color=643add&labelColor=86ce2c" alt="Version" />
  </a>
  <a href="https://www.npmjs.com/package/next-pwa-pack">
    <img src="https://img.shields.io/npm/dm/next-pwa-pack.svg?color=643add&labelColor=86ce2c" alt="Downloads" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/npm/l/next-pwa-pack.svg?color=643add&labelColor=86ce2c" alt="License" />
  </a>
</p>

<br />

<p align="center">
    <img src="/preview.jpg" alt="Admiral Administration panel" />
</p>

<br />

# next-pwa-pack

**PWA cache provider for Next.js.**  
Automatically registers a service worker, caches pages and static assets, adds a PWA manifest and offline page, supports offline mode, SPA navigation, advanced dev tools, and both server and client actions for cache management.

Made with :purple_heart: by [dev.family](https://dev.family/?utm_source=github&utm_medium=pwa&utm_campaign=readme)

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
   - A file with the server action `revalidatePWA` will also be automatically created or updated: `app/actions.ts` or `src/app/actions.ts` (if you use a `src` folder structure).

   If the files did not appear, run:

   ```bash
   node node_modules/next-pwa-pack/scripts/copy-pwa-files.mjs
   # or
   npx next-pwa-pack/scripts/copy-pwa-files.mjs
   ```

   If the server action did not appear, run:

   ```bash
   node node_modules/next-pwa-pack/scripts/copy-pwa-server-actions.mjs
   ```

   This script will create or update `app/actions.ts` or `src/app/actions.ts` with the `revalidatePWA` function for server-side cache revalidation.

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

## HOC withPWA

If you use SSR/Edge middleware or want to trigger server actions (e.g., for cache revalidation on the server), use the HOC:

```ts
// /middleware.ts
import { withPWA } from "next-pwa-pack";

function originalMiddleware(request) {
  // ...your logic
  return response;
}

export default withPWA(originalMiddleware, {
  revalidationSecret: process.env.REVALIDATION_SECRET!,
  sseEndpoint: "/api/pwa/cache-events",
  webhookPath: "/api/pwa/revalidate",
});

export const config = {
  matcher: ["/", "/(ru|en)/:path*", "/api/pwa/:path*"],
};
```

**HOC arguments:**

- `originalMiddleware` — your middleware function (e.g., for i18n, auth, etc.)
- `revalidationSecret` — secret for authorizing revalidation requests (required so only you can access it)
- `sseEndpoint` — endpoint for SSE events (default `/api/pwa/cache-events`)
- `webhookPath` — endpoint for webhook revalidation (default `/api/pwa/revalidate`)

**Important:**
In `config.matcher`, be sure to specify the paths that should be handled by this middleware (e.g., root, localized routes, and PWA endpoints).

---

## 📦 Export Structure

- **Components**:

  ```ts
  import { PWAProvider, usePWAStatus } from "next-pwa-pack";
  ```

- **HOC**:

  ```ts
  import { withPWA } from "next-pwa-pack";
  ```

- **Client actions**:

  Import from `next-pwa-pack/client-actions`:

  ```ts
  import {
    clearAllCache,
    reloadServiceWorker,
    updatePageCache,
    unregisterServiceWorkerAndClearCache,
    updateSWCache,
    disablePWACache,
    enablePWACache,
  } from "next-pwa-pack/client-actions";
  ```

  - `clearAllCache()` — clear all caches
  - `reloadServiceWorker()` — reload the service worker and the page
  - `updatePageCache(url?)` — update the cache for a page (current by default)
  - `unregisterServiceWorkerAndClearCache()` — remove the service worker and cache
  - `updateSWCache(urls)` — update cache for multiple pages in all tabs
  - `disablePWACache()` — temporarily disable cache (until reload)
  - `enablePWACache()` — re-enable cache

---

### Server actions

After installing the package, your project will have (or update) a file `app/actions.ts` or `src/app/actions.ts` with the function:

```ts
export async function revalidatePWA(urls: string[]) {
  // ...
}
```

Call it from server actions, server components, or API routes to trigger PWA cache revalidation by URL.

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

You can specify a custom path via the `swPath` prop:

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

### Cache revalidation after mutations

If you update data on the server (e.g., via POST/PUT/DELETE), use:

- `revalidateTag` (Next.js)
- `revalidatePWA` (server action)
- or `updateSWCache` (client action)

Example:

```ts
// server action
await revalidateTag("your-tag");
await revalidatePWA(["/your-page-url"]);
```

---

### Example: API route for external revalidation (e.g., from admin panel)

You can create your own API route to trigger cache revalidation by tags and/or URLs from outside (e.g., from an admin panel or another service):

```ts
// app/api/webhook/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateByTag, revalidatePWA } from "@/app/actions";
import { FetchTags } from "@/app/api/endpoints/backend";

export async function POST(request: NextRequest) {
  try {
    const { tags, secret, urls } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let successful = 0;
    let failed = 0;
    let tagsRevalidated = false;
    let urlsRevalidated = false;
    const validTags = Object.values(FetchTags);
    const invalidTags =
      tags?.filter((tag) => !validTags.includes(tag as any)) || [];

    if (invalidTags.length > 0) {
      return NextResponse.json(
        { error: `Invalid tags: ${invalidTags.join(", ")}` },
        { status: 400 }
      );
    }

    if (tags && tags.length > 0) {
      const tagResults = await Promise.allSettled(
        tags.map((tag) => revalidateByTag(tag as FetchTags))
      );
      successful = tagResults.filter((r) => r.status === "fulfilled").length;
      failed = tagResults.filter((r) => r.status === "rejected").length;
      tagsRevalidated = true;
    }

    if (urls && urls.length > 0) {
      await revalidatePWA(urls);
      urlsRevalidated = true;
    }

    return NextResponse.json({
      success: true,
      message: "Cache revalidation completed",
      tagsRevalidated,
      urlsRevalidated,
      tags: tags || [],
      urls: urls || [],
      successful,
      failed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Webhook revalidation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

Now you can send POST requests to `/api/webhook/revalidate` with the required tags, URLs, and secret — and trigger client cache updates from external systems.

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
- **Server action did not appear?**  
  Run the script manually to add the server action:
  ```bash
  node node_modules/next-pwa-pack/scripts/copy-pwa-server-actions.mjs
  ```
  This script will create or update `app/actions.ts` or `src/app/actions.ts` with the `revalidatePWA` function for server-side cache revalidation.

---

## 📦 Exported components and actions

- `PWAProvider` — wrapper for the application
- `usePWAStatus` — status hook
- All utilities for cache and SW management (client-actions)
- HOC `withPWA` for SSR/Edge middleware
- Server action `revalidatePWA` (automatically added to actions.ts)

---

## 🏆 How can I support the developers?

- Star our GitHub repo ⭐
- Create pull requests, submit bugs, suggest new features or documentation updates 🔧
- Read us on [Medium](https://medium.com/@dev.family)
- Follow us on [Twitter](https://twitter.com/dev___family) ��
- Like our page on [LinkedIn](https://www.linkedin.com/company/dev-family) 👍

---

## 🤝 Contributing

If you want to participate in the development, make a Fork of the repository, make the desired changes and send a pull request. We will be glad to consider your suggestions!

---

## ©️ License

This library is distributed under the MIT license.

---
