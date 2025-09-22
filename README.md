# Портфолио (Vite + React + Tailwind) + Telegram backend (Express)

## Быстрый старт
```bash
npm install
npm run dev:all
```
Откроется фронт на http://localhost:5173 (проксирует /api на http://localhost:5174).

## Настройка Telegram
1. Скопируйте `.env.example` в `.env` и заполните `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
2. Бэк принимает POST `/api/contact` c JSON:
   ```json
   { "name": "...", "email": "...", "phone": "...", "message": "..." }
   ```

## Скрипты
- `npm run dev` — только фронт
- `npm run dev:server` — только бэк
- `npm run dev:all` — фронт + бэк
- `npm run build` — сборка фронта
- `npm run preview` — предпросмотр prod-сборки

## Где править контент
- `src/App.jsx` — весь интерфейс, проекты, тексты.
- Папка `public/` — статические файлы (доступ по корню `/`).
# suvorovaWork
