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
  "get_love_star_snapshot", "get_love_star_summary", "create_love_star", "create_love_star_v2", "delete_love_star_by_token", "update_love_star",
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
assert.match(sql, /client_token/);
assert.match(sql, /unique index if not exists love_star_notes_client_token_idx/i);
assert.match(sql, /on conflict \(sender_id, client_token\)/i);
assert.doesNotMatch(sql, /\b(drop table|truncate table|delete from)\s+public\.love_star_notes/i);
assert.doesNotMatch(sql, /grant\s+(select|insert|update|delete)\s+on\s+public\.love_star_notes/i);

assert.doesNotMatch(bottle, /setInterval\s*\(/);
assert.doesNotMatch(bottle, /requestAnimationFrame\s*\(/);
assert.match(bottle, /localStorage\.setItem/);
assert.match(bottle, /love-star-bottle-outbox-v2/);
assert.match(bottle, /createClientToken/);
assert.match(bottle, /flushOutbox/);
assert.match(bottle, /interactionLocked/);
assert.match(bottle, /Math\.min\(count, 60\)/);
assert.match(bottle, /Math\.min\(1\.5, window\.devicePixelRatio/);
assert.match(bottle, /lastDrawKey/);
assert.match(bottle, /window\.confirm/);
assert.match(bottle, /historyLimit = 5/);
assert.match(bottle, /historyExpanded = false/);
assert.match(bottle, /historyNeedsRefresh = false/);
assert.match(bottle, /收起到最新 5 条/);
assert.match(bottle, /sortedHistory\.slice\(0, 5\)/);
assert.match(sync, /__fromCache: true/);
assert.match(bottle, /pendingLimit = 5/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /star-bottle-open\[hidden\]/);
assert.doesNotMatch(html, /data-star-history-filter=["']month["']/i);

console.log("Star bottle static safety checks passed.");
