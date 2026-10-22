---
title: "Photo Culling on Mac Without a Catalog: Louppe Workflow"
date: 2026-10-22
description: "A folder-based photo culling workflow for Mac with free, open-source Louppe: review locally, save decisions, and copy JPEG or RAW keepers to a new folder."
tags: [productivity]
publish: true
thumbnailUrl: "/articles/louppe-folder-workflow.svg"
language: "en"
keywords: [photo culling Mac, folder-based photo workflow, Louppe, JPEG photo selection]
---

# Photo Culling on Mac Without a Catalog: Louppe Workflow

A folder of photographs can be the starting point and the handoff format for a photo-selection workflow. Open the folder, choose the frames worth keeping, and copy those files to another folder. The next application receives ordinary images it can open directly.

[Louppe](https://louppe.eu/) is a free, open-source photo viewer and manual culling app that supports this approach on Mac. It works locally, without importing the shoot into a photo library or uploading photographs for review. It requires an Apple silicon Mac running macOS 14 or later; Intel Macs and Windows are unsupported.

**Disclosure:** Alex Markin, Louppe's creator, supplied the workflow material and screenshots. This article was prepared with AI assistance.

## Three parts of a folder-based photo workflow

There are three separate things to preserve:

1. **Source photographs:** the JPEG or RAW files copied from the camera, with a separate backup.
2. **Review decisions:** Louppe's record of Yes, No, stars, and color labels.
3. **Keeper copies:** the files chosen for sharing or further work.

For example, the working layout might look like this:

```text
October walk/
  shoot/
    XT509851.JPG
    XT509860.JPG
    .louppe_session.json
  keepers/
    XT509851.JPG
```

This is an illustrative layout, not an automatic folder structure. Keep the destination outside the source folder so it remains separate from the shoot you are reviewing.

## Review photos locally and keep decisions separate

Open the backed-up shoot folder in Louppe. Grid gives an overview, while Gallery shows one photograph with optional thumbnails and camera information.

![A yellow flower shown in Louppe Gallery, with nearby photographs in the thumbnail browser](https://louppe.eu/media/2026-10-22/guest-gallery.webp)

*Gallery and its thumbnail browser, captured in Louppe 1.10. The purple outline identifies the current photograph.*

With the default shortcuts, **F** marks Yes and **D** marks No. Arrow keys let you revisit a frame. Leave uncertain photographs undecided and return to them. Stars and color labels are optional, independent choices.

Marking No doesn't delete anything. It changes a review decision. Clean Up is a separate command that sends files to macOS Trash, and is unnecessary for a workflow that only copies keepers.

Louppe saves its decisions in `.louppe_session.json` beside the source files. Wait for the save status before disconnecting a drive. Keep the source folder and its session file in your backup.

## Copy a shortlist that another app can open

Filter to Yes and inspect the shortlist. Then open Export, choose **Copy**, and check the matching count and scope. An active selection makes Export start with **All selected**; otherwise it starts with filtered **Keepers (Yes)**. Choose the intended keeper scope explicitly.

![Louppe's Copy preview showing one Yes photograph to copy and 15 undecided photographs excluded](https://louppe.eu/media/2026-10-22/guest-copy.webp)

*This Louppe 1.10 preview includes one keeper and excludes 15 undecided files. The matching count, rather than the folder total, predicts what will be copied.*

Choose a new destination, wait for completion, and inspect the resulting files in Finder. Open a few copies before handing them off. Copy preserves file contents; it doesn't resize JPEGs, convert RAW files, or remove embedded metadata.

The destination is an ordinary folder. A JPEG-only shoot can end here, ready for viewing or sharing. RAW keepers can continue to the photographer's preferred editor. Louppe's [JPEG selection guide](https://louppe.eu/blog/sort-jpeg-photos-mac/) gives the detailed version of the first workflow.

## What travels with the files, and what needs checking?

The image files are portable. Louppe's session format is application-specific and bound to folder identity; copying its JSON file elsewhere is not a universal way to transfer a review.

For ratings in another application, Louppe offers XMP sidecars, but interoperability needs checking with a small batch in the intended editor. Don't assume a Yes/No decision, a star rating, and a color label mean the same thing everywhere. Copying chosen photographs is the simpler handoff when the receiving app only needs the selected files.

RAW editing, exposure adjustments, and color adjustments belong in an editor. Louppe can group RAW+JPEG pairs and provide local analysis tools; the photographer makes the selection decisions.

## A small first run

Try a backed-up folder of 20 photographs. Mark a few keepers, leave some undecided, copy the keepers to a fresh destination, and compare the result with the preview. That checks the important boundary: the files delivered to the next step should match the choices you made.

The [Louppe source and release documentation](https://github.com/murlexander/louppe-media-culler) describe supported formats, file operations, and current limits.
