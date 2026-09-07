# Android TV shell (POC)

Thin **leanback launcher** app that loads the same Expo web export as LG webOS.

## Setup

1. Run `npm run build:tv` from the project root (copies `dist/` into `app/src/main/assets/www/`).
2. Open this folder in **Android Studio**.
3. Let Gradle sync (Android Studio will create the Gradle wrapper if missing).
4. Create/start an **Android TV (1080p)** AVD.
5. Click **Run**.

## Notes

- Same app id as webOS: `com.smarttv.app`
- This is a POC WebView shell, not a native React Native Android TV port.
- For production, you can replace this shell with a native RN TV app while keeping the shared `src/` core.
