import { readFile, readdir } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

const dependencyStore = join(process.cwd(), "node_modules", ".pnpm");
const blockedLicensePattern = /(?:^|\W)(?:AGPL|GPL-3\.0|UNLICENSED|UNKNOWN)(?:$|\W)/iu;
const dependencies = new Map();

function isInstalledPackageManifest(manifestPath) {
  const packageDirectory = dirname(manifestPath);
  const parentDirectory = dirname(packageDirectory);
  if (basename(parentDirectory) === "node_modules") {
    return true;
  }
  return (
    basename(parentDirectory).startsWith("@") &&
    basename(dirname(parentDirectory)) === "node_modules"
  );
}

async function inspectDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        await inspectDirectory(entryPath);
        return;
      }

      if (!entry.isFile() || entry.name !== "package.json") {
        return;
      }

      if (!isInstalledPackageManifest(entryPath)) {
        return;
      }

      const manifest = JSON.parse(await readFile(entryPath, "utf8"));
      if (typeof manifest.name !== "string" || typeof manifest.version !== "string") {
        return;
      }

      const license = typeof manifest.license === "string" ? manifest.license : "UNKNOWN";
      dependencies.set(`${manifest.name}@${manifest.version}`, license);
    }),
  );
}

await inspectDirectory(dependencyStore);

const violations = [...dependencies.entries()]
  .filter(([, license]) => blockedLicensePattern.test(license))
  .map(([dependency, license]) => `${dependency}: ${license}`)
  .sort();

if (violations.length > 0) {
  throw new Error(`Blocked or unknown dependency licenses:\n${violations.join("\n")}`);
}

console.log(`Dependency license policy passed for ${dependencies.size} installed packages.`);
