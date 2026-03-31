## Hosted PWA deploy (Option 1)

This folder is a **static** web app. KML/KMZ stays in the user’s browser (client-side processing).

### What still goes “out”

Even though you do not upload the KML to your server, the app calls third-party services:

- **Overpass API (OSM)**: requests are based on ring bounding boxes (coordinates leave the PC).
- **Open‑Meteo elevation**: elevation query includes sampled coordinates.

If that’s not acceptable for a customer, you need Option 2 (local companion agent or offline datasets).

### Gemini API key

This app supports a **user-supplied Gemini API key** (Option 1A). The key is never shipped with the app.

- If the user chooses “Remember key”, it is stored in the browser’s **localStorage** on that device.
- The app sends **derived metrics/facts** to Gemini to generate the narrative (not the raw KML file).

### Deploy to Cloudflare Pages (simple)

1. Create a Git repo for your project (or just this folder).
2. In Cloudflare Pages:
   - Framework preset: **None**
   - Build command: (empty)
   - Output directory: `hosted-pwa`
3. Deploy.

### Deploy to Netlify / Vercel

- Publish directory: `hosted-pwa`
- No build step required.

### Updates

Ship updates by deploying a new version. Users get updates on refresh.

### PWA install

Once served over HTTPS, users can install it from Chrome/Edge (Install icon).

