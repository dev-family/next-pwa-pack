# next-pwa-pack

**PWA cache provider для Next.js.**  
Автоматически регистрирует сервис-воркер, кэширует страницы и статику, добавляет PWA-манифест и offline-страницу, поддерживает офлайн-режим, SPA-навигацию, расширенные dev-инструменты, серверные и клиентские экшены для управления кэшем.

---

## 🚀 Быстрый старт

1. **Установите пакет:**

   ```bash
   yarn add next-pwa-pack
   # или
   npm install next-pwa-pack
   ```

2. **После установки** автоматически появятся файлы:

   - `public/sw.js`
   - `public/manifest.json`
   - `public/offline.html`
   - Также автоматически добавляется (или дополняется) файл с серверным экшеном `revalidatePWA` — `app/actions.ts` или `src/app/actions.ts` (если используется структура с папкой src).

   Если файлы не скопировались, выполните:

   ```bash
   node node_modules/next-pwa-pack/scripts/copy-pwa-files.mjs
   # или
   npx next-pwa-pack/scripts/copy-pwa-files.mjs
   ```

3. **Оберните приложение в провайдер:**

   ```tsx
   // _app.tsx или layout.tsx
   // если нужно сохранить компонент серверным - создайте свою обертку с "use client"
   import { PWAProvider } from "next-pwa-pack";

   export default function App({ children }) {
     return <PWAProvider>{children}</PWAProvider>;
   }
   ```

4. **Готово!** Ваше приложение теперь поддерживает PWA, офлайн-режим и кэширование страниц.

## HOC withPWA

Если вы используете SSR/Edge middleware или хотите инициировать серверные экшены (например, для ревалидации кэша на сервере), используйте HOC:

```ts
// /middleware.ts
import { withPWA } from "next-pwa-pack/hoc/withPWA";

function originalMiddleware(request) {
  // ...ваша логика
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

**Аргументы хока:**

- `originalMiddleware` — ваша функция middleware (например, для i18n, авторизации и т.д.)
- `revalidationSecret` — секрет для авторизации запросов на ревалидацию, нужен, чтобы никто кроме вас не мог в него стучаться
- `sseEndpoint` — endpoint для SSE-событий (по умолчанию `/api/pwa/cache-events`)
- `webhookPath` — endpoint для webhook-ревалидации (по умолчанию `/api/pwa/revalidate`)

**Важно:**
В `config.matcher` обязательно укажите пути, которые должны обрабатываться этим middleware (например, корень сайта, локализованные маршруты и PWA endpoints).

---

## 📦 Структура экспорта

- **Компоненты**:

  ```ts
  import { PWAProvider, usePWAStatus } from "next-pwa-pack";
  ```

- **HOC**:

  ```ts
  import { withPWA } from "next-pwa-pack";
  ```

### Клиентские экшены (Client Actions)

Импортируйте из `next-pwa-pack/client-actions`:

```ts
import {
  clearAllCache,
  reloadServiceWorker,
  updatePageCache,
  unregisterServiceWorkerAndClearCache,
  updateSWCache,
  disablePWACache,
  enablePWACache,
  clearStaticCache
} from "next-pwa-pack/client-actions";
```

- `clearAllCache()` — очистить все кэши
- `reloadServiceWorker()` — перезагрузить сервис-воркер и страницу
- `updatePageCache(url?)` — обновить кэш для страницы (по умолчанию текущей)
- `unregisterServiceWorkerAndClearCache()` — удалить сервис-воркер и кэш
- `updateSWCache(urls)` — обновить кэш для нескольких страниц во всех вкладках
- `disablePWACache()` — временно отключить кэш (до перезагрузки)
- `enablePWACache()` — включить кэш обратно
- `clearStaticCache()` - очищает кэш статических ресурсов


---

### Серверные экшены (Server Actions)

После установки пакета в вашем проекте появится (или дополнится) файл `app/actions.ts` или `src/app/actions.ts` с функцией:

```ts
export async function revalidatePWA(urls: string[]) {
  // ...
}
```

Вызывайте её из server actions, server components или API routes для триггера PWA-ревалидации по URL.

---

## 🛠️ Кастомизация

### Manifest.json

После установки пакета в `public/manifest.json` появится базовый манифест. Вы можете отредактировать его напрямую, добавив свои иконки, цвета, имя приложения и другие параметры:

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

### Путь к сервис-воркеру

Можно указать свой путь через проп `swPath`:

```tsx
<PWAProvider swPath="/custom-sw.js">{children}</PWAProvider>
```

---

## ⚡ Dev-инструменты

С пропом `devMode` появляется панель "PWA Dev Tools" (в левом нижнем углу):

```tsx
<PWAProvider devMode>{children}</PWAProvider>
```

**Возможности панели:**

- Статус онлайн/оффлайн
- Кнопка обновления приложения при наличии новой версии
- Очистка кэша
- Принудительная перезагрузка сервис-воркера
- Принудительное обновление кэша текущей страницы
- Полное удаление сервис-воркера и кэша
- Глобальное отключение/включение кэша (до перезагрузки страницы)

---

## 🧩 API и хуки

### Хук `usePWAStatus`

Следит за статусом PWA/Service Worker:

```tsx
import { usePWAStatus } from "next-pwa-pack";
const { online, hasUpdate, swInstalled, update } = usePWAStatus();
```

- `online` — онлайн/оффлайн статус
- `hasUpdate` — доступно ли обновление
- `swInstalled` — установлен ли сервис-воркер
- `update()` — активировать новую версию приложения

---

### Ревалидация кэша после мутаций

Если вы обновляете данные на сервере (например, через POST/PUT/DELETE), используйте:

- `revalidateTag` (Next.js)
- `revalidatePWA` (серверный экшен)
  или
- `updateSWCache` (клиентский экшен)

Пример:

```ts
// server action
await revalidateTag("your-tag");
await revalidatePWA(["/your-page-url"]);
```

---

### Пример: API-роут для внешней ревалидации (например, из админки)

Вы можете создать свой API-роут, чтобы инициировать ревалидацию кэша по тегам и/или URL извне (например, из админки или другого сервиса):

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

Теперь вы можете отправлять POST-запросы на `/api/webhook/revalidate` с нужными тегами, URL и секретом — и инициировать обновление клиентского кэша из внешних систем.

---

### Исключения из кэширования

В файле `public/sw.js` можно указать пути, которые не должны кэшироваться:

```js
const CACHE_EXCLUDE = ["/api/", "/admin"];
```

---

## 🏗️ Как это работает

- **Service Worker** кэширует HTML и статику, поддерживает TTL (по умолчанию 10 минут).
- **Offline.html** — страница, которая показывается при отсутствии сети.
- **SPA-навигация** — страницы кэшируются даже при переходах без перезагрузки.
- **Dev Tools** — позволяют управлять кэшем и SW прямо из интерфейса.

---

## ❓ FAQ

- **Отключение кэша** действует только до перезагрузки страницы.
- **Старый кэш** не удаляется при отключении, просто не используется.
- **Включить кэш обратно** — кнопкой или перезагрузкой страницы.
- **Файлы не появились?**  
  Запустите:
  ```bash
  node node_modules/next-pwa-pack/scripts/copy-pwa-files.mjs
  ```
- **Серверный экшен не появился?**  
  Запустите вручную скрипт для добавления server action:
  ```bash
  node node_modules/next-pwa-pack/scripts/copy-pwa-server-actions.mjs
  ```
  Этот скрипт создаст или дополнит файл `app/actions.ts` или `src/app/actions.ts` функцией `revalidatePWA` для серверной ревалидации кэша.

---

## 📦 Экспортируемые компоненты и экшены

- `PWAProvider` — обёртка для приложения
- `usePWAStatus` — хук статуса
- Все утилиты для управления кэшем и SW (client-actions)
- HOC `withPWA` для SSR/Edge middleware
- Серверный экшен `revalidatePWA` (автоматически добавляется в actions.ts)

---

## 🏆 Как поддержать проект?

- Поставьте звезду на GitHub ⭐
- Создавайте pull requests, сообщайте о багах, предлагайте новые фичи или улучшения документации 🔧
- Читайте нас на [Medium](https://medium.com/@dev.family)
- Следите за нами в [Twitter](https://twitter.com/dev___family)
- Лайкайте нашу страницу на [LinkedIn](https://www.linkedin.com/company/dev-family) 👍

---

## 🤝 Contributing

Хотите поучаствовать в разработке? Сделайте Fork репозитория, внесите изменения и отправьте pull request. Мы будем рады вашим предложениям!

---

## ©️ License

MIT
