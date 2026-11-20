import assert from "node:assert/strict";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { PGlite } = require("@electric-sql/pglite");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const db = new PGlite();
const isAndroid = process.env.PWA_DEVICE === "android";
const browserPath = process.env.PWA_BROWSER_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const day = "2026-02-17";
const ids = {
  liu: "00000000-0000-4000-8000-000000000001",
  fu: "00000000-0000-4000-8000-000000000002",
  outside: "00000000-0000-4000-8000-000000000003"
};
const mainCouple = "00000000-0000-4000-8000-000000000010";
const otherCouple = "00000000-0000-4000-8000-000000000011";
await db.exec(`
  create role anon;
  create role authenticated;
  create schema auth;
  create function auth.uid() returns uuid language sql stable
    as $$ select nullif(current_setting('test.user_id', true), '')::uuid $$;
  create table public.love_couples (id uuid primary key);
  create table public.love_members (couple_id uuid, user_id uuid primary key, role text);
  insert into public.love_couples values ('${mainCouple}'), ('${otherCouple}');
  insert into public.love_members values
    ('${mainCouple}', '${ids.liu}', 'liu'),
    ('${mainCouple}', '${ids.fu}', 'fu'),
    ('${otherCouple}', '${ids.outside}', 'liu');
`);
const migration = await readFile(join(root, "supabase-calendar.sql"), "utf8");
await db.exec(migration);
await db.exec(migration);

const readSql = "select public.get_love_calendar($1) as data";
const saveSql = "select public.save_love_calendar_entry($1,$2,$3,$4,$5,$6,$7)";
const deleteSql = "select public.delete_love_calendar_entry($1,$2)";
let queue = Promise.resolve();
function query(person, sql, params = []) {
  const run = queue.then(async () => {
    await db.exec(`set role ${person ? "authenticated" : "anon"}`);
    await db.query("select set_config('test.user_id', $1, false)", [ids[person] || ""]);
    return db.query(sql, params);
  });
  queue = run.catch(() => {});
  return run;
}
const snapshot = async (person, date = day) => (await query(person, readSql, [date])).rows[0].data;
await assert.rejects(snapshot(null), { code: "42501" });
await assert.rejects(query("liu", "select * from public.love_calendar_entries"), { code: "42501" });
const yearlyId = "00000000-0000-4000-8000-000000000020";
await query("liu", saveSql, [yearlyId, day, "event", "每年的一天", null, true, null]);
assert.equal((await snapshot("fu", "2027-02-17")).entries[0].body, "每年的一天");
assert.deepEqual((await snapshot("fu", "2025-02-17")).entries, []);
assert.deepEqual((await snapshot("outside")).entries, []);
await assert.rejects(query("fu", deleteSql, [yearlyId, 1]), { code: "42501" });
await assert.rejects(query("fu", saveSql, [yearlyId, day, "event", "越权编辑", null, false, 1]), { code: "42501" });
await assert.rejects(query("outside", saveSql, [
  "00000000-0000-4000-8000-000000000021", day, "reply", "跨空间回复", yearlyId, false, null
]), { code: "22023" });

const syncMock = `
  const role = new URLSearchParams(location.search).get("role");
  const channel = new BroadcastChannel("calendar-test");
  channel.onmessage = () => window.dispatchEvent(new Event("love-calendar-changed"));
  async function call(op, params) {
    const response = await fetch("/test-calendar", {
      method: "POST", body: JSON.stringify({ role, op, params })
    });
    const result = await response.json();
    if (!response.ok) throw Object.assign(new Error(result.message), { code: result.code });
    if (op !== "read") channel.postMessage(true);
    return result.data;
  }
  window.LoveSync = {
    initialize() {}, isConnected: () => Boolean(role), isAuthenticated: () => Boolean(role), getRole: () => role,
    getCalendarScope: () => role, readCalendarDay: (date) => call("read", [date]),
    saveCalendarEntry: (entry) => call("save", [
      entry.p_id, entry.p_day, entry.p_kind, entry.p_body, entry.p_parent_id, entry.p_yearly, entry.p_expected_version
    ]),
    deleteCalendarEntry: (id, version) => call("delete", [id, version])
  };
`;
let loseNextSaveResponse = true;
const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (url.pathname === "/test-calendar" && request.method === "POST") {
    response.setHeader("content-type", "application/json");
    try {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const { role, op, params } = JSON.parse(Buffer.concat(chunks));
      const result = await query(role, { read: readSql, save: saveSql, delete: deleteSql }[op], params);
      if (op === "save" && loseNextSaveResponse) {
        loseNextSaveResponse = false;
        response.statusCode = 503;
        response.end(JSON.stringify({ message: "保存超时" }));
      } else {
        response.end(JSON.stringify({ data: result.rows[0]?.data }));
      }
    } catch (error) {
      response.statusCode = 400;
      response.end(JSON.stringify({ message: error.message, code: error.code }));
    }
    return;
  }
  const relative = url.pathname.slice(1) || "index.html";
  try {
    response.setHeader("content-type", types[extname(relative)] || "application/octet-stream");
    response.end(relative === "sync.js" ? syncMock : relative.startsWith("supabase-") || relative === "assets/vendor/supabase.min.js"
      ? "" : await readFile(join(root, relative)));
  } catch {
    response.statusCode = 404;
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true, executablePath: browserPath });

try {
  const errors = [];
  const open = async (role) => {
    const context = await browser.newContext({
      viewport: isAndroid ? { width: 412, height: 915 } : { width: 375, height: 812 },
      isMobile: true,
      hasTouch: true
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("dialog", (dialog) => dialog.accept());
    await page.clock.setFixedTime(new Date("2026-02-16T17:00:00Z"));
    await page.goto(`http://127.0.0.1:${server.address().port}/?role=${role}`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-tab="together"]').click();
    await page.locator("#openCalendar").click();
    await page.waitForFunction(() => !document.getElementById("calendarAddNote").disabled);
    return page;
  };
  const liu = await open("liu");
  const fu = await open("fu");
  assert.match(await liu.locator("#calendarTodayLabel").textContent(), /2月17日.*星期二/);
  assert.equal(await liu.locator('[aria-current="date"]').getAttribute("data-day"), day);
  assert.equal(await liu.locator("#calendarFestivals").textContent(), "春节");
  const dateNote = (iso) => liu.locator(`[data-day="${iso}"] .calendar-date-note`);
  assert.equal(await liu.locator("#calendarDayLunar").textContent(), "农历 正月初一");
  assert.equal(await dateNote(day).textContent(), "春节");
  assert.equal(await dateNote("2026-02-18").textContent(), "初二");
  assert.equal(await dateNote("2026-02-28").textContent(), "十二");
  const weight = (locator) => locator.evaluate((node) => Number(getComputedStyle(node).fontWeight));
  assert.ok(await weight(dateNote(day)) > await weight(dateNote("2026-02-18")));
  await liu.locator("#calendarNext").click();
  assert.equal(await liu.locator('[aria-pressed="true"][data-day]').getAttribute("data-day"), "2026-03-17");
  assert.equal(await dateNote("2026-03-11").textContent(), "廿三");
  await liu.locator("#calendarGoToday").click();
  await liu.locator("#calendarAddNote").click();
  const noteText = "周六想去吃火锅 <b>记得订位</b>";
  await liu.locator("#calendarBody").fill(noteText);
  await liu.locator("#calendarSave").click();
  await liu.getByRole("button", { name: "重试保存" }).waitFor();
  assert.equal(await liu.locator("#calendarBody").inputValue(), noteText);
  await liu.locator("#calendarSave").click();
  const note = (page) => page.locator(".calendar-note");
  await note(liu).getByText(noteText).waitFor();
  assert.equal(await note(liu).count(), 1);

  // BroadcastChannel is per context; dispatch the same invalidation as the production sync layer.
  const update = async (page) => page.evaluate(() => window.dispatchEvent(new Event("love-calendar-changed")));
  await update(fu);
  await note(fu).getByText(noteText).waitFor();
  assert.equal(await note(fu).getByRole("button", { name: "编辑" }).count(), 0);
  await note(fu).getByRole("button", { name: "接一句" }).click();
  await fu.locator("#calendarBody").fill("我六点之后有空");
  await update(fu);
  assert.equal(await fu.locator("#calendarBody").inputValue(), "我六点之后有空");
  await fu.locator("#calendarSave").click();
  await note(fu).getByText("我六点之后有空").waitFor();
  await update(liu);
  await note(liu).getByText("我六点之后有空").waitFor();
  const todayCell = liu.locator(`[data-day="${day}"]`);
  assert.equal(await todayCell.locator(".calendar-signals .calendar-dot").count(), 2);
  assert.equal(await todayCell.locator(".calendar-signals .calendar-star").count(), 1);
  await liu.screenshot({ path: `calendar-${isAndroid ? "android" : "iphone"}-test.png` });
  assert.equal(await liu.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);

  await note(liu).getByRole("button", { name: "编辑" }).click();
  await liu.locator("#calendarBody").fill("晚一点去吃火锅");
  await liu.locator("#calendarSave").click();
  await note(liu).getByText("晚一点去吃火锅").waitFor();
  const saved = (await snapshot("liu")).entries.find((row) => row.kind === "note");
  await assert.rejects(query("liu", saveSql, [
    saved.id, day, "note", "另一端的旧修改", null, false, 1
  ]), { code: "40001" });
  await note(liu).getByRole("button", { name: "删除" }).click();
  await note(liu).getByText("原记录已删除").waitFor();
  await update(fu);
  await note(fu).getByText("原记录已删除").waitFor();
  await note(fu).getByText("我六点之后有空").waitFor();

  await fu.locator("#calendarAddEvent").click();
  await fu.locator("#calendarBody").fill("一起去看演出");
  await fu.locator("#calendarSave").click();
  await fu.locator(".calendar-event").getByText("一起去看演出").waitFor();
  assert.equal((await snapshot("liu", "2027-02-17")).entries.length, 1);

  await liu.setViewportSize({ width: 320, height: 760 });
  await liu.clock.setFixedTime(new Date("2025-07-25T04:00:00Z"));
  await liu.locator("#calendarGoToday").click();
  assert.equal(await dateNote("2025-07-25").textContent(), "闰六月");
  assert.equal(await liu.locator("#calendarDayLunar").textContent(), "农历 闰六月初一");
  await dateNote("2025-07-26").click();
  assert.equal(await liu.locator("#calendarDayLunar").textContent(), "农历 闰六月初二");
  const clippedLabels = await liu.locator(".calendar-date-note").evaluateAll((nodes) =>
    nodes.filter((node) => node.scrollWidth > node.clientWidth).length
  );
  assert.equal(clippedLabels, 0);
  assert.equal(await liu.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(errors, []);
  console.log(`Calendar browser and local PostgreSQL checks passed (${isAndroid ? "Android" : "iPhone"} viewport).`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  await db.close();
}
