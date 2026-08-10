(function () {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;

  let registration = null;
  let lastUpdateCheck = 0;
  const updateInterval = 6 * 60 * 60 * 1000;

  async function registerPwa() {
    try {
      registration = await navigator.serviceWorker.register("./sw.js", {
        scope: "./",
        updateViaCache: "none"
      });
      lastUpdateCheck = Date.now();
    } catch (error) {
      console.warn("PWA registration skipped", error);
    }
  }

  async function checkForUpdate() {
    if (!registration || Date.now() - lastUpdateCheck < updateInterval) return;
    lastUpdateCheck = Date.now();
    try { await registration.update(); }
    catch (error) { console.warn("PWA update check skipped", error); }
  }

  window.addEventListener("load", registerPwa, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkForUpdate();
  });
})();
