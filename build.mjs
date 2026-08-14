import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync("dist/assets", { recursive: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });

for (const name of ["index.html", "styles.css", "star-bottle.css", "app.js", "star-bottle.js", "sync.js", "questions-extra.js", "supabase-config.js", "manifest.webmanifest", "pwa.js", "sw.js"]) {
  cpSync(name, `dist/${name}`);
}

cpSync("assets", "dist/assets", { recursive: true });
cpSync(".openai/hosting.json", "dist/.openai/hosting.json");

const server = `
const files = {
  "/": { type: "text/html; charset=utf-8", body: ${JSON.stringify(readText("index.html"))} },
  "/index.html": { type: "text/html; charset=utf-8", body: ${JSON.stringify(readText("index.html"))} },
  "/styles.css": { type: "text/css; charset=utf-8", body: ${JSON.stringify(readText("styles.css"))} },
  "/star-bottle.css": { type: "text/css; charset=utf-8", body: ${JSON.stringify(readText("star-bottle.css"))} },
  "/app.js": { type: "application/javascript; charset=utf-8", body: ${JSON.stringify(readText("app.js"))} },
  "/star-bottle.js": { type: "application/javascript; charset=utf-8", body: ${JSON.stringify(readText("star-bottle.js"))} },
  "/sync.js": { type: "application/javascript; charset=utf-8", body: ${JSON.stringify(readText("sync.js"))} },
  "/questions-extra.js": { type: "application/javascript; charset=utf-8", body: ${JSON.stringify(readText("questions-extra.js"))} },
  "/supabase-config.js": { type: "application/javascript; charset=utf-8", body: ${JSON.stringify(readText("supabase-config.js"))} },
  "/manifest.webmanifest": { type: "application/manifest+json; charset=utf-8", body: ${JSON.stringify(readText("manifest.webmanifest"))} },
  "/pwa.js": { type: "application/javascript; charset=utf-8", body: ${JSON.stringify(readText("pwa.js"))} },
  "/sw.js": { type: "application/javascript; charset=utf-8", body: ${JSON.stringify(readText("sw.js"))} },
  "/assets/garden-glasshouse.svg": { type: "image/svg+xml; charset=utf-8", body: ${JSON.stringify(readText("assets/garden-glasshouse.svg"))} },
  "/assets/vendor/supabase.min.js": { type: "application/javascript; charset=utf-8", body: ${JSON.stringify(readText("assets/vendor/supabase.min.js"))} },
  "/assets/pwa/icon-32.png": { type: "image/png", base64: "${readBase64("assets/pwa/icon-32.png")}" },
  "/assets/pwa/apple-touch-icon.png": { type: "image/png", base64: "${readBase64("assets/pwa/apple-touch-icon.png")}" },
  "/assets/pwa/icon-192.png": { type: "image/png", base64: "${readBase64("assets/pwa/icon-192.png")}" },
  "/assets/pwa/icon-512.png": { type: "image/png", base64: "${readBase64("assets/pwa/icon-512.png")}" },
  "/assets/pwa/icon-maskable-512.png": { type: "image/png", base64: "${readBase64("assets/pwa/icon-maskable-512.png")}" },
  "/assets/hero-bg.jpg": { type: "image/jpeg", base64: "${readBase64("assets/hero-bg.jpg")}" }
};

function responseFor(pathname) {
  const file = files[pathname] || files["/"];
  const headers = {
    "content-type": file.type,
    "cache-control": pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache"
  };

  if (file.base64) {
    return new Response(Uint8Array.from(atob(file.base64), (char) => char.charCodeAt(0)), { headers });
  }

  return new Response(file.body, { headers });
}

export default {
  fetch(request) {
    const url = new URL(request.url);
    return responseFor(url.pathname);
  }
};
`;

writeFileSync("dist/server/index.js", server.trimStart());

function readText(path) {
  return readFileSync(path, "utf8");
}

function readBase64(path) {
  return readFileSync(path).toString("base64");
}
