# Verification and capture limitation

19 November 2026. **Self-review. No independent reviewer and no new app runtime pass.**

## Build and environment results

| Check | Result |
| --- | --- |
| GitHub orientation | Current Android main/status/AGENTS and website main/CRO-04/05/06 heads read; exact approved CRO-06 baseline verified. Source/blob receipts in [orientation](evidence/source-orientation.json). |
| Worktree preservation | Existing tracked, untracked and ignored work inventoried. Seven unrelated modified/untracked Smart Locations files were hashed; no edits to them. [Inventory](evidence/worktree-orientation.json), [hashes](evidence/preserved-unrelated-files.json). |
| First Android build | **FAIL before compilation**, Android Studio's current JBR 25.0.3 rejected by the existing Gradle/toolchain. [Unmodified failure](evidence/build-jbr25-failure.log). |
| Qualified-JBR retry | **PASS** unchanged source: JBR 21.0.11, `--no-daemon --offline :app:assembleDebug -PcatchidPlaytest=true -PjournalCloudEnabled=false`, 5m34s, 41 executed tasks. Existing compiler/deprecation/native-strip notices retained. [Full log](evidence/build-playtest-jbr21.log). |
| APK identity/privacy | **PASS** package/version 1.2.15/35, debug/playtest, cloud false, Analytics deactivated, Crashlytics false, Google demo ad App ID. [Identity](evidence/build-identity.json), [packaged metadata](evidence/packaged-privacy-extract.txt). This is not an ads-off build. |
| AVD preparation | Original SDK lacked system images/creation tools. Verified official tools/image downloaded to task-only SDK. First AVD create reported missing emulator package; copying the existing emulator package into the isolated SDK resolved creation without overwriting an AVD. Both logs retained. |
| Host acceleration | Sandbox ADB/acceleration checks were unavailable; read-only check outside sandbox found WHPX usable and no connected devices. No host setting was changed. |
| Emulator health | **FAIL before CatchID installation**: fresh API 36 profile logged 9 ANRs and 1 Bluetooth native crash. Boot-complete alone did not establish usability. |
| App installation/runtime/screenshots | **NOT RUN / 0 product captures.** No app installed, no sample dataset, no app navigation or screenshot acceptance. |
| JVM / instrumentation tests | Not rerun: no application code changed. Build result is not test-suite or runtime coverage. Historical release tests are not counted as CRO-07 tests. |
| Website install/check/build/verify | Not rerun: only review documentation/assets and root continuity change. All existing source/config/dependencies/workflow files must match baseline exactly. The historical verifier's CRLF defect was not exercised or claimed fixed. |
| Image verification | Existing five reviewed product sources and the separate diagnostic PNG are decoded and hashed by [verification script](verify-review.mjs). Result: [asset verification](evidence/asset-verification.json). This does not turn a historical asset into a current capture. |
| Offline gallery browser check | PASS at 1280 × 720 in the in-app browser: all five original images loaded at expected dimensions, no horizontal overflow, clear 0-capture/historical labels. Task tab closed and loopback-only server stopped. [Receipt](evidence/gallery-browser-check.json). This is not Android screenshot or website acceptance. |
| Scope / links / whitespace | Automated review-scope, source preservation, unrelated-file hash, local-link and image checks plus `git diff --check`; results in [verification](evidence/review-verification.json). |
| Deployment boundary | Existing workflow triggers only main push or workflow_dispatch. Review branch only; no dispatch, merge, public preview or production modification. Remote readback receipt follows in handover. |

## New emulator failure, without product inference

The first strict raw-byte comparison detected standard Git checkout newline differences in two historical text receipts and HeroPhoto.astro. Each was first proven to differ only by CRLF/LF with unchanged Git content, then restored to the exact clean CRO-06 worktree bytes inside the new checkout. No production Git diff resulted. Final comparison protects all 369 baseline files, including identical consent/source/image bytes. [Checkout receipt](evidence/checkout-byte-preservation.json).

The initial staged whitespace check flagged trailing spaces in the two copied Gradle logs and a final blank line in the image properties. Only that whitespace was normalized in the review copies; original logs/properties remain local and their [original hashes](evidence/text-evidence-original-hashes.json) are retained. Errors, warnings and results were not altered; the final staged check passes.

Fresh `CatchID_CRO07_20261119` launched at 22:29:35 UTC. First observed boot completion was 22:34:20. System UI had already ANR'd at 22:34:10; subsequent phone, Play services and keyboard ANRs continued. The 22:34:48 capture shows **System UI isn't responding** over the launcher. Final buffer contains nine ANRs and a Bluetooth native crash. See [bounded events](evidence/final-health-events.log), [original diagnostic image](evidence/emulator-anr-diagnostic-not-product.png), [UI hierarchy](evidence/emulator-anr-diagnostic-not-product.xml).

No dialog dismissal, recovery reboot, repeated replacement AVD, system repair, data seeding or app installation was used to bypass this result. The environment remained unsuitable for authentic screenshot acquisition. Root cause was not investigated or attributed to CatchID, which was absent. Earlier emulator failures in Android continuity remain historical context; these are new timestamped failures on newly created userdata.

At shutdown: zero accounts, zero third-party packages, CatchID absent, airplane mode 1 and no active default network. The mobile-data disable command also reported missing phone service during startup, so a fully healthy isolation check is not claimed. No CatchID traffic or writes could occur because the app was never installed. [Precheck](evidence/shutdown-precheck.json). Normal shutdown succeeded; serial and task processes were absent at 22:36:20. [Cleanup](evidence/shutdown-verified.json). Local runtime/source artifacts are retained outside Git, not deleted.

## Sceptical conclusions

The two priority capture requirements remain **unmet**. The conditional fallback in the brief is used: authenticate existing evidence, document the concrete blocker and provide the [minimal manual procedure](MANUAL_CAPTURE.md). A clean Git push will complete delivery of this bounded review pack; it will not close the product-screenshot gate.

No actual 1.2.15 app composition, keyboard dismissal, complete field visibility, saved-record persistence, Insights calculation, current advertising appearance, physical-device or Play-delivered experience was verified. Existing images were visually inspected and checked against source, with limitations recorded individually. No mockups, fixtures, test-ad screenshots, generated UI or private journal content were substituted.
