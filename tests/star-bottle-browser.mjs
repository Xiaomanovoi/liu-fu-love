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

const syncMock = String.raw`
(function () {
  const role = "liu";
  let openedToday = false;
  let serial = 10;
  let pending = [
    { id: "incoming-1", sender_role: "fu", recipient_role: "liu", content: "今天也有认真想你。", created_at: "2026-08-14T02:20:00Z", updated_at: "2026-08-14T02:20:00Z" },
    { id: "incoming-2", sender_role: "fu", recipient_role: "liu", content: "下次见面要抱久一点。", created_at: "2026-08-13T08:20:00Z", updated_at: "2026-08-13T08:20:00Z" }
  ];
  let history = Array.from({ length: 7 }, (_, index) => ({
    id: "history-" + (index + 1),
    sender_role: index % 2 ? "liu" : "fu",
    recipient_role: index % 2 ? "fu" : "liu",
    content: "旧星光" + (index + 1),
    created_at: "2026-08-" + String(12 - index).padStart(2, "0") + "T08:00:00Z",
    updated_at: "2026-08-" + String(12 - index).padStart(2, "0") + "T08:00:00Z",
    opened_at: "2026-08-" + String(12 - index).padStart(2, "0") + "T09:00:00Z",
    can_delete: false
  }));
  const savedTokens = new Map();
  window.__starCalls = { summary: 0, snapshot: 0, create: 0 };
  window.__starCreateDelayMs = 0;
  window.__starSnapshotDelayMs = 0;
  const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
  function snapshot(options = {}) {
    const filter = options.historyRecipient || null;
    const ownPending = pending.filter((note) => note.sender_role === role);
    const visibleHistory = history.filter((note) => !filter || note.recipient_role === filter);
    return {
      role,
      counts: {
        liu: pending.filter((note) => note.recipient_role === "liu").length,
        fu: pending.filter((note) => note.recipient_role === "fu").length
      },
      opened_today: openedToday,
      pending: ownPending.slice(0, options.pendingLimit || 5),
      pending_total: ownPending.length,
      history: visibleHistory.slice(0, options.historyLimit || 5),
      history_total: visibleHistory.length,
      history_recipient: filter
    };
  }
  function summary() {
    const value = snapshot();
    delete value.pending;
    delete value.history;
    delete value.history_recipient;
    return value;
  }
  async function refreshStarBottleSummary() {
    window.__starCalls.summary += 1;
    const value = summary();
    emit("love-star-bottle-summary", value);
    return value;
  }
  async function refreshStarBottle(options = {}) {
    window.__starCalls.snapshot += 1;
    const value = snapshot(options);
    if (window.__starSnapshotDelayMs) await new Promise((resolve) => setTimeout(resolve, window.__starSnapshotDelayMs));
    emit("love-star-bottle-snapshot", value);
    return value;
  }
  window.LoveSync = {
    async initialize() {
      setTimeout(() => {
        emit("love-sync-status", { connected: true, authenticated: true, role });
        refreshStarBottleSummary();
      }, 0);
    },
    isConnected: () => true,
    isAuthenticated: () => true,
    isReady: () => true,
    getRole: () => role,
    scheduleSave() {},
    async flushSave() {},
    refreshStarBottleSummary,
    refreshStarBottle,
    async createStarNote(content, token) {
      window.__starCalls.create += 1;
      if (window.__starCreateDelayMs) await new Promise((resolve) => setTimeout(resolve, window.__starCreateDelayMs));
      if (token && savedTokens.has(token)) {
        const existing = savedTokens.get(token);
        existing.note.content = content;
        existing.note.updated_at = new Date().toISOString();
        return existing;
      }
      const note = { id: "note-" + (++serial), client_token: token, sender_role: role, recipient_role: "fu", content, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      pending.unshift(note);
      const result = { note, counts: snapshot().counts };
      if (token) savedTokens.set(token, result);
      return result;
    },
    async deleteStarNoteByToken(token) {
      const existing = savedTokens.get(token);
      if (existing) pending = pending.filter((item) => item.id !== existing.note.id);
      savedTokens.delete(token);
      return { deleted: Boolean(existing), id: existing?.note?.id || null };
    },
    async updateStarNote(id, content) {
      const note = pending.find((item) => item.id === id);
      if (!note) throw new Error("not found");
      note.content = content;
      note.updated_at = new Date().toISOString();
      return note;
    },
    async deleteStarNote(id) {
      pending = pending.filter((item) => item.id !== id);
      history = history.filter((item) => item.id !== id);
      return { id };
    },
    async openStarNote() {
      const index = pending.findIndex((note) => note.recipient_role === role);
      if (index < 0 || openedToday) throw new Error("cannot open");
      const [note] = pending.splice(index, 1);
      note.opened_at = new Date().toISOString();
      note.can_delete = false;
      history.unshift(note);
      openedToday = true;
      return { note };
    }
  };
}());
`;

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://127.0.0.1");
    if (!url.pathname.startsWith(prefix)) throw new Error("outside scope");
    const relative = url.pathname.slice(prefix.length) || "index.html";
    if (relative.startsWith("sync.js")) {
      response.writeHead(200, { "content-type": types[".js"], "cache-control": "no-store" });
      response.end(syncMock);
      return;
    }
    if (relative.startsWith("assets/vendor/supabase.min.js") || relative.startsWith("supabase-config.js")) {
      response.writeHead(200, { "content-type": types[".js"], "cache-control": "no-store" });
      response.end("");
      return;
    }
    const clean = relative.split("?")[0];
    const body = await readFile(join(root, clean));
    response.writeHead(200, { "content-type": types[extname(clean)] || "application/octet-stream", "cache-control": "no-store" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end();
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await chromium.launch({ headless: true, executablePath: browserPath });

try {
  const context = await browser.newContext({
    viewport: isAndroid ? { width: 412, height: 915 } : { width: 390, height: 844 },
    userAgent: isAndroid
      ? "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/136.0.0.0 Mobile Safari/537.36"
      : "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 Version/18.4 Mobile/15E148 Safari/604.1",
    serviceWorkers: "block"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__starLongTasks = [];
    try {
      new PerformanceObserver((list) => window.__starLongTasks.push(...list.getEntries().map((item) => item.duration)))
        .observe({ type: "longtask", buffered: true });
    } catch { }
  });

  await page.goto(`http://127.0.0.1:${port}${prefix}`, { waitUntil: "load" });
  await page.locator('[data-tab="together"]').click();
  await page.locator("#openStarBottle").click();
  await page.locator("#starBottle.is-active").waitFor();
  await page.waitForFunction(() => document.querySelector("#starBottleCount")?.textContent === "2");
  assert.equal((await page.evaluate(() => window.__starCalls)).snapshot, 0, "collapsed lists should not load on entry");

  assert.equal(await page.locator("#starBottleCompose").isHidden(), true);
  assert.equal(await page.locator("#starBottleOpen").isVisible(), true);
  const canvas = await page.locator("#starBottleCanvas").evaluate((element) => {
    const data = element.getContext("2d").getImageData(0, 0, element.width, element.height).data;
    let painted = 0;
    for (let index = 3; index < data.length; index += 4) if (data[index] > 10) painted += 1;
    return painted;
  });
  assert.ok(canvas > 30000, `bottle canvas is too sparse: ${canvas}`);
  await page.evaluate(() => { window.__starLongTasks = []; });

  await page.locator('[data-star-recipient="fu"]').click();
  assert.equal(await page.locator("#starBottleCompose").isVisible(), true);
  await page.locator("#starBottleText").fill("晚一点打开，也会知道我此刻在想你。");
  const summaryCallsBeforeTypingRefresh = (await page.evaluate(() => window.__starCalls)).summary;
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("love-star-bottle-changed")));
  await page.waitForTimeout(650);
  assert.equal((await page.evaluate(() => window.__starCalls)).summary, summaryCallsBeforeTypingRefresh, "typing should defer remote refresh");
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("love-sync-status", {
    detail: { connected: true, authenticated: true, role: "liu" }
  })));
  assert.equal(await page.locator("#starBottleCompose").isVisible(), true);
  assert.equal(await page.locator("#starBottleText").inputValue(), "晚一点打开，也会知道我此刻在想你。");
  await page.evaluate(() => { window.__starCreateDelayMs = 900; });
  const optimisticStart = Date.now();
  await page.locator("#starBottleForm button[type=submit]").click();
  await page.waitForFunction(() => document.querySelector("#starBottleCount")?.textContent === "1");
  const optimisticLatency = Date.now() - optimisticStart;
  assert.ok(optimisticLatency < 500, `optimistic star feedback was too slow: ${optimisticLatency}ms`);
  assert.equal(await page.locator("#starBottleText").inputValue(), "");

  await page.locator("#starBottlePending summary").click();
  await page.waitForFunction(() => window.__starCalls.snapshot === 1);
  await page.getByText("晚一点打开，也会知道我此刻在想你。", { exact: true }).waitFor();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("love-star-bottle-outbox-v2") || "[]").length === 0);
  await page.evaluate(() => { window.__starCreateDelayMs = 0; });
  await page.locator('[data-star-action="edit"]').first().click();
  await page.locator("#starBottleEditText").fill("晚一点打开，也会知道我一直在想你。");
  await page.locator("#starBottleEditForm button[type=submit]").click();
  await page.getByText("晚一点打开，也会知道我一直在想你。", { exact: true }).waitFor();

  await page.evaluate(() => {
    const original = window.LoveSync.createStarNote;
    let simulateLostResponse = true;
    window.__restoreStarCreate = () => { window.LoveSync.createStarNote = original; };
    window.LoveSync.createStarNote = async (...args) => {
      const result = await original(...args);
      if (simulateLostResponse) {
        simulateLostResponse = false;
        throw new Error("simulated response timeout");
      }
      return result;
    };
  });
  await page.locator("#starBottleText").fill("网络慢的时候也不能重复出现。");
  await page.locator("#starBottleForm button[type=submit]").click();
  await page.getByText("等待网络自动送达", { exact: true }).waitFor();
  assert.equal(await page.locator("#starBottleCount").textContent(), "2");
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("love-star-bottle-outbox-v2") || "[]").length), 1);
  await page.evaluate(() => {
    window.__restoreStarCreate();
    window.dispatchEvent(new Event("online"));
  });
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("love-star-bottle-outbox-v2") || "[]").length === 0);
  assert.equal(await page.locator("#starBottleCount").textContent(), "2", "idempotent retry must not duplicate the star");

  await page.evaluate(() => {
    const original = window.LoveSync.createStarNote;
    let loseOnce = true;
    window.__restoreStarCreate = () => { window.LoveSync.createStarNote = original; };
    window.LoveSync.createStarNote = async (...args) => {
      const result = await original(...args);
      if (loseOnce) { loseOnce = false; throw new Error("simulated edit timeout"); }
      return result;
    };
  });
  await page.locator("#starBottleText").fill("这段待送达内容还没修改。");
  await page.locator("#starBottleForm button[type=submit]").click();
  await page.getByText("等待网络自动送达", { exact: true }).first().waitFor();
  await page.evaluate(() => window.__restoreStarCreate());
  await page.locator('[data-star-action="edit"]').first().click();
  await page.locator("#starBottleEditText").fill("这段待送达内容已经修改。");
  await page.locator("#starBottleEditForm button[type=submit]").click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("love-star-bottle-outbox-v2") || "[]").length === 0);
  await page.getByText("这段待送达内容已经修改。", { exact: true }).waitFor();

  await page.evaluate(() => {
    const original = window.LoveSync.createStarNote;
    let loseOnce = true;
    window.__restoreStarCreate = () => { window.LoveSync.createStarNote = original; };
    window.LoveSync.createStarNote = async (...args) => {
      const result = await original(...args);
      if (loseOnce) { loseOnce = false; throw new Error("simulated delete timeout"); }
      return result;
    };
  });
  await page.locator("#starBottleText").fill("这颗待送达星星会被撤销。");
  await page.locator("#starBottleForm button[type=submit]").click();
  await page.getByText("等待网络自动送达", { exact: true }).first().waitFor();
  await page.evaluate(() => window.__restoreStarCreate());
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator('[data-star-action="delete"]').first().click();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("love-star-bottle-outbox-v2") || "[]").length === 0);
  assert.equal(await page.getByText("这颗待送达星星会被撤销。", { exact: true }).count(), 0);

  await page.locator('[data-star-recipient="liu"]').click();
  await page.locator("#starBottleHistory summary").click();
  await page.locator("#starBottleHistoryList").getByText("旧星光1", { exact: true }).waitFor();
  assert.equal(await page.locator("#starBottleHistoryList .star-bottle-record").count(), 5);
  assert.equal(await page.locator("#starBottleHistoryMore").isVisible(), true);
  await page.evaluate(() => {
    window.__starSnapshotDelayMs = 700;
    window.dispatchEvent(new CustomEvent("love-star-bottle-changed"));
  });
  await page.waitForTimeout(560);
  await page.locator("#openTodayStar").click();
  await page.locator("#confirmOpenTodayStar").click();
  await page.locator("#starBottleRevealDialog[open]").waitFor();
  assert.equal(await page.locator("#starBottleRevealText").textContent(), "今天也有认真想你。");
  await page.locator("#closeStarBottleReveal").click();
  await page.waitForFunction(() => document.querySelector("#starBottleCount")?.textContent === "1");
  assert.equal(await page.locator("#openTodayStar").isDisabled(), true);
  await page.waitForTimeout(850);
  await page.evaluate(() => { window.__starSnapshotDelayMs = 0; });
  const firstOpenedStar = page.locator("#starBottleHistoryList .star-bottle-record p").first();
  await firstOpenedStar.waitFor();
  assert.equal(await firstOpenedStar.textContent(), "今天也有认真想你。");
  await page.locator("#starBottleHistoryMore").click();
  await page.waitForFunction(() => document.querySelectorAll("#starBottleHistoryList .star-bottle-record").length > 5);
  assert.equal(await firstOpenedStar.textContent(), "今天也有认真想你。");
  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    dayChip: document.querySelector("#starBottleDayChip")?.textContent,
    count: document.querySelector("#starBottleCount")?.textContent,
    longTasks: window.__starLongTasks || []
  }));
  assert.ok(layout.overflow <= 1, JSON.stringify(layout));
  assert.match(layout.dayChip, /今日已开启/);
  assert.equal(layout.longTasks.some((duration) => duration > 120), false, JSON.stringify(layout.longTasks));
  assert.equal(errors.length, 0, JSON.stringify(errors));

  const visualCount = Number(process.env.STAR_VISUAL_COUNT || 0);
  if (visualCount > 0) {
    await page.evaluate((count) => window.dispatchEvent(new CustomEvent("love-star-bottle-summary", {
      detail: { role: "liu", counts: { liu: count, fu: 2 }, opened_today: true, pending_total: 2, history_total: 8 }
    })), visualCount);
    await page.waitForTimeout(80);
  }
  await page.screenshot({ path: `star-bottle-${isAndroid ? "android" : "iphone"}-test.png`, fullPage: true });
  console.log(JSON.stringify({ device: isAndroid ? "android" : "iphone", canvas, optimisticLatency, layout, errors }));
} finally {
  await browser.close();
  server.close();
}
