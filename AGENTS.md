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

## Android app (Capacitor)
The PWA is wrapped as a native Android app with Capacitor. The web assets are bundled
**inside** the APK, so the installed app works fully offline.

- `android-app/` — Capacitor project (`capacitor.config.json`, `android/` Gradle project).
- `android-app/sync-web.sh` — copies the repo's web files into `android-app/www` (Capacitor's
  `webDir`). Excludes `public/downloads` and `og-image.png`/`favicon.png` to keep the APK lean.
- `android-app/build-apk.sh` — syncs web assets and builds the signed release APK.
- Output APK is copied to `downloads/AnyRenting-1.0.apk`, which `server.py` serves at
  `/downloads/AnyRenting-1.0.apk`.

### Building the APK
The sandbox has no Java/Android tooling. Everything runs inside an `apkbuilder` Docker
container (Node 22 + JDK 17 + Android SDK 34):

```bash
bash android-app/setup-builder.sh                              # once per sandbox (idempotent)
docker exec apkbuilder bash android-app/build-apk.sh           # sync web assets + build APK
cp android-app/android/app/build/outputs/apk/release/app-release.apk downloads/AnyRenting-1.0.apk
```

### Signing
Release builds are signed with `android-app/android/anyrenting-release.keystore`
(alias/store/key password `anyrenting`, wired up in `android/app/build.gradle`).
This is a **demo signing key** committed for reproducibility — replace it with a real,
privately-held keystore before publishing to Google Play. Keep the same key for future
updates, or Android will refuse to install over an existing copy.

## Notes
- The APK bundles its own copy of the web app. After changing `app.js` / `styles.css` /
  `index.html` / `manifest.webmanifest`, rebuild the APK to see the change in the Android app.
- The app is not published, so the only current download link is the preview URL
  (`/downloads/AnyRenting-1.0.apk`), which only lives as long as the sandbox. For a durable
  link, publish the app or upload the APK to GitHub Releases.
