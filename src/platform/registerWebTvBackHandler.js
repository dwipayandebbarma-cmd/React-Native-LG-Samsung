const BACK_KEY_CODES = new Set([8, 27, 461, 10009]);
const BACK_KEYS = new Set(['Escape', 'Backspace', 'BrowserBack', 'GoBack', 'XF86Back']);

export function isTvBackKey(event) {
  if (!event) return false;
  if (BACK_KEYS.has(event.key)) return true;
  return BACK_KEY_CODES.has(event.keyCode);
}

/**
 * webOS TV intercepts Back before bubble handlers on window.
 * Use capture phase + disableBackHistoryAPI in appinfo.json.
 */
export function registerWebTvBackHandler(getNavigation) {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const handleBack = (event) => {
    if (!isTvBackKey(event)) {
      return;
    }

    const nav = getNavigation?.();
    if (nav?.canGoBack?.()) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
      }
      nav.goBack();
      return;
    }

    // Entry screen: use webOS exit dialog when available.
    if (typeof window !== 'undefined' && typeof window.webOS?.platformBack === 'function') {
      event.preventDefault();
      event.stopPropagation();
      window.webOS.platformBack();
    }
  };

  document.addEventListener('keydown', handleBack, true);
  document.addEventListener('keyup', handleBack, true);

  return () => {
    document.removeEventListener('keydown', handleBack, true);
    document.removeEventListener('keyup', handleBack, true);
  };
}
