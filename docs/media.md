# Media publishing

## Upload access

Use Node 24 and `npm ci`. The dedicated public Vercel Blob store `store_HJg7utVB61vbii2b` belongs to this website. Put its `BLOB_READ_WRITE_TOKEN` in `.env.media.local` in the main checkout with permissions `0600`; never commit it. Commands locate this file through Git's common directory from any worktree. An explicitly supplied `BLOB_READ_WRITE_TOKEN` takes precedence. Builds and public downloads need no upload credentials.

## Add and replace

```sh
npm run media:add -- /absolute/path/article.png
npm run media:add -- /absolute/path/portrait.png /avatars/new-portrait.webp
npm run media:add -- /absolute/path/resume.pdf /data/new-resume.pdf
npm run media:replace -- /absolute/path/updated-portrait.png /avatars/new-portrait.webp
```

Add defaults to `/articles/<filename>.webp` for images and `/articles/<filename>.pdf` for PDFs. Logical paths can be nested under `/articles`, `/avatars`, `/services`, `/images`, `/data` and `/samo-danni-eood/google-play-developer`. Add rejects an existing mapping with different original bytes. If an unmapped logical path already has a local file, run `npm run media:migrate` first. Replace requires an existing mapping and changes only that mapping.

Images retain the exact original in Blob and publish an auto-oriented WebP at quality 85 without resizing. Animated and multipage images are rejected by add and replace. PDFs are published byte-for-byte with `application/pdf` and retain `.pdf` logical paths; they have no image dimensions. Keep source files outside Git.

The printed JSON includes the usable public `url`, SHA-256, byte count, image dimensions, and `original` when the delivery differs. Use the Blob URL in new content. Commit the sorted `src/content/media-manifest.json` with the content change. Objects use content-hash paths, reject overwrites and have a one-year cache lifetime. Every object's public download is checksum-verified before recording it.

To roll back a replacement, restore the prior manifest mapping and any direct content URL from Git, then deploy. Previous Blob objects remain available. Concurrent upload commands in the same checkout are rejected; remove `.generated/media-publishing.lock` after an interrupted process only after confirming that process has stopped.

## Import existing media

```sh
npm run media:migrate
```

Import recursively publishes raster images and PDFs from the managed roots byte-for-byte. It saves the manifest after each completed file; rerunning resumes and rejects conflicting mappings. Import never removes source files. SVGs, HTML, datasets, favicons, logos, icons and other retained brand assets stay in Git. Remove local media only after the manifest mapping, public checksum and website delivery integration have been verified. Website builds read the tracked manifest without downloading media or loading upload credentials.
