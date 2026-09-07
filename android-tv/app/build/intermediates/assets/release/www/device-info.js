// webOS build helper: basic device info + webapis presence
(function () {
  try {
    var info = {
      userAgent: navigator.userAgent,
      hasWebOS: typeof window.webOS !== 'undefined',
      hasWebapis: typeof window.webapis !== 'undefined'
    };
    window.__DEVICE_INFO__ = info;
  } catch (e) {}
})();
