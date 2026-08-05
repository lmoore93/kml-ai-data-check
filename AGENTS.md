# kml-ai-data-check

Two independent front-end apps live in this repo:

- Root (`index.html`, `sw.js`, `manifest.json`) — **KML AI Data Check** PWA. A single self-contained static HTML file (Leaflet via CDN). No build step, no dependencies to install; just serve the repo root over HTTP.
- `clearance/` — **Clearance** flight-authorisation app. Vite + React 19 + TypeScript. This is the app with a real dev/lint/build workflow.

## Cursor Cloud specific instructions

### Clearance (`clearance/`)
- All npm scripts must run from the `clearance/` directory (that is where `package.json` lives). Standard scripts are defined there: `npm run dev`, `npm run lint` (oxlint), `npm run build` (`tsc -b && vite build`), `npm run preview`.
- `npm run lint` currently exits 0 but prints one pre-existing `react(only-export-components)` warning in `src/store/Store.tsx` — that warning is expected, not a failure.
- Dev server: `npm run dev`. Vite 8 binds to `localhost` only by default; pass `-- --host 0.0.0.0 --port 5173` when the browser/preview needs to reach it from outside the sandbox.
- App state is client-side only (browser `localStorage`, seeded from `src/data/seed.ts`). There is no backend/database. Use the **Reset demo** action on the missions page to restore seed data. Because state is per-browser, switching demo users is done inside the app (log out / log in), not via separate accounts.
- Demo roles for testing the workflow: Alex Chen / Sam Rivera (Remote Pilot, create + submit), Jordan Blake (Senior RP) and Morgan Hale (Chief RP, approve/reject/finalise). Workflow: `Draft → Pending approval → Ready to fly → Completed → Finalised`.

### Root KML PWA
- No build. Serve the repo root with any static server (e.g. `python3 -m http.server 8000`) and open `/index.html`. A service worker (`sw.js`) caches same-origin assets; third-party API calls (Overpass, Open-Meteo) go out to the network at runtime.
