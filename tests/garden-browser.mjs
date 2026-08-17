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
  page.on("pageerror", (error) => errors.push(error.message));
  const baseUrl = `http://127.0.0.1:${port}${prefix}`;
  const device = isAndroid ? "android" : "iphone";
  await page.addInitScript(() => {
    const fixture = new URL(location.href).searchParams.get("__gardenFixture");
    if (!fixture) return;
    const key = "love-tool-liu-fu-v2";
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    saved.writer = "liu";
    saved.privatePerson = "liu";
    saved.garden = { ...(saved.garden || {}), ...JSON.parse(fixture) };
    localStorage.setItem(key, JSON.stringify(saved));
  });
  const gardenFixtureUrl = (garden) => {
    const url = new URL(baseUrl);
    url.searchParams.set("__gardenFixture", JSON.stringify(garden));
    return url.href;
  };

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

  async function showGarden({ name, points, decorations = [], screenshot = true }) {
    await page.goto(gardenFixtureUrl({
      version: 3, points, baselinePoints: points, migrationComplete: true, pointEvents: [], creditedKeys: [],
      decorationStates: Object.fromEntries(decorations.map((id, index) => [id, {
        enabled: true, updatedAt: new Date(Date.now() + index * 1000).toISOString()
      }]))
    }), { waitUntil: "networkidle" });
    await page.locator("#openGardenHome").click();
    await page.locator("#garden.is-active").waitFor();
    try {
      await page.waitForFunction((expectedCount) => document.querySelector("#gardenSceneDecoration")?.dataset.decorationCount === String(expectedCount), decorations.length);
    } catch (error) {
      throw new Error(`${error.message}; page errors: ${errors.join(" | ") || "none"}`);
    }
    if (screenshot) await page.locator("#gardenStage").screenshot({ path: join(root, "output", "playwright", `garden-${name}-${device}.png`) });
    return page.evaluate(() => {
      const stage = document.querySelector("#gardenStage");
      const stageRect = stage.getBoundingClientRect();
      const svg = stage.querySelector(".garden-plant-svg");
      const stems = [...svg.querySelectorAll(".garden-svg-stems path")];
      const leafNodes = [...svg.querySelectorAll(".garden-svg-leaf")];
      const leafDistances = leafNodes.map((leaf) => {
        const matrix = leaf.transform.baseVal.consolidate().matrix;
        const leafRoot = { x: matrix.e, y: matrix.f };
        const stem = svg.querySelector(`.garden-svg-stems path[data-stem-index="${leaf.dataset.stemIndex}"]`);
        if (!stem) return Number.POSITIVE_INFINITY;
        const length = stem.getTotalLength();
        return Math.min(...Array.from({ length: 101 }, (_, index) => {
          const stemPoint = stem.getPointAtLength(length * index / 100);
          return Math.hypot(leafRoot.x - stemPoint.x, leafRoot.y - stemPoint.y);
        }));
      });
      const svgRect = svg.getBoundingClientRect();
      return {
        stage: stage.dataset.stage,
        flowers: stage.querySelectorAll(".garden-svg-flower").length,
        buds: stage.querySelectorAll(".garden-svg-bud").length,
        mainLeaves: leafNodes.length,
        mainPetioles: svg.querySelectorAll(".garden-leaf-petiole").length,
        mainBlades: svg.querySelectorAll(".garden-leaf-blade").length,
        mainInvalidStemRefs: leafNodes.filter((leaf) => !svg.querySelector(`.garden-svg-stems path[data-stem-index="${leaf.dataset.stemIndex}"]`)).length,
        mainLeavesInside: [...svg.querySelectorAll(".garden-leaf-blade")].every((blade) => {
          const rect = blade.getBoundingClientRect();
          return rect.left >= svgRect.left - 2 && rect.right <= svgRect.right + 2
            && rect.top >= svgRect.top - 2 && rect.bottom <= svgRect.bottom + 2;
        }),
        mainMaxLeafStemDistance: leafDistances.length ? Math.max(...leafDistances) : 0,
        decorations: [...stage.querySelectorAll(".garden-decoration-art")].map((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            name: node.closest("[data-decoration-id]")?.dataset.decorationId || "", width: Math.round(rect.width), height: Math.round(rect.height),
            opacity: Number(style.opacity), inside: rect.right >= stageRect.left && rect.left <= stageRect.right
              && rect.bottom >= stageRect.top && rect.top <= stageRect.bottom
          };
        }),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });
  }

  const stageCases = [
    ["seed", 0, 0, 0, 0], ["sprout", 200, 0, 0, 4], ["seedling", 500, 0, 0, 8],
    ["bud", 900, 0, 3, 8], ["bloom", 1400, 3, 0, 8], ["garden", 2000, 5, 0, 14],
    ["path", 2800, 9, 0, 14], ["courtyard", 3400, 14, 0, 14], ["sanctuary", 4300, 19, 0, 14]
  ];
  const stages = [];
  for (const [name, points, flowers, buds, leaves] of stageCases) {
    const result = await showGarden({ name, points });
    assert.equal(result.stage, name);
    assert.equal(result.flowers, flowers);
    assert.equal(result.buds, buds);
    assert.equal(result.mainLeaves, leaves, JSON.stringify(result));
    assert.equal(result.mainPetioles, leaves, JSON.stringify(result));
    assert.equal(result.mainBlades, leaves, JSON.stringify(result));
    assert.equal(result.mainInvalidStemRefs, 0, JSON.stringify(result));
    assert.equal(result.mainLeavesInside, true, JSON.stringify(result));
    assert.ok(result.mainMaxLeafStemDistance <= 3, `detached main-garden leaf: ${JSON.stringify(result)}`);
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
  const natural = await showGarden({
    name: "decor-natural", points: 4300,
    decorations: ["lights", "bridge", "picnic", "pond"]
  });
  const cottage = await showGarden({
    name: "decor-cottage", points: 4300,
    decorations: ["ribbon", "shelf", "windchime", "stones", "flowercart", "birdhouse"]
  });
  const moon = await showGarden({
    name: "decor-moon", points: 4300,
    decorations: ["starlight", "moongate", "moonlamp", "wishbottles", "lanterns", "mushrooms", "planters"]
  });
  const season = await showGarden({
    name: "decor-season", points: 4300,
    decorations: ["seasongate", "butterflyhouse"]
  });

  const decorationIds = [
    "mushrooms", "stones", "planters", "lights", "picnic", "ribbon", "bench", "mailbox", "birdhouse",
    "windchime", "arch", "lanterns", "butterflyhouse", "swing", "fountain", "pond", "bridge", "shelf",
    "flowercart", "starlight", "moonlamp", "moongate", "pavilion", "wishbottles", "seasongate"
  ];
  for (const id of decorationIds) {
    const result = await showGarden({ name: `decor-${id}`, points: 4300, decorations: [id], screenshot: false });
    assert.equal(result.decorations.length, 1, `${id}: ${JSON.stringify({ result, errors })}`);
    assert.ok(result.decorations[0].width >= 30 && result.decorations[0].height >= 20 && result.decorations[0].inside, `${id}: ${JSON.stringify(result)}`);
  }

  async function showCompanion({ species, careCount, expectedLevel, screenshot = false }) {
    const care = {};
    for (let index = 0; index < Math.ceil(careCount / 2); index += 1) {
      care[`2026-01-${String(index + 1).padStart(2, "0")}`] = index * 2 + 1 < careCount ? ["liu", "fu"] : ["liu"];
    }
    await page.goto(gardenFixtureUrl({
      points: 4300, baselinePoints: 4300, migrationComplete: true, pointEvents: [], creditedKeys: [],
      companionPlant: { name: "并肩生长", species, createdAt: new Date().toISOString(), care }
    }), { waitUntil: "networkidle" });
    await page.locator("#openGardenHome").click();
    await page.locator('#garden [data-garden-panel="together"]').click();
    await page.locator("#gardenPanelTogether:not([hidden])").waitFor();
    if (screenshot) {
      await page.locator("#gardenCompanionDisplay").evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
      await page.locator("#gardenCompanionDisplay").screenshot({ path: join(root, "output", "playwright", `companion-${species}-level-${expectedLevel}-${device}.png`) });
    }
    const result = await page.evaluate(() => {
      const display = document.querySelector("#gardenCompanionDisplay");
      const svg = display.querySelector("svg");
      const rect = svg.getBoundingClientRect();
      const displayRect = display.getBoundingClientRect();
      const stems = [...svg.querySelectorAll(".companion-stems path[data-stem-index]")];
      const leafNodes = [...svg.querySelectorAll(".companion-leaf")];
      const leafDistances = leafNodes.map((leaf) => {
        const matrix = leaf.transform.baseVal.consolidate().matrix;
        const leafRoot = { x: matrix.e, y: matrix.f };
        const stem = svg.querySelector(`.companion-stems path[data-stem-index="${leaf.dataset.stemIndex}"]`);
        if (!stem) return Number.POSITIVE_INFINITY;
        const length = stem.getTotalLength();
        return Math.min(...Array.from({ length: 101 }, (_, index) => {
          const stemPoint = stem.getPointAtLength(length * index / 100);
          return Math.hypot(leafRoot.x - stemPoint.x, leafRoot.y - stemPoint.y);
        }));
      });
      const stemJoinDistances = stems.slice(1).map((stem, stemIndex) => {
        const root = stem.getPointAtLength(0);
        return Math.min(...stems.slice(0, stemIndex + 1).flatMap((parentStem) => {
          const length = parentStem.getTotalLength();
          return Array.from({ length: 101 }, (_, index) => {
            const point = parentStem.getPointAtLength(length * index / 100);
            return Math.hypot(root.x - point.x, root.y - point.y);
          });
        }));
      });
      const petioleLengths = [...svg.querySelectorAll(".companion-petiole")].map((petiole) => petiole.getTotalLength());
      return {
        species: display.dataset.species,
        level: Number(display.dataset.level),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        leaves: svg.querySelectorAll(".companion-leaf").length,
        petioles: svg.querySelectorAll(".companion-petiole").length,
        blades: svg.querySelectorAll(".companion-leaf-blade").length,
        invalidStemRefs: leafNodes.filter((leaf) => !svg.querySelector(`.companion-stems path[data-stem-index="${leaf.dataset.stemIndex}"]`)).length,
        leavesInside: [...svg.querySelectorAll(".companion-leaf-blade")].every((blade) => {
          const bladeRect = blade.getBoundingClientRect();
          return bladeRect.left >= rect.left - 1 && bladeRect.right <= rect.right + 1 && bladeRect.top >= rect.top - 1 && bladeRect.bottom <= rect.bottom + 1;
        }),
        buds: svg.querySelectorAll(".companion-bud").length,
        blooms: svg.querySelectorAll(".companion-bloom").length,
        maxLeafStemDistance: leafDistances.length ? Math.max(...leafDistances) : 0,
        maxStemJoinDistance: stemJoinDistances.length ? Math.max(...stemJoinDistances) : 0,
        maxPetioleLength: petioleLengths.length ? Math.max(...petioleLengths) : 0,
        inside: rect.left >= displayRect.left - 1 && rect.right <= displayRect.right + 1
      };
    });
    assert.equal(result.species, species, JSON.stringify(result));
    assert.equal(result.level, expectedLevel, JSON.stringify(result));
    assert.ok(result.width >= 180 && result.height >= 180 && result.inside, JSON.stringify(result));
    assert.ok(result.maxLeafStemDistance <= 3, `detached companion leaf: ${JSON.stringify(result)}`);
    assert.ok(result.maxStemJoinDistance <= 8, `detached companion stem: ${JSON.stringify(result)}`);
    assert.ok(result.maxPetioleLength <= 5, `overlong companion petiole: ${JSON.stringify(result)}`);
    assert.equal(result.petioles, result.leaves, JSON.stringify(result));
    assert.equal(result.blades, result.leaves, JSON.stringify(result));
    assert.equal(result.invalidStemRefs, 0, JSON.stringify(result));
    assert.equal(result.leavesInside, true, JSON.stringify(result));
    return result;
  }

  const careByLevel = [0, 2, 6, 12, 20, 32, 48];
  const companionSpecies = ["rose", "daisy", "lavender", "sunflower", "tulip", "camellia", "bluebell"];
  assert.deepEqual(await page.locator("#gardenCompanionSpecies option").evaluateAll((options) => options.map((option) => option.value)), companionSpecies);
  for (const species of companionSpecies) {
    for (let level = 0; level <= 6; level += 1) {
      const result = await showCompanion({ species, careCount: careByLevel[level], expectedLevel: level, screenshot: level >= 1 });
      assert.equal(result.leaves, [0, 2, 4, 6, 6, 7, 8][level], JSON.stringify(result));
      if (level === 4) assert.equal(result.buds, 3, JSON.stringify(result));
      if (level === 6) assert.equal(result.blooms, 5, JSON.stringify(result));
    }
  }

  await page.evaluate(() => {
    const key = "love-tool-liu-fu-v2";
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    saved.writer = "liu";
    saved.privatePerson = "liu";
    saved.garden = {
      ...(saved.garden || {}),
      points: 4300, baselinePoints: 4300, migrationComplete: true, pointEvents: [], creditedKeys: [],
      hybrid: {
        round: 12,
        choices: {
          liu: null,
          fu: { round: 12, color: "aqua", shape: "lotus", pattern: "moonwash", center: "moon", layer: "double", leaf: "variegated", aura: "halo", date: "2026-08-17", updatedAt: "2026-08-17T02:00:00.000Z" }
        },
        blooms: []
      }
    };
    localStorage.setItem(key, JSON.stringify(saved));
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#openGardenHome").click();
  await page.locator('#garden [data-garden-panel="flowers"]').click();
  await page.locator("#gardenPanelFlowers:not([hidden])").waitFor();
  const hybridOptionCounts = await page.evaluate(() => Object.fromEntries([
    "Color", "Shape", "Pattern", "Center", "Layer", "Aura"
  ].map((name) => [name.toLowerCase(), document.querySelector(`#gardenHybrid${name}`).options.length])));
  assert.deepEqual(hybridOptionCounts, { color: 16, shape: 12, pattern: 8, center: 8, layer: 4, aura: 6 });
  assert.equal(await page.locator("#gardenHybridLeaf").count(), 0);
  await page.locator("#gardenHybridColor").selectOption("wine");
  await page.locator("#gardenHybridShape").selectOption("butterfly");
  await page.locator("#gardenHybridPattern").selectOption("speckle");
  await page.locator("#gardenHybridCenter").selectOption("heart");
  await page.locator("#gardenHybridLayer").selectOption("lush");
  await page.locator("#gardenHybridAura").selectOption("butterfly");
  const hybridPreview = await page.evaluate(() => {
    const preview = document.querySelector("#gardenHybridPreview");
    const svg = preview.querySelector("svg");
    const rect = svg.getBoundingClientRect();
    const host = preview.getBoundingClientRect();
    return {
      petals: svg.querySelectorAll(".hybrid-petal").length,
      leaves: svg.querySelectorAll(".hybrid-fixed-leaves, .hybrid-leaf-detail").length,
      stems: svg.querySelectorAll(".hybrid-stem").length,
      inside: rect.left >= host.left - 1 && rect.right <= host.right + 1 && rect.top >= host.top - 1 && rect.bottom <= host.bottom + 1,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  assert.equal(hybridPreview.petals, 23, JSON.stringify(hybridPreview));
  assert.equal(hybridPreview.leaves, 0, JSON.stringify(hybridPreview));
  assert.equal(hybridPreview.stems, 1, JSON.stringify(hybridPreview));
  assert.ok(hybridPreview.inside && hybridPreview.overflow <= 1, JSON.stringify(hybridPreview));
  await page.locator("#gardenHybridPreview").evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.locator("#gardenHybridPreview").screenshot({ path: join(root, "output", "playwright", `hybrid-options-${device}.png`) });
  await page.locator("#gardenHybridForm button[type=submit]").click();
  await page.locator("#gardenBloomGallery .hybrid-bloom").first().waitFor();
  const savedBloom = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("love-tool-liu-fu-v2") || "{}");
    const bloom = saved.garden?.hybrid?.blooms?.[0];
    return {
      left: bloom?.left,
      right: bloom?.right,
      galleryPetals: document.querySelector("#gardenBloomGallery .hybrid-flower-svg")?.querySelectorAll(".hybrid-petal").length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  assert.equal(savedBloom.left?.layer, "lush", JSON.stringify(savedBloom));
  assert.equal(Object.hasOwn(savedBloom.left || {}, "leaf"), false, JSON.stringify(savedBloom));
  assert.equal(savedBloom.left?.aura, "butterfly", JSON.stringify(savedBloom));
  assert.equal(savedBloom.right?.layer, "double", JSON.stringify(savedBloom));
  assert.equal(savedBloom.galleryPetals, 23, JSON.stringify(savedBloom));
  assert.ok(savedBloom.overflow <= 1, JSON.stringify(savedBloom));

  for (const result of [...stages, basic, late, natural, cottage, moon, season]) {
    assert.ok(result.overflow <= 1, JSON.stringify(result));
    assert.ok(result.decorations.every((item) => item.width >= 8 && item.height >= 8 && item.opacity >= .65 && item.inside), JSON.stringify(result));
  }
  assert.equal(errors.length, 0, JSON.stringify(errors));
  console.log(JSON.stringify({ device, cover, stages, basic, late, natural, cottage, moon, season, errors }));
} finally {
  await browser.close();
  server.close();
}
