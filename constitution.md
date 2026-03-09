# Base Experiment Site Constitution

## Amendment: Unified Next.js Architecture

Proposal:
- Migrate from the separated FastAPI + Vite stack to a single Next.js full-stack app
  that follows the `basesite` architecture while preserving all existing routes and
  state semantics.

Impact analysis:
- Breaking infrastructure change: backend runtime shifts from Python to Node/Next API routes.
- API contracts remain backward compatible (`/api/state`, `/api/info`, `/api/files`, etc.).
- Deployment topology simplifies to one service; existing reverse-proxy configs must be updated.
- Documentation and tests must be updated to reference Next.js tooling and routes.

Migration plan:
1. Scaffold Next.js app at repo root and port Tailwind config/styles.
2. Port state store, file storage, and domain APIs into Next API routes.
3. Embed existing UI as client components and keep `/state-manage` intact.
4. Remove deprecated FastAPI/Vite artifacts after validation.
5. Update docs/tests and verify `/state-manage`, `/api/info`, `/api/state`, and `/api/files`.

## Core Principles

### I. Cookie-Scoped State Isolation
- Every request MUST resolve a user cookie (default `user_id`) and access only that user's state.
- Clients MUST include cookies in API calls; the backend MUST issue a cookie when missing.
- Do not add authentication or shared/global state unless a feature explicitly requires it and
  documents the scope change.
Rationale: Isolation keeps experiments safe, reproducible, and predictable for concurrent users.

### II. Preserve /state-manage as the Canonical Interface
- The `/state-manage` page MUST exist with both the documentation tab and the live editor tab.
- The interface MUST continue to read, patch, replace, and reset per-user state.
- Extensions are allowed, but the core controls and guidance MUST remain visible and usable.
Rationale: This is the single reliable control surface for inspecting and updating state.

### III. API and MCP Contract Stability
- Core REST routes and response shapes MUST remain backward compatible:
  `GET/PUT/PATCH/DELETE /api/state`, `GET /api/info`, `GET /api/health`,
  `POST/GET /api/files`, and `GET /api/files/{filename}`.
- The `/mcp` tools MUST mirror REST behavior and semantics.
- Breaking changes require a migration plan, versioned contracts, and a MAJOR version bump.
Rationale: External clients and automation depend on stable contracts.

### IV. Documentation Is Part of the Interface
- When contracts, state shape change, update `docs/API.md`, `docs/STATE.md`, and `README.md` in the same change.
- Examples MUST match real payloads and behavior.
Rationale: Documentation is the primary integration surface for users and agents.

### V. Testability and Quality Gates
- Backend route changes MUST include pytest coverage for success, error shape, and cookie behavior.
- Frontend view or API helper changes MUST include vitest coverage for primary flows and errors.
- Tests MUST run offline with mocked network dependencies.
Rationale: Reliable tests protect the cookie-scoped contract and core UX.

### VI. State-Driven Content Architecture
- Backend state is the **single source of truth** for all displayable content (flights, hotels, cars, attractions, etc.).
- Frontend MUST read display data from backend state, NOT from hardcoded values or API responses that bypass state.
- State structure uses **typed categories** with predefined schemas (`flights[]`, `hotels[]`, `cars[]`, `attractions[]`, `bookings[]`) plus a free-form `custom` field for extensions.
- Domain APIs (flights, hotels, etc.) MUST read from and write to user state when processing requests.
- New users MUST receive pre-populated default data (sample flights, hotels, etc.) to demonstrate the system.
- Users can fully customize displayed content via `/state-manage` - adding, modifying, or removing any data.
- When state-manage edits conflict with UI interactions, **state-manage wins** - backend state is authoritative.
- Frontend uses **optimistic rendering**: show default UI immediately, update when backend state arrives.
- **Real-time state synchronization**: All user actions (searches, selections, bookings, cart changes, preference updates) MUST be immediately persisted to backend state. The state should always reflect the current user session accurately.
Rationale: State-driven architecture enables full customization, testability, and predictable behavior while allowing users to define their own data through the state management interface.

## Platform & Architecture Constraints

- The application is built with **Next.js** as a unified full-stack framework, with API routes
  and frontend served from the same origin.
- API routes expose cookie-scoped state and the `StateStore` contract
  (`get_state`, `replace_state`, `patch_state`, `reset_state`, `delete_state`).
- Client API calls MUST include cookies and default to `/api` (override via
  `NEXT_PUBLIC_API_BASE` only when necessary).
- The state envelope (`meta`, `data`, `note`) and metadata semantics (created/updated timestamps,
  version counter) MUST be preserved.
- The `data` field MUST contain typed categories for domain content:
  ```
  data: {
    preferences: { currency, language, ... },
    flights: [{ id, airline, origin, destination, price, ... }],
    hotels: [{ id, name, location, price, amenities, ... }],
    cars: [{ id, provider, type, price, ... }],
    attractions: [{ id, name, location, price, ... }],
    airports: [{ code, name, city, country, ... }],
    bookings: [{ id, type, status, details, ... }],
    cart: { items: [...], total },
    search: { lastQuery, filters, ... },
    custom: { ... } // free-form extension field
  }
  ```
- Domain APIs MUST query/filter from user's state data and return subsets matching the request.
- When user state lacks data for a request, APIs MAY return empty results or populate defaults.
- File uploads are stored server-side and referenced by URL; legacy base64 uploads remain supported
  unless explicitly deprecated with a migration plan.
- **Cookie Override via Query Parameter**: The `?cookie=<user_id_value>` query parameter MUST be supported on all pages and API endpoints. This allows users/agents to pin or switch their identity:
  - API routes: `getUserId()` checks `request.nextUrl.searchParams.get("cookie")` first, falls back to cookie header, then generates new UUID
  - Client components: `applyCookieFromQuery()` reads the query param, sets `document.cookie`, and redirects to clean URL
  - This mechanism MUST remain unchanged when building on basesite

## Delivery Workflow & Quality Gates

- Changes to state data or metadata MUST update backend models/schemas and the frontend
  `/state-manage` preview/editor to stay aligned.
- Use `PATCH /api/state` for iterative updates and populate `note` to describe the change context.
- Every spec/plan MUST include a constitution check and record any required violations with
  rationale and a rollback plan.
- Release readiness requires verifying `/state-manage`, `/api/info`, and `/api/state` still work.

## Governance

- This constitution supersedes other practices; if work conflicts, amend the constitution first.
- Amendments require: a written proposal, impact analysis, migration plan (if breaking), and
  updates to dependent templates/docs in the same change.
- Versioning follows semantic rules: MAJOR for incompatible contract or principle changes, MINOR
  for new principles/sections or substantive policy expansion, PATCH for clarifications.
- Compliance review occurs during plan/spec creation and before merge; reviewers must confirm
  constitution gates are met or explicitly waived with justification.
- Runtime guidance lives in `docs/API.md`, `docs/STATE.md`, `docs/EXTENDING.md`, and
  `docs/TESTING.md`; keep these aligned with constitutional rules.
