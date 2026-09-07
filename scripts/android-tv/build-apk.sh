#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ANDROID_TV="$ROOT/android-tv"

if [ -z "${JAVA_HOME:-}" ]; then
  for candidate in \
    "$HOME/.jdks/jbr-17.0.14" \
    "$HOME/Android/Sdk/jbr" \
    /usr/lib/jvm/java-17-openjdk-amd64 \
    /usr/lib/jvm/java-17-openjdk; do
    if [ -x "$candidate/bin/java" ]; then
      export JAVA_HOME="$candidate"
      break
    fi
  done
fi

if [ -z "${JAVA_HOME:-}" ] || [ ! -x "$JAVA_HOME/bin/java" ]; then
  echo "JAVA_HOME is not set. Install JDK 17 or set JAVA_HOME, then retry."
  exit 1
fi

export PATH="$JAVA_HOME/bin:$PATH"

cd "$ROOT"
npm run build:tv

cd "$ANDROID_TV"
chmod +x gradlew
./gradlew assembleDebug

APK="$ANDROID_TV/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "Android TV APK ready:"
echo "  $APK"
echo ""
echo "Install on a connected device/emulator:"
echo "  adb install -r \"$APK\""
