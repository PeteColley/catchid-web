# Minimal manual capture procedure

**CRO-07A update, 19 November 2026:** the three priority captures have now been obtained on one fresh, healthy **API 35 Google APIs Pixel 5**, using the exact verified APK, standard 1080 × 2340/density 440 and this sample procedure. No API 34 fallback was needed. See [performed steps, originals and caveats](RECOVERY_07A.md). The API 36 recommendation below is preserved as historical planning and was superseded by Pete's explicit API 35-first recovery instruction. No further capture is the recommended next action; review and asset acceptance come next.

## Original CRO-07 procedure — historical plan

Use this only on a **new, healthy disposable emulator**. Do not use Pete's phone, an existing journal, the failed CRO-07 AVD, a signed release build, or a real Google account. This is the remaining capture procedure, **not a record of work already performed**.

## Prepare once

1. On a host with a healthy Android emulator, create a fresh API 36 Google APIs phone profile named `CatchID_CRO07_Manual`, approximately 390dp wide (preferred 1170 × 2532 pixels at density 480), portrait and default font scale. Use new userdata; do not clone another AVD or use `-wipe-data` on an existing one. Wait for a responsive launcher with no ANR/dialog and a quiet startup-error check. If it fails, stop; do not dismiss recurring system failures to obtain screenshots.
2. Identify that emulator's serial explicitly. Verify `adb -s SERIAL shell getprop ro.boot.qemu.avd_name` returns the new name. Check accounts are zero with `dumpsys account`, and `pm list packages com.catchid.app` returns nothing. Never install over an existing CatchID installation.
3. Enable airplane mode and disable Wi-Fi/mobile data **before app installation**. Verify airplane mode is `1` and `dumpsys connectivity` reports `Active default network: none`. Commands must succeed on the healthy guest; leave the emulator offline through capture and shutdown. Do not sign in or enable Journal Protection.
4. Use the already-built local APK in [provenance](SCREENSHOT_PROVENANCE.md), after verifying SHA-256 `94248cacfef23ef021dd75c4ffe38879ea5310ade42852227215ce62ddc4d3ac`. Install only on that new empty serial with `adb -s SERIAL install APP_DEBUG_APK` (no replacement flags). If another host rebuilds, use exact source `9e9b37e9dfdc2554321602bfbada2e18227d34e7`, JBR 21, `gradlew :app:assembleDebug -PcatchidPlaytest=true -PjournalCloudEnabled=false`; record its actual new hash and verify the generated/packaged privacy flags again. Do not reuse the release AAB or change application code.

## Capture the two priority flows

5. Open the normal **CatchID Playtest** launcher / `.MainActivity`. Do not open seeders, fixtures, diagnostic activities, photo selection, identification, ads, sharing or account controls. Wait for normal Home content and no popup. Tap **Add without a photo**; preserve the real **Save catch** title.
6. Enter this **controlled demonstration record** using the normal fields: Brown Trout; 18 November 2026, 09:20; free-text location `Riverside` (fictional, no coordinates); Fly method / Dry fly detail; weight 0.75 kg; optional length 34 cm; optional note `Dry fly in a shallow run.` This is invented sample data entered through genuine UI, not an actual user's catch. Record the exact values used if the real controls require a variation. Never edit screenshot pixels to match this example.
7. Dismiss the keyboard normally and capture the upper form with its title/species/date/time. Scroll naturally and capture the lower form with fishing details, weight/other fields and the real **Save catch** button. Use the planned filenames `save-catch-no-photo-upper-1170x2532.png` and `save-catch-no-photo-lower-1170x2532.png` only if their dimensions actually match. Do not stitch or resize. If two viewports cannot cover required details, retain an additional original continuation and explain the scroll positions.
8. Tap **Save catch**, wait for successful persistence, open that record from **Catch Journal**, and capture the genuine read-only **Catch details** screen. Retain `catch-details-no-photo-1170x2532.png`; add a separate continuation only if needed for meaningful fields/navigation. Do not conceal the actual No photo recorded state. Reopen the record once to verify persistence. Do not press Share/Delete/Protect journal.
9. Save untouched PNG bytes with `adb -s SERIAL exec-out screencap -p` using a binary-safe output mechanism (PowerShell 7.4+ native redirection or Node/Python binary subprocess output). Avoid Windows PowerShell 5 text redirection. Record capture timestamp, dimensions, SHA-256, APK hash/source, Android version, profile and sample data. Do not capture the emulator window/frame, notifications, keyboard, errors or incomplete content.

The required eventual caption is **“Actual CatchID UI · controlled demonstration data · no photo required”**, with current-source/Production qualification in the review record until the release claim is verified. Pete/ChatGPT must accept the images and caption treatment before integration. Length/Notes must not be advertised as verified Production 1.2.12 features.

## Finish without expanding the task

Stop after the priority form/detail captures. A few additional no-photo journal entries may be useful for comparison only if easy; do not create ten-plus records merely to replace the approved Insights examples. Any refreshed Insights must be calculated by the running app. Retain historical ID artwork; never call live identification for this task. Confirm offline/no-account state again, force-stop the task installation if needed, and normally stop the **new** emulator. Preserve originals and local sample data for review; never reconnect that sample profile to a real account.

Return the originals and provenance for review. No website integration, Android push, production release or deployment is part of these steps.
