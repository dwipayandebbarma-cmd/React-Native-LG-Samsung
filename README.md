# Smart TV App — Multi-Platform OTT POC

A proof-of-concept OTT (over-the-top) streaming application built with **one React Native codebase** that targets **LG webOS**, **Samsung Tizen**, and **Android TV / Google TV**.

The goal is to validate that shared UI, D-pad navigation, and video playback can ship to multiple TV ecosystems from a single export, with thin platform-specific packaging at the edges.

---

## Goals

| Goal | Status (POC) |
|------|----------------|
| Single React Native codebase for TV UIs | Done |
| D-pad / remote focus navigation | Done (Norigin) |
| Home screen with side nav, hero banner, content rails | Done |
| Video playback (MP4 + HLS) | Done (Shaka + HTML5) |
| LG webOS package (`.ipk`) | Done |
| Samsung Tizen package (`.wgt`) | Done |
| Android TV installable APK | Done (leanback WebView shell) |
| Production ExoPlayer on Android | Planned (not in POC) |
| DRM (Widevine, etc.) | Planned (not in POC) |

---

## Architecture

```text
src/ (React Native + Expo)
        │
        ▼
  expo export --platform web
        │
        ▼
      dist/          ← single web TV bundle
   ┌────┴────┬──────────────┐
   ▼         ▼              ▼
 LG .ipk   Samsung .wgt   Android APK
(webOS)    (Tizen)        (leanback WebView)
```

**Shared (~80–90%):** screens, components, navigation, focus keys, mock data, styling.

**Platform-specific:** packaging scripts, webOS back handling, Tizen `config.xml`, Android Gradle shell.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo 48, React Native 0.71, React Native Web |
| Navigation | React Navigation 6 (native stack) |
| TV focus / D-pad | [@noriginmedia/norigin-spatial-navigation](https://github.com/noriginmedia/norigin-spatial-navigation) |
| Video (POC) | HTML5 `<video>` + [Shaka Player](https://github.com/shaka-project/shaka-player) (HLS) |
| Lists / rails | `ScrollView` + `.map()` (not FlatList in POC) |
| LG packaging | webOS CLI (`ares-package`, `ares-launch`) |
| Samsung packaging | Tizen Studio (`tizen package`, `tizen install`) |
| Android packaging | Gradle leanback WebView app (`android-tv/`) |

---

## Features Implemented

### Home experience
- Left **side navigation** with focus states
- **Hero banner** that updates when a rail card is focused
- Multiple **horizontal content rails** (portrait and landscape cards)
- Vertical paging between rail sections
- Pagination dots for scroll position

### Navigation & focus
- Norigin spatial navigation initialized once in `App.js`
- Unique `focusKey` per focusable element (side nav, cards, banner CTA)
- `FocusContext` for nested focus regions
- Initial focus on first home card at launch

### Player
- `PlayerScreen` with HTML5 video element
- Source fallback chain: MP4 → HLS (via Shaka)
- Play/pause, seek, buffering overlay, error display
- Remote: Enter (play/pause), Left/Right (seek), Back (navigate home)

### Platform glue
- **webOS:** `disableBackHistoryAPI`, capture-phase Back handler
- **Tizen:** standard web app packaging
- **Android TV:** WebView loads bundled `assets/www` from same `dist/`

---

## Project Structure

```text
App.js                          # Entry: focus init, navigation, TV back handler
src/
  navigation/AppNavigator.js    # Home ↔ Player stack
  screens/
    HomeScreen.js               # Main OTT home layout
    PlayerScreen.js             # Video playback
  components/
    sidenav/                    # Side navigation
    rail/                       # Rails + ContentCard
    banner/                     # Hero banner
    pagination/                 # Scroll indicators
  spatial/initSpatialNavigation.js
  platform/registerWebTvBackHandler.js
  player/loadShaka.js
  data/homeMocks.js, media.json
scripts/
  webos/                        # LG dist prep, simulator wrapper
  tizen/                        # Samsung bundle sync
  android-tv/                   # Asset sync, APK build, install helpers
  demo/                         # LG emulator, browser server
android-tv/                     # Leanback WebView APK project
dist/                           # Web export output (generated)
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Expo / Metro** (installed via `npm install`)
- **LG webOS TV SDK** — for simulator and `.ipk` (`ares-*` CLI)
- **Tizen Studio** — for Samsung `.wgt` (separate RNPOC project path for sync)
- **Android SDK + JDK 17** — for `android-tv` APK builds
- **adb** (optional) — for Android TV install over network

---

## Getting Started

```bash
cd "/path/to/React Native"
npm install
```

### Local web development

```bash
npm run start:dev
```

Opens Expo web dev server for browser testing with hot reload.

---

## Build & Run

### Build all TV targets (web bundle + asset sync)

```bash
npm run build:tv
```

Produces `dist/` and syncs into `android-tv/app/src/main/assets/www`.

### LG webOS

**Simulator (hosted mode):**

```bash
npm run demo:lg:simulator
```

**Emulator / device (install IPK):**

```bash
npm run build:tv
npm run lg                  # package .ipk
npm run demo:lg             # install + launch on WEBOS_DEVICE
```

Set `WEBOS_SIMULATOR_PATH` if your simulator is not at the default path.

### Samsung Tizen

Sync bundle into Tizen project and package (adjust `TIZEN_SYNC_TARGET` in `package.json` if needed):

```bash
npm run build:tizen:sync
```

Then in your Tizen project:

```bash
tizen package -t wgt -s <CERT_PROFILE> -- .
tizen install -n RNPOC.wgt -t <DEVICE_ID>
tizen run -p rtCj0RJh5j.RNPOC -t <DEVICE_ID>
```

Sideloaded apps may appear under **Apps**, not the main home row.

### Android TV / Google TV

**Build APK:**

```bash
npm run build:android-apk
```

Output: `android-tv/app/build/outputs/apk/debug/app-debug.apk`

**Install via adb** (if wireless debugging is available):

```bash
adb connect <TV_IP>:<PORT>
adb install -r android-tv/app/build/outputs/apk/debug/app-debug.apk
```

**Sideload without adb** (Google TV with USB debugging only):

1. On laptop: `cd android-tv/app/build/outputs/apk/debug && python3 -m http.server 8888`
2. On TV: install **Downloader** (AFTVnews), open `http://<LAPTOP_IP>:8888/app-debug.apk`
3. Open **Smart TV App** under Apps

### Browser demo (Android TV equivalent)

```bash
npm run demo:browser
```

Open http://localhost:8080 — use F11 fullscreen and DevTools 1920×1080; arrow keys act as D-pad.

---

## npm Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run build:tv` | Web export + LG prep + Android asset sync |
| `npm run build:tizen:sync` | Export + sync to Samsung Tizen project |
| `npm run build:android-apk` | Full build + Gradle debug APK |
| `npm run demo:lg:simulator` | Launch on LG webOS TV Simulator |
| `npm run demo:lg` | Install and launch on webOS emulator/device |
| `npm run demo:browser` | Serve `dist/` on port 8080 |
| `npm run demo:android-tv` | Build + `gradlew installDebug` |

---

## POC vs Production

| Area | POC (today) | Production (target) |
|------|-------------|---------------------|
| UI / navigation | Shared RN codebase | Same |
| LG / Samsung player | Shaka + HTML5 | Shaka or platform SDK |
| Android player | WebView + Shaka | **ExoPlayer / Media3** |
| DRM | Non-DRM sample streams | Widevine, platform DRM |
| Content rails | `ScrollView` + mock data | FlatList + API/CDN |
| Store certification | Not in scope | Per-platform submission |

---

## Known Limitations

- Android POC uses a **WebView shell**, not native ExoPlayer
- Sample images/videos load from external HTTPS URLs (not fully bundled)
- No DRM, analytics, or offline mode
- Rail lists are not virtualized (fine for demo data, not large catalogs)
- `PlayerScreen` is implemented for `Platform.OS === 'web'` only
- Android emulator may require KVM; browser demo or APK sideload are fallbacks

---

## Artifacts

| Platform | Output | App ID |
|----------|--------|--------|
| LG webOS | `com.smarttv.app_1.0.0_all.ipk` | `com.smarttv.app` |
| Samsung Tizen | `RNPOC.wgt` | `rtCj0RJh5j.RNPOC` |
| Android TV | `app-debug.apk` | `com.smarttv.app` |

---

## License

Private / internal POC — not for public distribution.
