# AGENTS.md

## Scope

These instructions apply to the entire repository.

This is `Heart Archive` (`心动存档`), a private, mobile-first PWA used by Liu
Xiangqiang and Fu Jiaying. It is hosted at:

- https://xiaomanovoi.github.io/liu-fu-love/

The application contains valuable long-lived personal and shared records. Data
integrity, privacy, cross-device consistency, and a responsive phone experience
take priority over feature speed or broad refactoring.

## Repository Map

- `index.html`: application markup, screens, dialogs, and cache-busted asset URLs.
- `styles.css`: main visual system and responsive layout.
- `app.js`: feature UI, local state, rendering, and most interactions.
- `sync.js`: the only general Supabase synchronization and authentication layer.
- `star-bottle.js` / `star-bottle.css`: isolated Star Bottle feature.
- `questions-extra.js`: random-question bank.
- `manifest.webmanifest`, `pwa.js`, `sw.js`: installable PWA behavior.
- `supabase-config.js`: browser-safe project URL and publishable/anon key only.
- `supabase-schema.sql`: full schema for a new Supabase project.
- `supabase-upgrade-2026-08.sql`: additive upgrade path for the established project.
- `supabase-star-bottle.sql`: additive, repeatable Star Bottle schema and RPCs.
- `recovery.html`: recovery/import utility; preserve compatibility with existing exports.
- `tests/`: static safety checks and Playwright phone-browser checks.
- `build.mjs`: creates `dist/` for alternate static/server packaging.
- `.github/workflows/deploy-pages-persistent.yml`: manually triggered Pages deployment.

The preferred canonical local copy is `E:\Project\CodexProjects\liu-fu-love`.
Confirm the current clone and branch before editing, and keep that copy synchronized
after an authorized deployment.

## Non-Negotiable Data Safety

1. Never drop, truncate, recreate, or bulk-delete a production data table.
2. Never use `localStorage.clear()` or delete unrelated storage keys.
3. Never replace an established user's complete state with a new default object.
4. Preserve record IDs, timestamps, versions, deletion tombstones, role ownership,
   and unknown fields when merging old and new data.
5. Treat an empty, timed-out, unauthenticated, or partially loaded response as
   "not loaded", not as authoritative empty data.
6. Do not clear a form before its content is durably saved locally or confirmed by
   the server. Slow networks must not silently lose typed content.
7. Retried mutations must be idempotent. Use stable client tokens for operations
   that can be retried after an uncertain network response.
8. Prefer soft deletion/tombstones where another device could otherwise restore an
   old record from stale state.
9. Existing production data must remain readable after every frontend deployment,
   even before an optional SQL upgrade is executed.
10. Before changing persistence or migrations, explicitly inspect both the current
    read path and write path and add a regression check for the failure mode.

Do not claim a migration is safe merely because it uses `create table if not
exists`. Inspect every `alter`, policy replacement, function replacement, trigger,
and data statement in the complete script.

## Shared And Private Records

- Shared records are visible only to the two members of the same love space.
- Private records must remain scoped to the authenticated owner and must never be
  copied into shared state, broadcasts, logs, or recovery output intended for the
  other person.
- Preserve the separate `liu` and `fu` identities. Never infer identity from device
  type, email provider, browser, or display name.
- Realtime messages should invalidate or announce changes, not broadcast private
  record content.
- Daily limits and date-sensitive rules use `Asia/Shanghai` server dates where
  consistency between devices matters.

## Supabase Rules

- The browser may contain only the Supabase project URL and publishable/anon key.
- Never commit or expose a secret key, `service_role` key, account password, or SMTP
  credential.
- Keep Row Level Security enabled on every user-data table.
- `security definer` RPCs must validate `auth.uid()`, love-space membership, record
  ownership/role, allowed input length, and the target row before modifying data.
- Revoke broad table access when RPC-only access is intended, then grant only the
  required RPC execution to `authenticated`.
- New production migrations must be additive and safe to run more than once. Favor
  `add column if not exists`, `create index if not exists`, and `create or replace
  function` while preserving old RPC compatibility during rollout.
- Never edit an already-run migration in a way that assumes it will run from a clean
  database. Add a compatible upgrade section or a new focused SQL file.
- Do not automatically run production SQL. Give the user the exact script and wait
  for confirmation that it completed.
- Storage buckets for voice or media must remain private. Generate short-lived
  signed URLs only after membership checks.

## Synchronization Rules

- Keep direct Supabase access in `sync.js`; feature modules should call `LoveSync`
  methods and consume application events.
- Show cached/local data quickly, then reconcile with the server without allowing a
  late response to overwrite newer local input.
- Deduplicate concurrent reads and debounce realtime refreshes.
- Capture the current user/session when starting async work and discard results if
  the user changed before completion.
- Never perform full shared-state refreshes for a small counter or single-record
  mutation when a summary or local patch is sufficient.
- Use optimistic UI only when rollback, retry, or durable outbox behavior is defined.
- Keep pending local writes visible and distinguish them from confirmed server rows.
- When resolving concurrent edits, merge by stable record ID and version/timestamp;
  do not use array position or displayed date as identity.
- Sort equal-date records by their full timestamp, even when the UI displays only the
  calendar date.

## PWA And Authentication

- The normal web URL and installed PWA must continue to work together against the
  same Supabase data.
- Preserve password login, email-link login compatibility, and local sign-out.
- Do not put authentication sessions or application data in the service-worker
  cache.
- Keep navigation network-first. The current worker intentionally removes legacy
  app caches rather than serving stale application shells.
- Avoid background polling loops. Refresh on meaningful lifecycle, realtime, or
  user events.
- When changing loaded JS/CSS, update the cache-busting query in `index.html`.
- Changes to the app name or icons must update the manifest, Apple touch metadata,
  and all referenced icon sizes together.

## UI And Performance

- Design for narrow mobile viewports first, including Android browsers, iOS Safari,
  installed PWA mode, and in-app browsers such as WeChat.
- Keep the visual direction romantic, cute, restrained, and readable. Avoid crowded
  sections, nested cards, overlapping decorations, floating objects, and tiny text.
- Preserve the four-item bottom navigation and safe-area spacing.
- Lists that grow indefinitely must show the newest useful records first and
  collapse after five visible items unless the feature has a stronger reason.
- Do not rerender a whole screen while the user is typing or a dialog is open.
- Avoid continuous animation, large blur filters, repeated full-DOM rebuilds, and
  uncapped canvas device-pixel ratios.
- Canvas or decorative scenes must have bounded object counts and deterministic
  layout. Verify both sparse and dense states.
- Images should be compressed before synchronization; large media belongs in private
  Supabase Storage rather than shared JSON state.
- Respect `prefers-reduced-motion` and keep tap targets usable on phones.

## Editing Conventions

- Follow the existing no-framework HTML/CSS/JavaScript style.
- Keep changes narrowly scoped. Do not introduce a framework or build dependency for
  a small feature.
- Use existing helpers, events, role names, storage keys, and record shapes before
  adding new abstractions.
- Keep source files UTF-8. Preserve Chinese UI copy and avoid encoding conversions.
- Do not manually edit generated `dist/` output.
- Do not commit `dist/`, browser-test screenshots, temporary recovery exports, or
  credentials.
- Preserve unknown record fields so older/newer clients can coexist during rollout.

## Required Verification

Run the checks appropriate to the touched surface. At minimum for JavaScript/UI work:

```powershell
node --check app.js
node --check sync.js
node --check star-bottle.js
npm run test:pwa
npm run test:star-bottle
npm run build
git diff --check
```

For PWA, synchronization, navigation, dialog, or responsive-layout changes, also run
the relevant Playwright checks on both device profiles when Playwright is available:

```powershell
$env:PWA_DEVICE = "iphone"
node tests/pwa-browser.mjs
node tests/star-bottle-browser.mjs

$env:PWA_DEVICE = "android"
node tests/pwa-browser.mjs
node tests/star-bottle-browser.mjs
```

Inspect screenshots rather than relying only on assertions. Check at least:

- no horizontal overflow or bottom-navigation overlap;
- no input loss during realtime refresh;
- no duplicate record after timeout/retry;
- both users can create, see, update, and delete the intended records;
- private records stay private;
- sparse, five-item, and long-list states;
- loading, offline, timeout, unauthenticated, and stale-cache behavior;
- existing data remains present after refresh, relaunch, and another-browser login.

Delete generated `dist/` and `*-test.png` files after verification unless the user
explicitly asks to keep them.

## Release Process

1. Start from a clean worktree and inspect unrelated user changes before editing.
2. Implement and verify locally. Do not combine unrelated refactors with a feature.
3. Review the diff specifically for destructive SQL, storage-key changes, stale
   async writes, secrets, and generated files.
4. Commit with a focused message.
5. Push or deploy only with explicit user authorization.
6. Trigger `Deploy GitHub Pages` manually and wait for the workflow to finish.
7. Verify the live URL with a cache-busting query and confirm changed assets are
   actually served.
8. If SQL is required, provide the exact public SQL file and Supabase SQL Editor
   link. State whether it is repeatable and what data it can touch.
9. Fast-forward the canonical `E:\Project\CodexProjects\liu-fu-love` copy after a
   successful deployment.
10. Tell the user whether re-login, PWA relaunch, SQL execution, or any manual test is
    required. Never imply deployment alone applied a database migration.

## Stop And Ask

Stop and ask the user before any action that would:

- delete, reset, rewrite, or restore production data;
- replace a Supabase project, bucket, authentication method, or love-space identity;
- expose or move private records;
- invalidate existing recovery files or installed PWA sessions;
- require a paid service or a new recurring maintenance burden;
- publish, push, deploy, or run production SQL without prior authorization.

