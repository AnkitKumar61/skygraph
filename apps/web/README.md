# SkyGraph Web Application

This deployable unit will contain the React, TypeScript, Vite, Tailwind, Leaflet, and Framer Motion
single-page application deployed to Vercel.

Its frozen organization is feature-first under `src/features`, with shared design-system, API,
WebSocket, hook, and map-adapter concerns under `src/shared`, and routing/providers/composition
under `src/app`.

## Development and Verification

Run `pnpm --filter @skygraph/web dev` from the root after installing the locked workspace. Vite
reads browser-safe `VITE_` values from the root environment file. Use `pnpm build`, `pnpm test`,
`pnpm bundle:check`, and `pnpm test:e2e` for the production build, component tests, compressed
bundle budget, and browser checks. Install the browser once with
`pnpm exec playwright install chromium`.

## State Ownership

React Query owns HTTP response state. The app-scoped Zustand store owns only algorithm selection,
viewport, and temporary simulation-panel state. The normalized live store uses per-aircraft
subscriptions and immutable snapshots; it is not connected to a transport at this milestone. Map and
motion contracts remain behind shared adapters. Features do not import Leaflet or Framer Motion.

## UI and Accessibility

The Workspace route reports the actual empty feed state. Service status makes a bounded health
request and offers retry when unavailable. Navigation, status announcements, focus treatment,
responsive layouts, and reduced-motion behavior are specified in `SURFACE_BRIEF.md`. Source maps are
excluded from public output.

The implemented palette, typography, responsive layout, and component rules are recorded in
`DESIGN.md`, with panel metadata in `.impeccable/design.json`. Health failure wording covers both
unreachable and invalid API responses. Retry keeps the recovery context, announces progress, and
disables duplicate actions.

## Build Configuration

Development accepts local HTTP/WS endpoints. Production builds require explicit HTTPS/WSS endpoints
through `VITE_API_BASE_URL` and `VITE_WS_URL`; do not use the local development example for a
deployed build. These variables are public, compiled browser configuration, never secret storage.
Credentials, query strings, and fragments are rejected. API credentials belong only in the backend.

Browser tests intercept health requests with controlled responses and therefore verify client
behavior, not staging availability. Real cross-origin deployment and staging checks are separate
Task 05 gates.
