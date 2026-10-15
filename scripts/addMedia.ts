import { basename, extname, resolve } from "node:path";
import { validateMediaPublicPath } from "../src/lib/marketingMedia";
import { assertAvailablePath, assertUnoccupiedLocalPath, prepareMedia, readMediaManifest, writeMediaManifest } from "./mediaFiles";
import { printMedia, publishMedia, runMediaCommand } from "./mediaUpload";

void runMediaCommand(async (token) => {
  const [file, requestedPath, ...extra] = process.argv.slice(2);
  if (!file || extra.length > 0) {
    throw new Error("Usage: npm run media:add -- <file> [public-path]");
  }
  const { original, delivery } = await prepareMedia(file);
  const publicPath = validateMediaPublicPath(requestedPath ?? `/articles/${basename(file, extname(file))}.${delivery.extension}`);
  const manifest = await readMediaManifest();
  const existing = assertAvailablePath(manifest, publicPath, original.sha256);
  if (existing !== undefined) {
    printMedia(existing);
    return;
  }
  await assertUnoccupiedLocalPath(resolve("public"), publicPath);
  const entry = await publishMedia(publicPath, original, delivery, token);
  await writeMediaManifest([...manifest, entry]);
  printMedia(entry);
});
