# AnyRenting PWA — Base44 Dev Notes

## Stack
- Dependency-free static PWA (vanilla JS: `app.js`, `styles.css`, `index.html`).
- Served by Python's built-in `http.server` via `server.py` (listens on port 5000).
- No build step, no npm, no external services, no credentials required.
- All data is client-side (localStorage) — this is a demo MVP.

## Running
- `docker compose -f docker-compose.base44.yml up -d` — serves on host port 3000 (maps to container 5000).
- Python's `SimpleHTTPRequestHandler` has no file watcher / live reload. After editing frontend files, call `reload_preview` so the user sees changes.

## Verifying
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → expect 200.
- `/app.js`, `/styles.css`, `/manifest.webmanifest`, `/sw.js` should all return 200.
