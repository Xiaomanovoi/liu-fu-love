import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFile(join(root, path), "utf8");
const [html, app, sync, bottle, css, sql, build] = await Promise.all([
  readText("index.html"),
  readText("app.js"),
  readText("sync.js"),
  readText("star-bottle.js"),
  readText("star-bottle.css"),
  readText("supabase-star-bottle.sql"),
  readText("build.mjs")
]);

for (const id of [
  "openStarBottle", "starBottle", "starBottleCanvas", "starBottleForm",
  "starBottleOpenDialog", "starBottleRevealDialog", "starBottleEditDialog"
]) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id}`);
}

assert.match(html, /id="starBottleText"[^>]*maxlength="500"/);
assert.doesNotMatch(html, /id="starBottleTitle"/);
assert.match(app, /love-star-bottle-open/);
assert.match(build, /star-bottle\.css/);
assert.match(build, /star-bottle\.js/);

for (const rpc of [
  "get_love_star_snapshot", "create_love_star", "update_love_star",
  "delete_love_star", "open_love_star"
]) {
  assert.match(sync, new RegExp(`(?:rpc|runStarMutation)\\(\\"${rpc}\\"`), `sync.js missing ${rpc}`);
  assert.match(sql, new RegExp(`function public\\.${rpc.replaceAll("_", "_")}\\(`), `SQL missing ${rpc}`);
}

assert.match(sync, /broadcastStarBottleChange/);
assert.doesNotMatch(sync, /broadcast\([^\n]*content/);
assert.match(sql, /enable row level security/i);
assert.match(sql, /revoke all on public\.love_star_notes from anon, authenticated/i);
assert.match(sql, /recipient_role = v_role/);
assert.match(sql, /sender_id = auth\.uid\(\)/);
assert.match(sql, /opened_at is null/);
assert.match(sql, /deleted_at is null/);
assert.match(sql, /order by random\(\)/i);
assert.match(sql, /for update skip locked/i);
assert.match(sql, /Asia\/Shanghai/);
assert.match(sql, /sender_id = auth\.uid\(\) as can_delete/);
assert.doesNotMatch(sql, /grant\s+(select|insert|update|delete)\s+on\s+public\.love_star_notes/i);

assert.doesNotMatch(bottle, /setInterval\s*\(/);
assert.doesNotMatch(bottle, /requestAnimationFrame\s*\(/);
assert.match(bottle, /localStorage\.setItem/);
assert.match(bottle, /window\.confirm/);
assert.match(bottle, /historyLimit = 5/);
assert.match(bottle, /pendingLimit = 5/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /star-bottle-open\[hidden\]/);

console.log("Star bottle static safety checks passed.");
