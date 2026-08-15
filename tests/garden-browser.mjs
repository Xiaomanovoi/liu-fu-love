import assert from "node:assert/strict";
import http from "node:http";
import { mkdir, readFile } from "node:fs/promises";
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
  ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8", ".jpg": "image/jpeg",
  ".json": "application/json; charset=utf-8", ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8"
};

const supabaseMock = `window.supabase={createClient(){return {auth:{
  onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}}},
  async getSession(){return {data:{session:null},error:null}}
}}}};`;

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://127.0.0.1");
    if (!url.pathname.startsWith(prefix)) throw new Error("outside scope");
    const relative = url.pathname.slice(prefix.length) || "index.html";
    if (relative === "assets/vendor/supabase.min.js") {
      response.writeHead(200, { "content-type": types[".js"], "cache-control": "no-store" });
      response.end(supabaseMock);
      return;
    }
    if (relative === "supabase-config.js") {
      response.writeHead(200, { "content-type": types[".js"], "cache-control": "no-store" });
      response.end("window.LOVE_SYNC_CONFIG={};");
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

await mkdir(join(root, "output", "playwright"), { recursive: true });
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await chromium.launch({ headless: true, executablePath: browserPath });

try {
  const context = await browser.newContext({
    viewport: isAndroid ? { width: 412, height: 915 } : { width: 390, height: 844 },
    userAgent: isAndroid
      ? "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/136.0.0.0 Mobile Safari/537.36"
      : "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 Version/18.4 Mobile/15E148 Safari/604.1"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const baseUrl = `http://127.0.0.1:${port}${prefix}`;
  const device = isAndroid ? "android" : "iphone";

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: join(root, "output", "playwright", `cover-${device}.png`) });
  const cover = await page.evaluate(() => {
    const title = document.querySelector(".hero h1");
    const stats = document.querySelector(".hero-stats");
    const titleRect = title.getBoundingClientRect();
    const statsRect = stats.getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      titleFits: title.scrollWidth <= title.clientWidth + 1,
      separated: titleRect.bottom < statsRect.top
    };
  });
  assert.ok(cover.overflow <= 1 && cover.titleFits && cover.separated, JSON.stringify(cover));

  async function showGarden({ name, points, decorations = [] }) {
    await page.evaluate(({ points: nextPoints, decorations: nextDecorations }) => {
      const key = "love-tool-liu-fu-v2";
      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      const now = new Date().toISOString();
      saved.writer = "liu";
      saved.privatePerson = "liu";
      saved.garden = {
        ...(saved.garden || {}), version: 3, points: nextPoints, baselinePoints: nextPoints,
        migrationComplete: true, pointEvents: [], creditedKeys: [],
        decorationStates: Object.fromEntries(nextDecorations.map((id, index) => [id, {
          enabled: true, updatedAt: new Date(Date.now() + index * 1000).toISOString()
        }]))
      };
      localStorage.setItem(key, JSON.stringify(saved));
    }, { points, decorations });
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("#openGardenHome").click();
    await page.locator("#garden.is-active").waitFor();
    await page.locator("#gardenStage").screenshot({ path: join(root, "output", "playwright", `garden-${name}-${device}.png`) });
    return page.evaluate(() => {
      const stage = document.querySelector("#gardenStage");
      const stageRect = stage.getBoundingClientRect();
      return {
        stage: stage.dataset.stage,
        flowers: stage.querySelectorAll(".garden-svg-flower").length,
        buds: stage.querySelectorAll(".garden-svg-bud").length,
        decorations: [...stage.querySelectorAll(".garden-decor")].map((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            name: node.className, width: Math.round(rect.width), height: Math.round(rect.height),
            opacity: Number(style.opacity), inside: rect.right >= stageRect.left && rect.left <= stageRect.right
              && rect.bottom >= stageRect.top && rect.top <= stageRect.bottom
          };
        }),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });
  }

  const stageCases = [
    ["seed", 0, 0, 0], ["sprout", 200, 0, 0], ["seedling", 500, 0, 0],
    ["bud", 900, 0, 3], ["bloom", 1400, 3, 0], ["garden", 2000, 5, 0],
    ["path", 2800, 9, 0], ["courtyard", 3400, 14, 0], ["sanctuary", 4300, 19, 0]
  ];
  const stages = [];
  for (const [name, points, flowers, buds] of stageCases) {
    const result = await showGarden({ name, points });
    assert.equal(result.stage, name);
    assert.equal(result.flowers, flowers);
    assert.equal(result.buds, buds);
    stages.push(result);
  }

  const basic = await showGarden({
    name: "decor-basic", points: 1400,
    decorations: ["ribbon", "arch", "windchime", "stones", "bench", "mailbox"]
  });
  const late = await showGarden({
    name: "decor-late", points: 4300,
    decorations: ["starlight", "pavilion", "moonlamp", "wishbottles", "lanterns", "swing", "fountain"]
  });

  for (const result of [...stages, basic, late]) {
    assert.ok(result.overflow <= 1, JSON.stringify(result));
    assert.ok(result.decorations.every((item) => item.width >= 8 && item.height >= 8 && item.opacity >= .65 && item.inside), JSON.stringify(result));
  }
  assert.equal(errors.length, 0, JSON.stringify(errors));
  console.log(JSON.stringify({ device, cover, stages, basic, late, errors }));
} finally {
  await browser.close();
  server.close();
}
