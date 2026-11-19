# CID-WEB-CRO-07A — product screenshot capture recovered

**CAPTURED: 3 genuine product originals / PUSHED / REVIEW CANDIDATES / NOT LIVE.** 19 November 2026. Capture only, on the existing `codex/cid-web-cro-07-product-captures` branch from `b900647065944f7751514a44adf2ad70607d4c4c`. No website integration.

## Result and exact originals

| Original | UTC capture time | Size | What it demonstrates |
| --- | --- | --- | --- |
| [Save catch — upper](captures/save-catch-no-photo-upper-1080x2340.png) | 23:08:17.394 | 1080 × 2340; 174,773 bytes | Real Save catch title, No photo recorded, Brown Trout, date/time, optional location and Fly selection. |
| [Save catch — lower](captures/save-catch-no-photo-lower-1080x2340.png) | 23:07:56.252 | 1080 × 2340; 145,653 bytes | Same unsaved draft: 0.75 kg, 34 cm, actual note, Save catch and Cancel. |
| [Catch details — saved no-photo catch](captures/catch-details-no-photo-1080x2340.png) | 23:10:02.737 | 1080 × 2340; 112,135 bytes | Real read-only saved record, No photo recorded, User entered, all sample values, note and Edit catch. |

The lower view was captured first, then the upper view of the same completed draft. The catch was saved once through **Save catch**, appeared in **Catch Journal** with a **Catch saved** confirmation, and was opened and reopened through its journal row. No Edit, Share, Delete, identification, account or advertising control was used. Exactly one demonstration catch exists in this isolated installation.

These are untouched, binary-safe `adb exec-out screencap -p` PNGs from the running application. No crop, resize, stitching, retouching, generated UI, fixture activity, seeder or database modification was used. [Manifest with hashes](evidence/recovery-07a/captures.json), [UI action log](evidence/recovery-07a/ui-actions.jsonl), [offline gallery](index.html).

## Source, APK and emulator provenance

- APK reused without rebuilding: `app-debug.apk`, 23,569,575 bytes, SHA-256 **`94248cacfef23ef021dd75c4ffe38879ea5310ade42852227215ce62ddc4d3ac`**. Package `com.catchid.app`, label CatchID Playtest, version **1.2.15 / 35**, debug, target API 36/minimum 26. Original source **`9e9b37e9dfdc2554321602bfbada2e18227d34e7`**; prior JBR 21 build and packaged privacy evidence remain in CRO-07.
- `catchidPlaytest=true`, `journalCloudEnabled=false`; Analytics deactivated, Crashlytics collection false, no-op app observability. This build is **not an ads-off build**. Fresh offline consent state prevents the normal ad gate opening; no SDK ad-request diagnostics or visible ads occurred.
- Current remote Android main **`35cbf6d562d6f42906e33c5c7be95d0b95800ad7`** differs from APK source only in PROJECT_STATUS. Current AGENTS blob `edaa7694c58fd4e855dba2ac8e63bb46eb357353`; status blob `a811c048466f36fe8f6f505e481ca2ce7db08a45`. The new continuity explicitly records **Pete's owner confirmation of 1.2.15/35 Production**, without a new direct Console readback. The captures prove this identified source/build's UI, not a Play-delivered installation.
- One fresh **Android 15 / API 35 Google APIs x86_64 revision 9**, standard **Pixel 5**, 1080 × 2340 pixels, density 440 (about 393dp wide), font scale 1.0, English UI with 12-hour time formatting, Europe/London timezone. The light palette is the app's actual source-defined palette; no theme or app style was changed for capture.
- Name `CatchID_CRO07A_API35_20261119`, serial `emulator-5570`. Entirely new userdata and AVD registry under the separate local `cro07a-runtime` directory. Existing emulator 37.1.11.0/build 15917651 and command-line tools were copied into that task directory; existing JBR 21 was reused. No tooling upgrade or existing-AVD modification. Standard 2 GB RAM/four-core phone profile; WHPX, automatic GPU, snapshots disabled, hidden host window.
- Official image: `https://dl.google.com/android/repository/sys-img/google_apis/x86_64-35_r09.zip`, 1,738,815,903 bytes, repository-manifest SHA-1 **`0103e6dab21290c4b9d16550a3ce99476f884eef`**, verified before extraction. [Environment receipt](evidence/recovery-07a/orientation.json), [AVD configuration](evidence/recovery-07a/api35-config.ini).

## Controlled demonstration dataset and rights

Brown Trout; **18 November 2026 at 09:20 Europe/London**; free-text **Riverside** (fictional, no coordinates); method **Fly**, detail **Dry fly**; **0.75 kg**; **34 cm**; note **Dry fly in a shallow run.** No photograph. The visible **User entered** label is genuine app output; it does not mean a real customer's catch.

Required review/eventual marketing disclosure: **“Actual CatchID UI · controlled demonstration data · no photo required.”** No private journal, personal email, home address, coordinates, account or externally sourced fish image is present. The no-photo illustration belongs to the unchanged app UI. These captures do not introduce a third-party photograph or an endorsement. Owner selection, accurate captioning and final use/rights acceptance remain separate from capture; existing historical-image rights notes remain applicable to those older assets.

## Verification and bounded recovery

API 35 launched at 22:59:30 UTC and first observed boot-complete at 23:00:55. A normal launcher and responsive app drawer were observed before installation. No ANR or crash events were present. The failed API 36 AVD was not reused; API 34 was unnecessary and was neither downloaded nor created.

The emulator launched with an unreachable local TCP proxy and local-only DNS. Before installing CatchID, airplane mode was enabled and Wi-Fi/data disabled. The first strict preinstall assertion stopped because the generic `mobile_data` preference remained 1, despite airplane mode and the radio being powered off. Only this fresh guest's data preferences were explicitly set to 0, the supported data-disable command was repeated, and **all assertions passed before installation**. Network disconnection was allowed to settle from an initial transient default network to **none**. No app was installed during either preliminary check.

[Preinstall gate](evidence/recovery-07a/preinstall-gate.json): no active default network, Wi-Fi disabled, mobile data 0, airplane 1, zero accounts, zero third-party packages, CatchID absent, correct APK hash, no system errors. [Install](evidence/recovery-07a/install.log) and normal MainActivity [launch](evidence/recovery-07a/launch-app.log) succeeded. The built-in UMP consent request failed offline as expected; [bounded log extract](evidence/recovery-07a/ump-offline.txt). No consent bypass was used.

[Post-capture gate](evidence/recovery-07a/postcapture-gate.json): still offline, zero accounts, only CatchID as a third-party package; zero ANR/crash events, empty AndroidRuntime error buffer, no CatchIdTestAds request/impression diagnostics. This is focused runtime evidence, not a packet-capture proof of every OS network attempt. No real ad impression/click, identification call, sign-in, Firebase journal sync or upload was performed. Cloud-disabled source and the offline runtime boundary are both retained.

CatchID was force-stopped, then the new emulator shut down normally at 23:10:57. Serial and task emulator processes were verified absent at 23:11:23; [shutdown receipt](evidence/recovery-07a/shutdown-verified.json). Local sample userdata remains offline and preserved. Existing emulators, private phone, all older evidence and unrelated dirty work remain untouched.

No build or test suite was rerun: the exact prior APK was reused, and no Android/website application file changed. Focused image decoding/hash/dimension, source/evidence-preservation, local-link and gallery checks are recorded in [recovery verification](evidence/recovery-07a/verification.json). The old `verify-review.mjs` and its zero-capture results are preserved as the initial-attempt record; use [verify-recovery.mjs](verify-recovery.mjs) for this recovery.

The updated gallery was browser-rendered locally at 1280 × 720: all eight images loaded, including the three new originals at the recorded dimensions; no horizontal overflow or scripts. The three capture columns/captions were visually inspected. The task tab and loopback-only server were closed/stopped; [browser receipt](evidence/recovery-07a/gallery-browser-check.json). This is not a public preview.

## Remote delivery receipt

Capture pack **`a66086c23c14513c778a46262c8a0d41362809ec`** was committed and pushed normally to the authorized review branch. Remote SHA matched; clean worktree and upstream `0 0`. GitHub readback matched the local Git blobs for this recovery handover (`c92b3ea29c727ebd3f245a544e11e2d24f348a9f`), gallery (`deba75ae3a56860fe98d58620fd5cbbdf92d1934`), capture manifest (`f767e63f71ffa96b257187bf125e2426b9c9e0b9`) and root status (`879fce83e5bc71be954e59e2a17283431517e686`). All three remote PNG blobs and byte sizes matched: upper `0f367013c41149751cc4602a179ca2d67c7ef29b`, lower `3002ec45767d27e0c88cad951a6427d4c5985dc9`, details `d907694c0514331b559430e2a1a9bf09af675a8e`.

The branch's Actions query returned **zero runs**. Website main remained `42c997c13712a432c8e2384915aaa010a16d068b`, CRO-06 remained `8d0731f361b94a81523bfe07f528b7fdb365ccb4`, and Android main remained `35cbf6d562d6f42906e33c5c7be95d0b95800ad7`. This subsequent documentation-only commit records the receipt; the final response provides its final SHA. No merge, dispatch, deployment or public preview was performed.

## Sceptical self-review and remaining gates

All three originals were visually inspected after capture. Actual labels/values match the single sample; text is readable, keyboard dismissed, and no error dialog, ad, private data or emulator host frame obscures the UI. A small Android system-notification icon remains in the original status bar; no notification content is shown or edited out.

These are complete screen captures of **natural scroll positions**, not complete-page composites. The upper form continues below the viewport into the fly selector; the lower begins at measurements. Dry fly is independently visible in the saved details. Details is scrolled enough to show the full note and Edit catch; the decorative upper portion of the no-photo placeholder is naturally offscreen, while **No photo recorded** remains clearly visible. Share/Delete are below this viewport and were not used. The lower form retains a genuine note-field focus/caret. These presentation limits should be considered during selection; no pixels were altered to conceal them.

The acquisition blocker is resolved for these three review candidates. They have not been accepted for website integration or publication. Existing Journal/Insights/ID historical-image fidelity and rights acceptance, independent Production evidence, the remaining CRO-06 browser/physical-device/screen-reader checks, and separate publication authorization remain open. No website redesign, source edit, merge, deployment, public preview, Android code/version change, Play change or release occurred; catchid.app remains untouched.

**One recommended next action:** Pete and ChatGPT review these three originals and approve the selected assets and demonstration-data captions before separately authorizing website integration.
