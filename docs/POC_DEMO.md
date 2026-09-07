# OTT TV POC — Demo Guide (LG + Android TV)

Presentation story: **one React Native codebase** → **one web TV bundle** → runs on **LG webOS** and **Android TV** from the same export.

## Architecture (POC)

```text
Expo React Native app (src/)
        │
        ▼
  npm run build:tv
  (expo export web + webOS fixes + asset sync)
        │
        ▼
      dist/
   ┌────┴────┐
   ▼         ▼
 LG .ipk   Android TV APK
(webOS)    (leanback WebView shell)
```

Shared on both platforms in this POC:

- Home UI, rails, side nav
- D-pad focus (`@noriginmedia/norigin-spatial-navigation`)
- Video playback (Shaka Player)

---

## Tonight — checklist

### LG webOS emulator

1. Start **webOS TV Simulator** (from LG webOS TV SDK).
2. Confirm device is listed:
   ```bash
   ares-setup-device --list
   ```
   You should see `emulator` at `developer@127.0.0.1:6622`.
3. Build and run:
   ```bash
   npm run build:tv
   npm run demo:lg
   ```

**Alternative (simulator hosted mode, no IPK install):**

```bash
npm run build:tv
npm run demo:lg:simulator
```

### Android TV emulator

1. Install **Android Studio** (if not installed).
2. Create a **TV AVD**: Device Manager → TV → **Android TV (1080p)** → API 33+.
3. Start the TV emulator.
4. Set SDK env (add to `~/.bashrc` if needed):
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
   ```
5. Build web bundle + sync into Android shell:
   ```bash
   npm run build:tv
   ```
6. Open **`android-tv/`** in Android Studio → **Run** on the TV AVD.

   Or from terminal (after SDK is configured):
   ```bash
   npm run demo:android-tv
   ```

---

## Presentation demo script (5–7 min)

1. **Show codebase** — `App.js`, `HomeScreen.js`, `PlayerScreen.js` (single RN app).
2. **Show build command** — `npm run build:tv` produces one `dist/` bundle.
3. **LG demo** — launch on webOS emulator; browse rails with remote/D-pad; play a title.
4. **Android TV demo** — same UI from the WebView shell; browse and play again.
5. **Closing line** — “Same bundle, two TV platforms; production can add Tizen packaging and native Android player later.”

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED 127.0.0.1:6622` | Start webOS TV Simulator first |
| App not on Android TV home | Reinstall APK; confirm leanback launcher in manifest |
| Blank WebView on Android TV | Run `npm run build:tv` again to refresh `assets/www` |
| Video won't play | Use HTTPS streams; samples in `media.json` are already HTTPS-normalized |
| `adb` not found | Install Android Studio platform-tools; set `ANDROID_HOME` |

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run build:tv` | Web export + webOS prep + Android asset sync |
| `npm run demo:lg` | Package, install, launch on webOS `emulator` |
| `npm run demo:lg:simulator` | Hosted launch on webOS TV Simulator |
| `npm run demo:android-tv` | Sync assets + `gradlew installDebug` |

Optional env vars:

- `WEBOS_DEVICE=emulator` (default) or another name from `ares-setup-device --list`
- `WEBOS_TV_VERSION=6.0` for simulator hosted mode
