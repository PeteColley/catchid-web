# CRO-07 capture boundaries

19 November 2026. Asset acquisition and review only; no publication or integration.

Website starting point: `codex/cid-web-cro-06-hero-integration` at `8d0731f361b94a81523bfe07f528b7fdb365ccb4`. New isolated review branch: `codex/cid-web-cro-07-product-captures`. Android source: verified remote main `9e9b37e9dfdc2554321602bfbada2e18227d34e7`, version 1.2.15 / 35. Android application/build paths match the qualified release-source checkpoint `f77f76f2dc7b4547d7a124b63c71e6f7783744ca`.

## Capture method and acceptance

Use a new disposable Android API 36 Google APIs profile, approximately 390dp wide, with entirely new userdata. No existing AVD or phone is used. Build unchanged source using the existing `catchidPlaytest=true`, `journalCloudEnabled=false` debug options. Retain exact APK hash and generated/packaged configuration evidence. Establish offline networking, zero accounts and an empty installation before launching CatchID. Never launch the debug journal seeders or visual fixtures.

Navigate the real Home → Add without a photo → Save catch flow. Enter a neutral no-photo demonstration record through the real form; preserve the actual field labels. Capture separate untouched PNGs for the naturally scrolling form and the genuine saved Catch details screen. Additional journal/Insights captures are secondary and must come from actual persisted sample records and app calculations. Do not invoke identification, sign-in, Journal Protection, share, ads, or cloud upload. Stop if safe isolation or a healthy emulator cannot be established.

Prefer full-resolution 1170 × 2532 captures (390 × 844dp at density 480), normal font scale, portrait. Keep complete original PNGs, with no pixel editing, compositing, generated UI or inserted data. Review readability, controls, loading, keyboard obstruction, privacy and genuine sample-data disclosure before recommending any asset.

## Source safety findings

- Debug Gradle configuration rejects playtest plus cloud enabled; debug ad identifiers are Google's demo units, never production units.
- Playtest manifest deactivates Firebase Analytics and disables Crashlytics collection; `createAppObservability` returns `Observability.noOp()`.
- `JournalSyncRuntime.schedule` exits before enqueue when cloud is disabled; its worker also exits. `JournalIdentity.signIn` returns NeedsConfiguration when cloud is disabled. No sign-in is attempted.
- `RoomJournalRepository.create` operates on the fresh app-private database/legacy snapshot and photo store. No existing preferences, database, witness or photos are copied.
- `ProvideAds` still constructs the real UMP-backed `AdsSession`; playtest is **not an ads-off switch**. Fresh offline UMP state is required. A failed fresh consent update cannot permit ad initialization through the normal consent gate. Check actual offline state before and after capture, and do not interact with advertising controls.
- The network identification operation is user-initiated; it is never used for this task.

These are source findings, not a substitute for runtime isolation checks. Runtime results and any failures are recorded separately.

## Production evidence boundary

Current source and a signed candidate do not prove a Production rollout. Latest directly documented Production evidence remains 1.2.12 / 32 on 2 November. Pete's later report that 1.2.15 is live is acknowledged but not independently reconciled. The accessible browser inventory has no connected Play Console tab; unrelated browser content was not captured. No Console changes or account sign-in are performed.

## Preserved scope

Only this review folder and website root PROJECT_STATUS may change. Website source, existing images, dependencies and deployment workflow remain byte-identical. Android is checked out separately at a detached commit for build/capture only; no Android source edits or push. The website workflow runs for main pushes or an explicit dispatch; neither is authorized here.

Tooling references: [Android emulator command line](https://developer.android.com/studio/run/emulator-commandline) and [AVD creation](https://developer.android.com/tools/avdmanager). Tool downloads are confined to a local task directory and verified against Google's repository manifests; no SDK, AVD, APK or database is committed.
