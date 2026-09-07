#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APK="$ROOT/android-tv/app/build/outputs/apk/debug/app-debug.apk"
export PATH="$HOME/Android/Sdk/platform-tools:$PATH"

if [ ! -f "$APK" ]; then
  echo "APK not found. Run: npm run build:android-apk"
  exit 1
fi

echo "=== Google TV / Android TV install helper ==="
echo ""
echo "APK: $APK"
echo ""

adb kill-server 2>/dev/null || true
adb start-server

echo "Connected devices:"
adb devices -l
echo ""

if [ -n "${TV_IP:-}" ]; then
  PORT="${TV_PORT:-5555}"
  echo "Connecting to ${TV_IP}:${PORT} ..."
  adb connect "${TV_IP}:${PORT}"
  adb devices -l
fi

if adb devices | awk 'NR>1 && $2=="device" {found=1} END{exit !found}'; then
  echo ""
  echo "Installing APK ..."
  adb install -r "$APK"
  echo ""
  echo "Launching app ..."
  adb shell monkey -p com.smarttv.app -c android.intent.category.LEANBACK_LAUNCHER 1 2>/dev/null \
    || adb shell am start -n com.smarttv.app/.MainActivity
  echo ""
  echo "Done. On TV: Home -> Apps -> Smart TV App"
else
  echo "No device connected."
  echo ""
  echo "Option A — Wireless debugging (Google TV):"
  echo "  TV: Developer options -> Wireless debugging -> Pair device with pairing code"
  echo "  Laptop:"
  echo "    adb pair TV_IP:PAIRING_PORT"
  echo "    adb connect TV_IP:DEBUG_PORT"
  echo "    TV_IP=$TV_IP TV_PORT=DEBUG_PORT bash $0"
  echo ""
  echo "Option B — Sideload without adb (Downloader app on TV):"
  LAN_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
  echo "  On laptop:"
  echo "    cd \"$(dirname "$APK")\" && python3 -m http.server 8888"
  echo "  On TV (Downloader app):"
  echo "    http://${LAN_IP:-YOUR_LAPTOP_IP}:8888/app-debug.apk"
fi
