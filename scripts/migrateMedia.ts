import { readFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { MEDIA_ROOTS, validateMediaPublicPath } from "../src/lib/marketingMedia";
import { assertAvailablePath, inspectMedia, listMediaFiles, readMediaManifest, writeMediaManifest } from "./mediaFiles";
import { printMedia, publishMedia, runMediaCommand } from "./mediaUpload";

void runMediaCommand(async (token) => {
  if (process.argv.length !== 2) throw new Error("Usage: npm run media:migrate");
  const publicRoot = resolve("public");
  let manifest = await readMediaManifest();
  for (const directory of MEDIA_ROOTS) {
    for (const file of await listMediaFiles(join(publicRoot, directory))) {
      const publicPath = validateMediaPublicPath(`/${relative(publicRoot, file).split(sep).join("/")}`);
      const original = await inspectMedia(await readFile(file));
      const existing = assertAvailablePath(manifest, publicPath, original.sha256);
      if (existing !== undefined) {
        if (existing.original !== undefined || existing.sha256 !== original.sha256) {
          throw new Error(`Migration requires byte-for-byte delivery at ${publicPath}; an optimized mapping already exists.`);
        }
        continue;
      }
      const entry = await publishMedia(publicPath, original, original, token);
      manifest = [...manifest, entry];
      await writeMediaManifest(manifest);
      printMedia(entry);
    }
  }
});
