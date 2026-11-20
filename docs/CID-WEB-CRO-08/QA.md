# CRO-08 verification

**20 November 2026 · implementation candidate, not live.**

## Orientation and isolation

Read current remote Android AGENTS/status through GitHub: blobs `edaa7694c58fd4e855dba2ac8e63bb46eb357353` and `a811c048466f36fe8f6f505e481ca2ce7db08a45`, unchanged from the previously fully read orientation. Main is `35cbf6d562d6f42906e33c5c7be95d0b95800ad7`: Smart Locations parked, growth priority, owner-confirmed Production 1.2.15 without fresh independent Console evidence. Read website PROJECT_STATUS, CRO-07A recovery/provenance, actual components/styles/image pipeline/verifier and CRO-06 evidence.

Safely fetched website remote. Verified main `42c997c13712a432c8e2384915aaa010a16d068b`, CRO-06 `8d0731f361b94a81523bfe07f528b7fdb365ccb4`, CRO-07A `aa818647e3acd7537e92774fb7b2f437388aa7ce`, recent commits and absent CRO-08 branch. Created a new isolated worktree/branch from that approved capture SHA. No reset, clean, rebase, force push or merge. [Worktree inventory](evidence/worktree-orientation.json) records tracked/untracked/ignored/upstream state; seven unrelated dirty Android files remain hash-identical. Deployment workflow is unchanged, push **main only** plus manual dispatch; neither path was invoked.

## Required commands

| Command | Result |
| --- | --- |
| `npm ci --offline --cache ../cid-web-cro-02/.npm-cache --no-audit --no-fund` | Pass; 263 locked packages, unchanged manifests/lockfile. Initial sandbox EPERM retained. Existing esbuild install-policy warning retained. |
| `npm run check` | Pass, zero errors/warnings, three inherited unused-require hints. |
| `npm run build` | Pass, exactly two HTML pages, 48 output files. |
| `npm run verify` | **Fails at the known Windows CRLF SiteInteractions source/output equality comparison. Not reported as passing.** |
| `node docs/CID-WEB-CRO-06/qa/verify-baseline.mjs` | Pass with all original protections and new screenshot checks. Only the source read's CRLF is normalised in memory. No file rewrite or assertion bypass. |
| `git diff --check` | Pass, repeated before commit. |
| `node docs/CID-WEB-CRO-08/qa/audit.mjs` | Pass: protected Git blobs, raw/emitted consent bytes, identical Fishing Journal HTML, preserved unrelated dirty files, approved source hashes, 16 exact re-encoded derivatives and browser comparisons. |

Logs: [install](evidence/npm-ci.log), [check](evidence/npm-check.log), [build](evidence/npm-build.log), [plain verifier](evidence/npm-verify-original.log), [normalised verifier](evidence/npm-verify-normalised.log), [audit](evidence/audit.log). [Machine-readable source/image audit](evidence/source-image-visual-audit.json).

The verifier change is bounded: homepage no longer expects visible Home entry controls, but still requires Journal, Personal Records, Insights and ID; the unchanged landing page still requires Home. It now checks approved original hashes/direct source imports, correct-section local derivatives, responsive widths, lazy loading, adjacent demonstration-data/excerpt captions and absence of the lower capture or obsolete photo copy. All consent, badge count, exact Play/install attribution, honest-claims, dependency, metadata, sitemap, privacy and two-page assertions remain.

## Browser checks

Actual installed **Chrome 157.0.8103.79**, isolated headless profile, native CDP, loopback servers only. DPR 1 unless specified. The reused CRO-06 harness is copied into this task's evidence, leaving prior scripts/results unchanged.

- **56/56 matrix cases:** both pages × seven widths (320/360/390/430/768/1024/1440) × first/saved rejection × normal/1.6× text. No overflow, clipping, broken image/anchor, header conflict or undersized tested controls; equal consent choices; normal mobile primary badge accessible above consent. [Report](evidence/final/matrix-verification.json).
- **20/20 interaction groups:** keyboard focus/menus/links, FAQs, reduced motion, existing full Insights link, enlarged-text focus visibility, no-JS fallback, first/reject/reopen/accept, saved/back/forward/cross-tab/withdrawal, cookie cleanup, blocked storage fails closed, consent-gated Play events and nested install attribution. Six consented GA loaders fulfilled with inert local responses; Play navigation suppressed. [Report](evidence/final/interactions-verification.json).
- **8/8 image cases:** 390/1440 × DPR 1/2/3, plus unsupported-WebP simulation at both widths. Exactly one hero request and one request per new screenshot, local WebP selection, decodable PNG screenshot/JPEG hero fallbacks. No duplicate fallback download, external image request or lower-form dependency. [Report](evidence/final/images-verification.json).
- **10 normal + 10 enlarged-text section captures:** Record/Journal at 320/390/768/1024/1440, [normal](evidence/final/sections-verification.json), [enlarged](evidence/final/sections-text160-verification.json). Two deliberate visual passes are documented in [VISUAL_REVIEW](VISUAL_REVIEW.md).
- Completed browser runs report **zero unexpected external requests, runtime exceptions or console errors**. No live analytics, Play Store visit or remote preview.
- The offline gallery renders at 1280px with all 23 images loaded, no overflow, scripts or external requests; [receipt](evidence/final/gallery-verification.json). All 107 top-level document/gallery local links resolve; [link check](evidence/link-check.json). Its initial implicit favicon probe is retained in `evidence/gallery-favicon-attempt.json`; an explicit empty data-URI icon avoids that irrelevant gallery request.

Before evidence is newly browser-rendered from the preserved exact CRO-06 build, not drawn from edited image mockups. Hero first views match within 4/255 raster tolerance; the one affected first-visit desktop image has 47 pixels over 2/255, maximum 4/255, on the unchanged rotated Journal artwork. Three complete Fishing Journal comparisons are exactly equal; desktop first visit differs at 254 pixels by more than 4/255, maximum 13/255, confined to the unchanged rotated Insights artwork. Its exact generated HTML and protected CSS/assets are unchanged. The full-page comparison accepts less than 0.01% changed pixels at that small channel variance and records actual counts; it does not claim identical PNG bytes.

## Retained failures and harness corrections

- [Initial sandbox npm failure](evidence/npm-ci-sandbox-attempt.log) was an EPERM creating the new worktree's node_modules. Authorized elevated offline install passed without dependency changes.
- [First check](evidence/npm-check-pass1.log) caught an over-escaped regular expression in the new assertion. Corrected. The first wrapper assertion then assumed attribute order; [failure](evidence/npm-verify-assertion-order-attempt.log) retained, corrected to parse source attributes. Both were task implementation mistakes, not the inherited CRLF issue.
- Initial interaction runs found Chromium's implicit `/favicon.ico` request while viewing the existing standalone Insights image. [Diagnostic](evidence/interactions-favicon-diagnostic.json). This custom local server now serves the build's existing favicon for that implicit probe. Production source is unchanged. Other missing resources still fail; the final interaction run has zero errors.
- An initial image assertion checked `loading` after the inherited helper deliberately set it eager to decode all offscreen images. [Receipt](evidence/images-eager-harness-attempt.json). The helper now records the original value first; built lazy markup is independently asserted. This is not a production lazy-load fix.
- Exact raster equality initially exposed the tiny interpolation variations described above. [First failure](evidence/audit-raster-tolerance-attempt.log). One large Buffer diagnostic stalled and was stopped; comparison now reports bounded counts/deltas instead of attempting to format huge raw buffers. No image or production source was altered to conceal a diff.

## Reproduction and limits

Install/check/build; run normal verifier (report the CRLF failure if present), then the existing wrapper. Start `node docs/CID-WEB-CRO-08/qa/serve.mjs dist 4188`. Sequentially run `node docs/CID-WEB-CRO-08/qa/browser.mjs matrix`, `interactions`, `images`, `sections`, `sections-text160` with `CATCHID_BROWSER_LABEL=final`. The audit also uses the preserved sibling CRO-06 build and before screenshots. `serve.mjs` binds only 127.0.0.1. It has no deployment function. Stop task-owned servers at handoff.

Normal and enlarged page text reflow were tested; embedded raster text cannot reflow. These are desktop Chromium CSS-pixel emulations, not physical phone tests. Firefox, Safari/WebKit, physical devices, screen readers and field performance remain untested. No full WCAG certification, Production delivery fidelity or blanket rights acceptance is claimed. [Remaining publication gates](HANDOVER.md#remaining-publication-gates) remain open.

Evidence log line-end whitespace was trimmed for Git whitespace checks; command output content and failed results are unchanged. Raw logs are preserved in the local cro08-runtime/raw-logs directory. Task-owned browser/server processes are stopped; shutdown receipt is in evidence/shutdown.json.
