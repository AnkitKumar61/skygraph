import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const directory = join(process.cwd(), "apps", "web", "dist", "assets");
const totals = { js: 0, css: 0 };
for (const name of await readdir(directory)) {
  if (name.endsWith(".map")) throw new Error("Public source maps must not be shipped.");
  const kind = name.endsWith(".js") ? "js" : name.endsWith(".css") ? "css" : undefined;
  if (kind === undefined) continue;
  totals[kind] += gzipSync(await readFile(join(directory, name))).byteLength;
}
if (totals.js === 0 || totals.css === 0) throw new Error("Production assets are missing.");
if (totals.js > 250 * 1024 || totals.css > 30 * 1024)
  throw new Error("Initial shell bundle budget exceeded.");
console.log(JSON.stringify({ gzipBytes: totals, budgets: { js: 250 * 1024, css: 30 * 1024 } }));
