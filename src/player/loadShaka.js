/**
 * Lazy Shaka Player bootstrap for web / Smart TV builds.
 * Use from a dedicated player screen when you add playback.
 */
export async function loadShakaPlayer() {
  if (typeof window === 'undefined') {
    return null;
  }
  const mod = await import('shaka-player/dist/shaka-player.compiled.js');
  const shaka = mod.default || mod;
  if (shaka.polyfill && shaka.polyfill.installAll) {
    shaka.polyfill.installAll();
  }
  return shaka;
}
