import assert from "node:assert/strict";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const prefix = "/liu-fu-love/";
const isAndroid = process.env.PWA_DEVICE === "android";
const browserPath = process.env.PWA_BROWSER_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

const authMock = `
window.__authCalls = [];
window.supabase = { createClient() { return {
  auth: {
    onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
    async setSession(value) { window.__authCalls.push(['setSession', value]); return { error: null }; },
    async getSession() { return { data: { session: null }, error: null }; },
    async signInWithPassword(value) { window.__authCalls.push(['signInWithPassword', value]); return { data: {}, error: null }; },
    async signInWithOtp(value) { window.__authCalls.push(['signInWithOtp', value]); return { data: {}, error: null }; },
    async updateUser(value) { window.__authCalls.push(['updateUser', value]); return { data: {}, error: null }; },
    async signOut(value) { window.__authCalls.push(['signOut', value]); return { error: null }; }
  }
}; } };
`;

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://127.0.0.1");
    if (!url.pathname.startsWith(prefix)) throw new Error("outside scope");
    const relative = url.pathname.slice(prefix.length) || "index.html";
    if (relative === "assets/vendor/supabase.min.js") {
      response.writeHead(200, { "content-type": types[".js"], "cache-control": "no-store" });
      response.end(authMock);
      return;
    }
    if (relative === "supabase-config.js") {
      response.writeHead(200, { "content-type": types[".js"], "cache-control": "no-store" });
      response.end("window.LOVE_SYNC_CONFIG={url:'https://example.supabase.co',publishableKey:'test'};");
      return;
    }
    const body = await readFile(join(root, relative));
    response.writeHead(200, { "content-type": types[extname(relative)] || "application/octet-stream", "cache-control": "no-store" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end();
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await chromium.launch({
  headless: true,
  executablePath: browserPath
});

try {
  const context = await browser.newContext({
    viewport: isAndroid ? { width: 412, height: 915 } : { width: 390, height: 844 },
    userAgent: isAndroid
      ? "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/136.0.0.0 Mobile Safari/537.36"
      : "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 Version/18.4 Mobile/15E148 Safari/604.1"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.addInitScript(() => {
    window.__longTasks = [];
    if ("PerformanceObserver" in window) {
      try {
        new PerformanceObserver((list) => window.__longTasks.push(...list.getEntries().map((item) => item.duration)))
          .observe({ type: "longtask", buffered: true });
      } catch { }
    }
  });

  await page.goto(`http://127.0.0.1:${port}${prefix}`, { waitUntil: "networkidle" });
  const registration = await page.evaluate(async () => {
    const ready = await navigator.serviceWorker.ready;
    return { scope: ready.scope, scriptURL: ready.active?.scriptURL || "", caches: await caches.keys() };
  });
  assert.match(registration.scope, /\/liu-fu-love\/$/);
  assert.match(registration.scriptURL, /\/liu-fu-love\/sw\.js$/);
  assert.equal(registration.caches.some((name) => name.startsWith("liu-fu-love-pwa-")), false);

  const cdp = await context.newCDPSession(page);
  await cdp.send("Page.enable");
  const manifest = await cdp.send("Page.getAppManifest");
  assert.equal(manifest.errors.length, 0, JSON.stringify(manifest.errors));
  const installability = await cdp.send("Page.getInstallabilityErrors");
  const realInstallabilityErrors = installability.installabilityErrors
    .filter(({ errorId }) => errorId !== "in-incognito");
  assert.equal(realInstallabilityErrors.length, 0, JSON.stringify(realInstallabilityErrors));

  await page.locator('[data-tab="me"]').click();
  await page.locator("#syncPasswordEmail").fill("fu@example.com");
  await page.locator("#syncPassword").fill("safe-password-123");
  await page.locator("#syncPasswordForm button[type=submit]").click();
  await page.waitForFunction(() => window.__authCalls.some(([name]) => name === "signInWithPassword"));

  await page.evaluate(() => {
    document.querySelector("#syncSignedOut").hidden = true;
    document.querySelector("#syncConnected").hidden = false;
  });
  await page.locator(".password-settings summary").click();
  await page.locator("#syncNewPassword").fill("another-safe-password-456");
  await page.locator("#syncConfirmPassword").fill("another-safe-password-456");
  await page.locator("#syncSetPasswordForm button[type=submit]").click();
  await page.waitForFunction(() => window.__authCalls.some(([name]) => name === "updateUser"));
  await page.locator("#syncSignOut").click();
  await page.waitForFunction(() => window.__authCalls.some(([name]) => name === "signOut"));

  const authCalls = await page.evaluate(() => window.__authCalls);
  assert.deepEqual(authCalls.find(([name]) => name === "signInWithPassword")[1], { email: "fu@example.com", password: "safe-password-123" });
  assert.deepEqual(authCalls.find(([name]) => name === "updateUser")[1], { password: "another-safe-password-456" });
  assert.deepEqual(authCalls.find(([name]) => name === "signOut")[1], { scope: "local" });

  await page.locator('[data-tab="home"]').click();
  await page.locator("#messageText").fill("PWA 普通链接提交测试");
  await page.locator("#messageForm button[type=submit]").click();
  await page.locator("#messageList").getByText("PWA 普通链接提交测试", { exact: true }).first().waitFor();

  await page.reload({ waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    return {
      duration: Math.round(navigation.duration),
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd),
      longTasks: window.__longTasks || [],
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      caches: []
    };
  });
  metrics.caches = await page.evaluate(() => caches.keys());
  assert.ok(metrics.duration < 5000, JSON.stringify(metrics));
  assert.ok(metrics.domContentLoaded < 3000, JSON.stringify(metrics));
  assert.ok(metrics.overflow <= 1, JSON.stringify(metrics));
  assert.equal(metrics.caches.some((name) => name.startsWith("liu-fu-love-pwa-")), false);
  assert.equal(consoleErrors.length, 0, JSON.stringify(consoleErrors));

  await page.locator('[data-tab="me"]').click();
  await page.screenshot({ path: `pwa-${isAndroid ? "android" : "iphone"}-test.png`, fullPage: true });
  console.log(JSON.stringify({ device: isAndroid ? "android" : "iphone", registration, metrics, authCalls: authCalls.map(([name]) => name) }));
} finally {
  await browser.close();
  server.close();
}
