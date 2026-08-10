import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFile(join(root, path), "utf8");
const manifest = JSON.parse(await readText("manifest.webmanifest"));
const html = await readText("index.html");
const pwa = await readText("pwa.js");
const worker = await readText("sw.js");
const sync = await readText("sync.js");

assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
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

assert.match(pwa, /updateViaCache:\s*"none"/);
assert.doesNotMatch(pwa, /setInterval\s*\(/);
assert.doesNotMatch(worker, /caches\.(open|match)|cache\.(add|addAll|put)/);
assert.match(worker, /event\.request\.mode\s*!==\s*"navigate"/);
assert.match(sync, /signInWithPassword/);
assert.match(sync, /updateUser\(\{ password \}\)/);
assert.match(sync, /signOut\(\{ scope: "local" \}\)/);

console.log("PWA static safety checks passed.");
