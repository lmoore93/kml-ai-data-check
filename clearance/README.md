# Clearance

Flight authorisation for remote pilots — simpler than AVCRM / Fly Freely, focused on the core clearance loop.

**Remote Pilot** loads a mission → **Senior Remote Pilot** or **Chief Remote Pilot** signs off → fly with an audit trail → finalise the record.

## Quick start

```bash
cd clearance
npm install
npm run dev
```

Open the local URL Vite prints, then pick a demo role on the login screen.

## Demo roles

| Person | Role | What they do |
|--------|------|----------------|
| Alex Chen / Sam Rivera | Remote Pilot | Create & submit missions |
| Jordan Blake | Senior Remote Pilot | Approve / reject / finalise |
| Morgan Hale | Chief Remote Pilot | Approve / reject / finalise |

Data persists in the browser (`localStorage`). Use **Reset demo** on the missions page to restore seed data.

## Mission workflow

`Draft` → `Pending approval` → `Ready to fly` → `Completed` → `Finalised`

Rejected missions return to the remote pilot with a reason, then can be updated and resubmitted.

## Stack

- Vite + React + TypeScript
- React Router
- Client-side store (swap for API / D1 later without changing the workflow)

## Build

```bash
npm run build
npm run preview
```
