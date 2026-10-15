import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import sharp from "sharp";
import { MEDIA_ROOTS, parseMediaManifest, validateMediaPublicPath, type MarketingMedia } from "../src/lib/marketingMedia";
import { assertAvailablePath, assertUnoccupiedLocalPath, checksum, inspectMedia, listMediaFiles, prepareMedia } from "./mediaFiles";

const sha256 = "a".repeat(64);
const entry: MarketingMedia = {
  publicPath: "/articles/article.png",
  url: `https://example.public.blob.vercel-storage.com/marketing/${sha256}.png`,
  width: 10, height: 20, sha256, bytes: 100,
};

test("manifest validates managed roots, immutable hashes and image dimensions", () => {
  for (const root of MEDIA_ROOTS) {
    assert.equal(validateMediaPublicPath(`/${root}/nested/media.webp`), `/${root}/nested/media.webp`);
  }
  assert.deepEqual(parseMediaManifest([entry]), [entry]);
  assert.throws(() => parseMediaManifest([entry, entry]), /Duplicate media public path/);
  assert.throws(() => parseMediaManifest([{ ...entry, width: undefined, height: undefined }]), /dimensions/);
  assert.throws(() => parseMediaManifest([{ ...entry, width: 0 }]), /dimensions/);
  assert.throws(() => parseMediaManifest([{ ...entry, bytes: 0 }]), /byte count/);
  assert.throws(() => parseMediaManifest([{ ...entry, url: "https://example.com/image.png" }]), /Blob URL/);
  assert.throws(() => parseMediaManifest([{ ...entry, url: entry.url.replace(sha256, "b".repeat(64)) }]), /Blob URL/);
  assert.throws(() => validateMediaPublicPath("/articles/../image.png"), /public path/);
  assert.throws(() => validateMediaPublicPath("/logos/image.png"), /public path/);
});

test("only PDFs may omit dimensions and PDF logical paths retain PDF delivery", () => {
  const pdf = { publicPath: "/data/resume.pdf", url: entry.url.replace(".png", ".pdf"), sha256, bytes: 100 };
  assert.deepEqual(parseMediaManifest([pdf]), [pdf]);
  assert.throws(() => parseMediaManifest([{ ...pdf, width: 1 }]), /dimensions/);
  assert.throws(() => parseMediaManifest([{ ...pdf, publicPath: "/data/resume.png" }]), /PDF bytes/);
  assert.throws(() => parseMediaManifest([{ ...entry, publicPath: "/data/resume.pdf" }]), /PDF bytes/);
});

test("add compares preserved original bytes and rejects conflicting logical paths", () => {
  const original = { ...entry, sha256: "b".repeat(64), url: entry.url.replace(sha256, "b".repeat(64)) };
  const optimized = { ...entry, original };
  assert.equal(assertAvailablePath([optimized], entry.publicPath, original.sha256), optimized);
  assert.throws(() => assertAvailablePath([optimized], entry.publicPath, entry.sha256), /different content/);
  assert.equal(assertAvailablePath([entry], "/articles/new.png", sha256), undefined);
});

test("add rejects an unimported local asset before claiming its empty-manifest path", async () => {
  const directory = await mkdtemp(join(tmpdir(), "media-occupancy-"));
  try {
    const publicPath = "/avatars/portrait.webp";
    const file = join(directory, publicPath);
    await mkdir(join(directory, "avatars"));
    await writeFile(file, "existing original bytes");
    assert.equal(assertAvailablePath([], publicPath, sha256), undefined);
    await assert.rejects(assertUnoccupiedLocalPath(directory, publicPath), /Run npm run media:migrate/);
    assert.equal(await readFile(file, "utf8"), "existing original bytes");
    await assertUnoccupiedLocalPath(directory, "/avatars/new-portrait.webp");
  } finally {
    await rm(directory, { recursive: true });
  }
});

test("publishing preparation preserves originals, orients WebP and keeps PDF bytes exact", async () => {
  const directory = await mkdtemp(join(tmpdir(), "media-publishing-"));
  try {
    const imagePath = join(directory, "source.jpg");
    const data = await sharp({ create: { width: 7, height: 11, channels: 3, background: "red" } })
      .jpeg().withMetadata({ orientation: 6 }).toBuffer();
    await writeFile(imagePath, data);
    const { original, delivery } = await prepareMedia(imagePath);
    assert.deepEqual(original.data, data);
    assert.deepEqual(await readFile(imagePath), data);
    assert.equal(original.sha256, checksum(data));
    assert.equal(delivery.extension, "webp");
    assert.equal(delivery.width, 11);
    assert.equal(delivery.height, 7);
    assert.equal(delivery.sha256, checksum(delivery.data));
    const pdfPath = join(directory, "resume.pdf");
    const pdf = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n");
    await writeFile(pdfPath, pdf);
    const prepared = await prepareMedia(pdfPath);
    assert.equal(prepared.original, prepared.delivery);
    assert.deepEqual(prepared.delivery.data, pdf);
    assert.equal(prepared.delivery.contentType, "application/pdf");
    assert.equal(prepared.delivery.sha256, checksum(pdf));
    assert.equal(prepared.delivery.width, undefined);
    assert.equal((await inspectMedia(data)).data, data);
  } finally {
    await rm(directory, { recursive: true });
  }
});

test("migration discovers nested rasters and PDFs while retaining other assets", async () => {
  const directory = await mkdtemp(join(tmpdir(), "media-inventory-"));
  try {
    await mkdir(join(directory, "nested"));
    for (const file of ["image.PNG", "nested/resume.pdf", "icon.svg", "data.csv", "preview.html"]) {
      await writeFile(join(directory, file), "fixture");
    }
    assert.deepEqual(await listMediaFiles(directory), [join(directory, "image.PNG"), join(directory, "nested/resume.pdf")]);
    assert.deepEqual(await listMediaFiles(join(directory, "missing")), []);
  } finally {
    await rm(directory, { recursive: true });
  }
});
