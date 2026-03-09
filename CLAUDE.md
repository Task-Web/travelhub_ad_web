# TravelHub - Project Overview

## Project Description

A comprehensive travel booking platform that enables users to search, compare, and book accommodations (hotels, apartments, vacation rentals), flights, car rentals, attractions, and airport taxis.

## Critical Requirements (Constitution)

**IMPORTANT**: This project is built on the basesite framework. You MUST follow the rules in `constitution.md`:

1. **Cookie-Scoped State Isolation**: Every request MUST resolve a user cookie and access only that user's state
2. **/state-manage Page**: The `/state-manage` page MUST exist with documentation and live editor tabs
3. **API Contract Stability**: Core REST routes must remain backward compatible
4. **Cookie Override**: The `?cookie=<user_id_value>` query parameter mechanism MUST be preserved

## Technology Stack

### Unified Next.js App
- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19 + TypeScript
- **Routing**: React Router inside a client shell
- **Styling**: Tailwind CSS with TravelHub design system
- **State Management**: Zustand for global state
- **Date Handling**: date-fns
- **API**: Next.js route handlers under `/api`

## Project Structure

```
travelhub_web/
├── .spec/                      # Specification and tracking
├── src/
│   ├── app/                     # Next.js App Router + API routes
│   ├── components/              # Shared UI components
│   ├── views/                   # Client-rendered views (React Router)
│   ├── store/                   # Zustand state management
│   ├── api/                     # Client API helpers
│   ├── lib/                     # Server utilities (state store, cookies, files)
│   └── utils/                   # Utility functions
├── uploads/                     # Uploaded files directory
├── docs/                        # Documentation
├── constitution.md              # MUST follow these rules
└── CLAUDE.md                    # This file
```

## Running the Project

```bash
npm install
npm run dev
```

Access points:
- App: http://localhost:3000
- API: http://localhost:3000/api
- State Manage: http://localhost:3000/state-manage

## Feature Implementation Guidelines

### Feature List

The feature list at `.spec/feature_list.json` contains all test cases. When implementing features:

1. Pick features in order (lower IDs first)
2. Implement the feature completely
3. Test using the steps in the feature
4. Only mark `"passes": true` when fully working
5. **NEVER remove or modify features** - only change the `passes` field

### Files to Preserve

- `src/App.jsx` - Basesite playground (legacy, keep working)
- `src/StateManage.jsx` - State console (REQUIRED)
- `src/apiClient.js` - Legacy API client

### API Client Usage

Always use the API client with credentials:

```typescript
import { propertiesApi, stateApi } from '@/api/client';

const results = await propertiesApi.search({ destination: 'London' });
const { user_id, state } = await stateApi.getState();
```

### State Management

Use Zustand for client-side state that syncs with backend:

```typescript
import { useAppStore } from '@/store';

const { preferences, setCurrency } = useAppStore();
setCurrency('USD'); // auto-syncs to backend
```

## Design System

### Colors (Tailwind classes)
- Primary: `bg-travelhub-blue` (#003580)
- Hover: `bg-travelhub-blue-hover` (#00224f)
- Light blue: `bg-travelhub-blue-light` (#0071c2)
- Success: `text-success` (#008009)
- Warning: `text-warning` (#ff8c00)
- Error: `text-error` (#cc0000)

### Component Patterns
- Cards: `rounded-lg shadow-card hover:shadow-card-hover`
- Buttons: `rounded px-4 py-2 bg-travelhub-blue text-white hover:bg-travelhub-blue-hover`
- Inputs: `rounded border border-neutral-200 px-4 py-2 focus:ring-2 focus:ring-travelhub-blue-light`

## Testing

```bash
npm run test
```

## Important Notes

1. **Always preserve cookie functionality** - The cookie override mechanism is critical
2. **State manage page must work** - This is used for testing and debugging
3. **Use TypeScript** - All new frontend code should be TypeScript
4. **Follow design system** - Use Tailwind classes from tailwind.config.ts
5. **Test incrementally** - Mark features as passing only when fully working
