# TravelHub (Next.js)

Unified travel booking experience built on a single Next.js application. The UI and APIs run together, sharing a cookie-scoped state store that powers all displayable content.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Docker compose

```bash
docker compose up --build
```

Open http://localhost:3000.

## Highlights

- Per-user state keyed by cookie; no login required.
- REST endpoints for state lifecycle (`GET/PUT/PATCH/DELETE /api/state`) plus system info and health.
- `/state-manage` page with documentation + live editor (constitutional requirement).
- File uploads stored server-side under `uploads/` and referenced by URL.
- Cookie override via `?cookie=<user_id>` supported on all pages and API routes.
- State-driven UI: flights, hotels, cars, attractions, bookings, cart, and search state all come from backend state.

## Repository layout

```
travelhub_web/
├── src/
│   ├── app/                 # Next.js App Router + API routes
│   ├── components/          # Shared UI components
│   ├── views/               # Client-rendered page views (React Router shell)
│   ├── store/               # Zustand state
│   ├── api/                 # Client API helpers
│   └── lib/                 # Server utilities (state store, file store, cookies)
├── uploads/                 # Uploaded file storage
├── docs/                    # API/State/Testing docs
├── constitution.md          # Core principles and constraints
└── package.json             # Dependencies and scripts
```

## API endpoints

Base path: `/api` (same origin)

- `GET/PUT/PATCH/DELETE /api/state`
- `GET /api/info`
- `GET /api/health` and `GET /health`
- `POST/GET /api/files` and `GET /api/files/{filename}`
- Domain APIs: `/api/airports`, `/api/flights`, `/api/hotels`, `/api/cars`, `/api/attractions`, `/api/packages`, `/api/bookings`, `/api/cart`, `/api/preferences`, `/api/search`, `/api/disputes`

## Environment variables

- `COOKIE_NAME` (default `user_id`)
- `COOKIE_MAX_AGE` (seconds, default 30 days)
- `APP_NAME` (default `TravelHub Web`)
- `NEXT_PUBLIC_API_BASE` (optional, default `/api`)

## Testing

```bash
npm run test
```

## Development tips

- Keep `/state-manage` intact with docs + editor tabs.
- Update `docs/API.md` and `docs/STATE.md` when the state schema changes.
- Use `PATCH /api/state` for incremental updates and include `note` when possible.
