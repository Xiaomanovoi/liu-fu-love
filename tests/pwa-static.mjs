import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFile(join(root, path), "utf8");
const manifest = JSON.parse(await readText("manifest.webmanifest"));
const html = await readText("index.html");
const styles = await readText("styles.css");
const pwa = await readText("pwa.js");
const worker = await readText("sw.js");
const sync = await readText("sync.js");

assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.equal(manifest.background_color, "#fbf6f2");
assert.equal(manifest.theme_color, "#fbf6f2");
assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192" && icon.purpose === "any"));
assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512" && icon.purpose === "maskable"));

for (const icon of manifest.icons) {
  const [expectedWidth, expectedHeight] = icon.sizes.split("x").map(Number);
  const png = await readFile(join(root, icon.src));
  assert.equal(png.toString("ascii", 1, 4), "PNG");
  assert.equal(png.readUInt32BE(16), expectedWidth);
  assert.equal(png.readUInt32BE(20), expectedHeight);
}

for (const [path, expectedSize] of [["assets/pwa/icon-32.png", 32], ["assets/pwa/apple-touch-icon.png", 180]]) {
  const png = await readFile(join(root, path));
  assert.equal(png.toString("ascii", 1, 4), "PNG");
  assert.equal(png.readUInt32BE(16), expectedSize);
  assert.equal(png.readUInt32BE(20), expectedSize);
}

assert.match(html, /rel="manifest"/);
assert.match(html, /rel="apple-touch-icon"/);
assert.match(html, /apple-mobile-web-app-capable/);
assert.match(html, /id="syncPasswordForm"/);
assert.match(html, /id="syncSetPasswordForm"/);
assert.match(html, /src="pwa\.js\?/);
assert.match(html, /id="appLaunch"/);
assert.match(html, /navigator\.standalone/);
assert.match(html, /rel="preload" as="image" href="assets\/hero-cute-fast\.jpg" fetchpriority="high"/);
assert.match(html, /<img class="hero-media"[^>]+loading="eager"[^>]+fetchpriority="high"/);
assert.match(html, /class="app-launch-emblem-mark"/);
assert.doesNotMatch(html, /app-launch-emblem[\s\S]{0,120}icon-192\.png/);
assert.match(styles, /\.hero-stats strong[^}]+font-style:\s*normal[^}]+font-variant-numeric:\s*tabular-nums/);

assert.match(pwa, /updateViaCache:\s*"none"/);
assert.match(pwa, /minimumVisibleTime\s*=\s*720/);
assert.doesNotMatch(pwa, /setInterval\s*\(/);
assert.doesNotMatch(worker, /caches\.(open|match)|cache\.(add|addAll|put)/);
assert.match(worker, /event\.request\.mode\s*!==\s*"navigate"/);
assert.match(sync, /signInWithPassword/);
assert.match(sync, /updateUser\(\{ password \}\)/);
assert.match(sync, /signOut\(\{ scope: "local" \}\)/);
assert.match(sync, /table: "love_shared_state"/);
assert.match(sync, /status === "SUBSCRIBED"/);
assert.match(sync, /scheduleRealtimeReconnect/);
assert.match(sync, /checkSharedVersion/);
assert.match(sync, /window\.addEventListener\("focus"/);

console.log("PWA static safety checks passed.");
