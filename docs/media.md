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

## Delivery and compatibility

Each managed logical path issues an exact 307 redirect to its original Blob object (`original.url` when present, otherwise `url`), preserving the original bytes and file type at existing URLs. These aliases use `Cache-Control: public, max-age=0, must-revalidate`; PDFs retain PDF bytes and content type. Replacement updates the alias after deploying the changed manifest while previous immutable objects remain available.

Rendered HTML, article metadata, JSON-LD, Markdown media links and image optimization resolve managed sources to the immutable delivery URL through `src/lib/mediaUrls.ts`. Use `resolveMediaUrl` for a new managed image consumer so replacements also change optimized image URLs; manifest dimensions replace local-file reads. Builds require neither local managed media nor upload credentials. The Blob CDN serves immutable objects with a one-year cache lifetime. Compatibility routing leaves localized routes and HTML/Markdown negotiation intact.

## Git safeguards

With Node 24, opt in once per clone:

```sh
npm run media:hooks
```

The installer copies the guard and hooks into the Git common directory and sets an absolute repository-local `core.hooksPath`. All existing worktrees use that shared copy, including checkouts without these scripts. Rerun the command from a current checkout after guard updates to refresh the shared copy. It does not change worktree files, branches or staged changes, and never runs automatically during dependency installation.

Existing custom hook paths and all executable non-sample default hooks are preserved: the installer refuses to replace them. To chain the guard manually, use an absolute path to `scripts/checkMediaGit.ts` in a maintained checkout:

```sh
node /absolute/path/to/current-checkout/scripts/checkMediaGit.ts staged
node /absolute/path/to/current-checkout/scripts/checkMediaGit.ts pre-push "$@"
```

Run these from the working tree root. The pre-push command must receive Git's original stdin; if another hook consumes stdin, capture it once and pass identical bytes to both checks. Retain existing hook behavior and propagate each command's failure.

Pre-commit checks staged blobs, even when working files differ. Pre-push checks every nondeleted ref update against locally available server-advertised history. Fetch first if the server's previous tip is unavailable. Local branches are never trusted exclusions. Existing historical media and deletions pass; adding a prohibited blob and deleting it in a later introduced commit still fails. Remove it from every introduced commit before retrying.

The guard rejects raster, audio, video, archive and PDF extensions, common media signatures under any filename, binary files over 32 KiB, and any file over 2 MiB. Existing favicon, logo and social assets have explicit per-path ceilings in [the guard](../scripts/checkMediaGit.ts), rounded up from their current sizes to the next KiB; this exception does not cover new filenames. SVGs and small font sources remain in Git.

To inspect a staged change or a complete proposed range manually:

```sh
npm run media:check -- staged
npm run media:check -- commits <full-base-sha> <full-head-sha>
```

The `Media Git guard` Actions job runs integration tests and checks every introduced commit against the explicitly fetched PR base or push event's previous SHA, including across rewrites. Local hooks are bypassable; Actions gates merges but cannot reject an already accepted branch push.

## Protected delivery

Use a PR to `main`. Require passing `validate-metadata`, `publishing` and `Media Git guard` checks plus a successful Vercel preview before merging, including for administrators; disable admin bypass, direct pushes and force pushes. Production deploys automatically from `main`; do not run Vercel CLI deploys.

After a coordinated history rewrite, retain local changes and worktrees until their owner exports intended source changes. Reapply reviewed source patches on rewritten `origin/main` or a fresh clone. Do not merge or push old ancestry: the guard rejects its removed media even when the final tree is clean.
