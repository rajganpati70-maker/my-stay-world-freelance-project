#!/usr/bin/env bash
# Creates the `apkbuilder` Docker container with JDK 17 + Android SDK
# (platform 34, build-tools 34.0.0). Required to build the Android APK from the
# Base44 sandbox, which has no Java/Android tooling of its own. Idempotent.
set -euo pipefail
cd "$(dirname "$0")/.."

if docker ps -a --format '{{.Names}}' | grep -qx apkbuilder; then
  docker start apkbuilder >/dev/null 2>&1 || true
  echo "apkbuilder container already exists"
  exit 0
fi

docker run -d --name apkbuilder -v "$(pwd)":/work -w /work node:22 sleep infinity

docker exec apkbuilder bash -c '
  set -e
  apt-get update -qq
  apt-get install -y -qq openjdk-17-jdk-headless unzip wget imagemagick >/dev/null 2>&1

  export ANDROID_HOME=/opt/android-sdk
  mkdir -p $ANDROID_HOME/cmdline-tools
  cd /tmp
  wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline.zip
  unzip -q cmdline.zip -d $ANDROID_HOME/cmdline-tools
  mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest

  export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
  yes | sdkmanager --licenses >/dev/null 2>&1 || true
  sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" >/dev/null
'

echo "apkbuilder ready — build with: docker exec apkbuilder bash android-app/build-apk.sh"
