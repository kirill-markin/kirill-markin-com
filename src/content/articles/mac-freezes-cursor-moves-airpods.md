---
title: "My Mac Froze but the Cursor Still Moved. Were AirPods Involved?"
date: 2026-11-10
description: "My Mac froze while the cursor still moved. Turning off Bluetooth helped. Try a quick AirPods case test and check WindowServer for render timeouts."
tags: [macos, bluetooth, debugging]
publish: true
thumbnailUrl: "https://hjg7utvb61vbii2b.public.blob.vercel-storage.com/marketing/32406863e1d52a2cd0d18f27445bb3ff38f53354832b236b06fc4b5aa8cf8b58.webp"
language: "en"
keywords: [Mac freezes but cursor still moves, AirPods Mac freezing, WindowServer render timeout]
---

# My Mac Froze but the Cursor Still Moved. Were AirPods Involved?

App animations on my MacBook Pro kept freezing for several seconds at a time. The cursor still moved across the built-in screen. It happened in multiple apps, even after I disconnected Screen Sharing and switched the display to 60 Hz. When I turned off Bluetooth, the visible freezes stopped. I didn't have to restart.

My AirPods Pro were sitting on the table, out of their case. I put them away and turned Bluetooth back on. The Mac felt normal again. Since I changed both things, I still don't know what putting the AirPods away would have done on its own.

![A hand closes an earbud case beside three identical animation frames and a red paper cursor](https://hjg7utvb61vbii2b.public.blob.vercel-storage.com/marketing/32406863e1d52a2cd0d18f27445bb3ff38f53354832b236b06fc4b5aa8cf8b58.webp)

## Try putting the AirPods away with Bluetooth still on

If the cursor still moves while your apps freeze and your AirPods are out of their case, try changing one thing at a time.

1. Note the time of a freeze and what you were doing when it happened.
2. Put the AirPods in their case, close the lid, and leave Bluetooth on. Keep your apps and display settings as they are. Repeat the action that was freezing for a minute or two.
3. If the freezes continue, briefly switch off Bluetooth in **System Settings → Bluetooth** and repeat the same action. Use the MacBook's keyboard and trackpad or have wired input ready. Turn Bluetooth back on after the comparison. [Apple's Bluetooth instructions](https://support.apple.com/en-za/guide/mac-help/blth1008/mac)

A quiet minute is a clue. If the freezes return, repeat the comparison while they're happening and see whether the same change helps again.

If the freezes repeatedly coincide with your AirPods switching to the Mac, you can try disabling automatic switching as a separate test. I haven't tried that for these freezes. [Apple's AirPods switching instructions](https://support.apple.com/en-ie/104988)

## What the WindowServer logs showed

This happened on November 10, 2026, on an M5 Pro MacBook Pro running macOS 27.2 (build 26B123). Codex compared the changes I made with messages from WindowServer, the macOS process that puts app windows on screen. The recurring message was `synchronize timed out`.

| Local time | What changed | What the log showed |
| --- | --- | --- |
| 10:23:39 | Screen Sharing disconnected | Dozens of timeout lines in the following minute. |
| 10:25:27 | I switched from ProMotion to fixed 60 Hz | 13 timeout lines in the previous 30 seconds and 11 in the next 30. I could still see freezes. |
| 10:28:40 | I turned off Bluetooth | The visible freezes stopped. The log stayed clear of timeouts through 10:30:26, including after I restored ProMotion at 10:29:41. |
| 10:32:59 | The next burst began | 17 timeout lines in under a second, just before Bluetooth came back on. |
| 10:33:03 | Bluetooth logged `PoweredOn` after I put the AirPods away | No more timeout lines through 10:34:08. |

Those are counts of log lines. One stall can produce several. The last check after Bluetooth came back on lasted about a minute.

While Bluetooth was on, a Bluetooth audio service called `audioaccessoryd` was restarting in a second, inactive login session about every ten seconds. In recurring cycles, a related login event came about a second before a WindowServer timeout. One cycle logged “Incoming connection is out of ear.” The device behind that message is still unknown. The service also restarted during quiet periods, including after I turned off Bluetooth.

There's an older firsthand report of a MacBook Pro lagging when its owner opened an AirPods case. In that case the cursor slowed down too. [AirPods turn my Mac laggy](https://apple.stackexchange.com/questions/458088/airpods-turn-my-mac-laggy)

## Check your own freeze times in Terminal

Use the time of a visible freeze to look for the same WindowServer message. Replace the example times with your own before-and-after windows of equal length and run the command once for each. It reads logs without changing settings.

```bash
/usr/bin/log show --style compact \
  --start "2026-11-10 10:24:57" --end "2026-11-10 10:25:27" \
  --predicate 'process == "WindowServer" AND eventMessage CONTAINS[c] "synchronize timed out"'
```

If lines cluster around the times you wrote down, compare those bursts across the two windows. If the freezes keep happening without matching lines, use the visible stalls to judge your test.

*I experienced the freezes and made the changes above. Codex helped analyze the macOS logs, research related reports, and write this article.*
