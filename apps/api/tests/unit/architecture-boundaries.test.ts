import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const FORBIDDEN_IMPORT =
  /from\s+["'][^"']*(?:express|pino|prom-client|zod|postgres|redis|napi)[^"']*["']/u;

async function TypeScriptFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return TypeScriptFiles(path);
      }
      return entry.isFile() && entry.name.endsWith(".ts") ? [path] : [];
    }),
  );
  return nested.flat();
}

describe("Clean Architecture boundaries", () => {
  it.each(["domain", "application"])("keeps %s independent of concrete adapters", async (layer) => {
    const directory = join(process.cwd(), "apps", "api", "src", layer);
    const files = await TypeScriptFiles(directory);
    const violations: string[] = [];

    for (const file of files) {
      const source = await readFile(file, "utf8");
      if (FORBIDDEN_IMPORT.test(source)) {
        violations.push(file);
      }
    }

    expect(violations).toEqual([]);
  });
});
