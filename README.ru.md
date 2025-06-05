# next-pwa-pack

**PWA cache provider для Next.js.**  
Автоматически регистрирует сервис-воркер, кэширует страницы и статику, добавляет PWA-манифест и offline-страницу, поддерживает офлайн-режим, SPA-навигацию и расширенные dev-инструменты.

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

     2.1 **Если по какой-то причине файлы не скопировались** введите команду:

   ```bash
   node node_modules/next-pwa-pack/scripts/copy-pwa-files.mjs
   или
   npx next-pwa-pack/scripts/copy-pwa-files.mjs
   ```

3. **Обверните приложение в провайдер:**

   ```tsx
   // _app.tsx или layout.tsx
   // если нужно сохранить компонент серверным - создайте свою обертку с "use client"
   import { PWAProvider } from "next-pwa-pack";

   export default function App({ children }) {
     return <PWAProvider>{children}</PWAProvider>;
   }
   ```

4. **Готово!** Ваше приложение теперь поддерживает PWA, офлайн-режим и кэширование страниц.

---

## Установка и настройка

При установке пакета PWA-файлы (`sw.js`, `manifest.json`, `offline.html`) автоматически копируются в директорию `public`.

- Чтобы скопировать файлы повторно, выполните:
  ```bash
  node node_modules/next-pwa-pack/scripts/copy-pwa-files.mjs
  или
  npx next-pwa-pack/scripts/copy-pwa-files.mjs
  ```

> **Примечание:** Скрипт не перезаписывает файлы, которые уже есть в папке `public`. Если вы хотите обновить файл, удалите его и повторно запустите скрипт.

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

- Можно указать свой путь через проп `swPath`:
  ```tsx
  <PWAProvider swPath="/custom-sw.js">{children}</PWAProvider>
  ```

---

## ⚡ Dev-инструменты

C пропом `devMode` появляется панель "PWA Dev Tools" (в левом нижнем углу):

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

### Утилиты для управления кэшем и SW

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

- `clearAllCache()` — очистить все кэши
- `reloadServiceWorker()` — перезагрузить сервис-воркер и страницу
- `updatePageCache(url?)` — обновить кэш для страницы (по умолчанию текущей)
- `unregisterServiceWorkerAndClearCache()` — удалить сервис-воркер и кэш
- `updateSWCache(urls)` — обновить кэш для нескольких страниц во всех вкладках
- `disablePWACache()` — временно отключить кэш (до перезагрузки)
- `enablePWACache()` — включить кэш обратно

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

---

## 📦 Экспортируемые компоненты

- `PWAProvider` — обёртка для приложения
- `usePWAStatus` — хук статуса
- Все утилиты для управления кэшем и SW

---
