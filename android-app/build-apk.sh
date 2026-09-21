#!/usr/bin/env bash
# Builds the signed release APK for the AnyRenting Android app.
#
# Requires: Node 18+, JDK 17, Android SDK (platform 34 + build-tools 34.0.0).
# In the Base44 sandbox these live in the `apkbuilder` Docker container; see AGENTS.md.
#
# Output: android/app/build/outputs/apk/release/app-release.apk
set -euo pipefail
cd "$(dirname "$0")"

./sync-web.sh
npm install --no-audit --no-fund
npx cap sync android

cd android
./gradlew assembleRelease

echo ""
echo "APK ready: $(pwd)/app/build/outputs/apk/release/app-release.apk"
