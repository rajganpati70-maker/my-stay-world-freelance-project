#!/usr/bin/env bash
# Copies the PWA source from the repo root into the Capacitor webDir (www/).
# Run this before every `cap sync` so the APK always packages the latest app.
set -euo pipefail
cd "$(dirname "$0")"

rm -rf www
mkdir -p www
cp ../index.html ../styles.css ../app.js ../manifest.webmanifest ../sw.js www/
cp -r ../public www/public

# Keep the APK lean: drop assets that are only needed for web / social sharing.
rm -rf www/public/downloads
rm -f www/public/assets/og-image.png www/public/assets/favicon.png

echo "Web assets copied into android-app/www"
