# CRO-06 verification

**19 November 2026 · implementation candidate only.**

## Orientation and protected state

Current Android `main/AGENTS.md` and `main/PROJECT_STATUS.md` were fetched through GitHub. Their blobs remain `edaa7694c58fd4e855dba2ac8e63bb46eb357353` and `0ac34723d88ffb0a2c17e6f4c3266ab525650e0a`, identical to the prior fully read orientation. Android main remains `9e9b37e9dfdc2554321602bfbada2e18227d34e7`; no release status was inferred from historical production text. CRO-05 REVIEW, PROVENANCE and QA were read in full.

Website remote main, CRO-04 and CRO-05 were fetched/checked at `42c997c13712a432c8e2384915aaa010a16d068b`, `651ae58f39a8c2530fb600b35e91455c644351e8` and `e5ccb55f338cd954d38c11b992f0bc48ac0d8a39`. Existing worktrees were clean with their upstreams; ignored `.astro`, `.npm-cache`, `dist` and `node_modules` were preserved. The new branch starts directly at CRO-04. No comparison archive merge, reset, rebase, force push or deletion.

The [source/image/visual audit](evidence/source-image-visual-audit.json) verifies **256 existing files** unchanged, with only `src/pages/index.astro` and `src/product-assets.ts` exempted for the specified edits. New production files are the dedicated photo component and exact original JPEG. Global CSS, all other components/pages, configuration, workflows, official badge, product artwork, packages and regression scripts remain unchanged. Website continuity and task evidence are the other additions.

The consent component has the same Git blob; the exact generated analytics script bytes match the baseline, SHA-256 **`05eac5412cbbabef7533580d70d6721af6806983a5c7fc43fa4ccd18199bea8f`** including emitted surrounding whitespace. Existing verifier's trimmed-script fingerprint remains `34836c83600fbfc1aa0464a0f1e29342189c6b50066d593411e41aa5bb6eb891`. The Fishing Journal HTML build is byte-identical to baseline.

## Required commands

| Command | Result |
| --- | --- |
| `npm ci --offline --cache ../cid-web-cro-02/.npm-cache --no-audit --no-fund` | Pass; unchanged lockfile/dependencies. Existing esbuild install-script-policy warning retained. |
| `npm run check` | Pass: no errors/warnings, one existing unused-require hint. |
| `npm run build` | Pass: exactly two HTML pages; 32 output files. |
| `npm run verify` | **Fails solely at the documented baseline CRLF presentation-script comparison.** Original failure retained. |
| `node docs/CID-WEB-CRO-06/qa/verify-baseline.mjs` | Pass: the CRO-05 in-memory single-read normalisation wrapper; every existing assertion unchanged. |
| `git diff --check` / scoped staged check | Pass before commit. |
| `node docs/CID-WEB-CRO-06/qa/audit.mjs` | Pass: source/rights identity, protected files, generated image dimensions/weights, no concept output and four visual comparisons. |

Logs: [install](evidence/npm-ci.log), [check](evidence/npm-check.log), [build](evidence/npm-build.log), [plain verifier failure](evidence/npm-verify-original.log), [normalised verifier](evidence/npm-verify-normalised.log), [audit](evidence/audit.log).

The normalisation wrapper changes only the in-memory read of `SiteInteractions.astro` from CRLF to LF, matching Astro's output; it does not write the source or alter assertions. The production verifier and analytics regression suite are untouched. Plain npm verify is **not** reported as passing.

## Browser checks

Actual Chrome **157.0.8103.79**, native CDP, isolated profile, loopback `127.0.0.1:4186`. No public preview. Matrix captures use DPR 1 and desktop-browser CSS-pixel emulation.

- **56/56 responsive/text cases:** both pages at 320/360/390/430/768/1024/1440, first visit and saved rejection, normal and 1.6× text. No horizontal overflow, clipped text, bad anchors, failed images, header overlap, wordmark wrap or undersized tested controls. [Receipt](evidence/matrix-verification.json).
- **20/20 interaction groups:** actual keyboard focus/navigation; mobile menu; internal links; FAQs; original image link; reduced motion; 1.6× text focus visibility; first visit/reject/reopen/accept; persisted decisions; back/forward; cross-tab withdrawal and cookie cleanup; blocked storage fails closed; JavaScript-disabled fallback; consent-gated Play events and inbound/nested install attribution on both badges. [Receipt](evidence/interactions-verification.json).
- **8/8 image cases:** six real source-selection probes at 390/1440 and DPR 1/2/3, plus two simulated unsupported-WebP JPEG fallback decodes. One photo request per normal probe, no full original, no unwanted external image request. [Receipt](evidence/images-verification.json).
- **8/8 console cases:** both pages at desktop/mobile, first/saved rejection, with explicit console-error, browser-log and runtime-exception listeners. No errors or unexpected external requests. [Receipt](evidence/console-verification.json).
- **Four before/after comparisons:** browser-rendered candidate versus exact approved CRO-05 screenshots, first/saved at both required sizes. Zero changed pixels outside the photo frame at 2/255 channel tolerance. [Visual review](VISUAL_REVIEW.md).

Completed passes have zero unexpected third-party requests and zero page runtime exceptions. All six GA loader attempts in consent tests occur only after saved acceptance and are intercepted before transmission with an inert response. Play click tests prevent navigation. This verifies the unchanged loader/event boundary, not live GA property reporting or a Google Play visit.

The first interaction/image attempts overlapped on one QA browser profile, disturbing test storage. That unsuccessful receipt is retained as [overlap attempt](evidence/interactions-overlap-attempt.json) with [explanation](evidence/browser-overlap-attempt.txt); fresh sequential reruns above pass. A separate raw checkout-byte audit initially encountered only LF/CRLF differences across worktrees; [note](evidence/audit-checkout-note.txt). The corrected audit verifies Git blobs and exact emitted script bytes. No production code was changed in response to either harness issue.

## Visual/accessibility limits and reproduction

The fish, journal dominance, normal-size immediate badge, equal consent choices and unchanged text contrast were visually inspected. At 320px more of the photo is initially beneath consent; scrolling exposes it without moving controls. Enlarged text needs natural scrolling; tested focus remains visible. [Detailed self-review](VISUAL_REVIEW.md).

Firefox, Safari/WebKit, physical devices and screen readers were not tested in this task. No field performance, conversion uplift or new exhaustive accessibility audit is claimed. Current authentic Add Catch/Catch Details and remaining product-evidence acceptance remain release gates.

Reproduce after installing dependencies: build; run the normal verifier and, if solely the known CRLF failure occurs, the documented wrapper; start `npm run preview -- --port 4186`; run `node docs/CID-WEB-CRO-06/qa/browser.mjs matrix`, then `interactions`, `images` and `console` **sequentially**. The audit uses the preserved sibling CRO-04/CRO-05 worktrees/build for exact source/rendered baseline comparisons. Stop the task-owned preview with `node node_modules/astro/bin/astro.mjs preview stop`.

Local browser/preview processes are stopped at handoff. The isolated implementation branch is committed/pushed normally and its remote SHA/files read back. Main-only deployment workflow and manual dispatch are untouched; no deployment trigger is invoked. No main/catchid.app, DNS, Pages, Android application, Play, advertising or outreach change.
