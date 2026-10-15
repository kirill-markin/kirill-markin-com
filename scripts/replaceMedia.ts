import { validateMediaPublicPath } from "../src/lib/marketingMedia";
import { prepareMedia, readMediaManifest, writeMediaManifest } from "./mediaFiles";
import { printMedia, publishMedia, runMediaCommand } from "./mediaUpload";

void runMediaCommand(async (token) => {
  const [file, requestedPath, ...extra] = process.argv.slice(2);
  if (!file || !requestedPath || extra.length > 0) {
    throw new Error("Usage: npm run media:replace -- <file> <existing-public-path>");
  }
  const publicPath = validateMediaPublicPath(requestedPath);
  const manifest = await readMediaManifest();
  if (!manifest.some((entry) => entry.publicPath === publicPath)) {
    throw new Error(`Cannot replace missing media path: ${publicPath}. Use media:add.`);
  }
  const { original, delivery } = await prepareMedia(file);
  const entry = await publishMedia(publicPath, original, delivery, token);
  await writeMediaManifest(manifest.map((previous) => previous.publicPath === publicPath ? entry : previous));
  printMedia(entry);
});
