# CRO-03A verification

**DESIGN CONCEPT — NOT LIVE · 18 November 2026**

Focused polish on the direction approved at `d0df9e0bdfc0c23fbdc0db1fad94dd948ab7f5a6`. The [original QA](CRO03_QA_ARCHIVE.md) and evidence are preserved.

## Orientation and scope

The worktree was clean on `codex/cid-web-cro-03-design`, HEAD/upstream exactly the reviewed commit, with no divergence/untracked work. Ignored `.astro/`, `.npm-cache/`, `dist/`, `node_modules/` were preserved except requested reinstall/build output. Fresh remote main remained `42c997c13712a432c8e2384915aaa010a16d068b`.

Android main `ec74bf1f0a2feb3a078e3918f294ea06f3fe2a0d`, recent commits, AGENTS and PROJECT_STATUS were checked. Status is identical to the fully read 122,432-character CRO-03 version (blob `55e721f32cb3d34f0d69d3b08e2daa13f003c1fb`); AGENTS was reread in full. No Android file, device, data or release change.

Read CRO-03 review/provenance/prototypes and inspected actual first/saved mobile, desktop and full-page evidence. Android asset candidates were checked with provenance; no unapproved fixture/composite was imported.

All changes are under `docs/CID-WEB-CRO-03/`. Approved base `design.css`, original source assets and production files are untouched. CRO-03A adds `polish.css`, adapts offline interactions, and updates the generator/pages/gallery. **117 prior asset/reference/evidence files** match the reviewed commit byte-for-byte. **78 production-baseline tracked blobs** are unchanged. Insights, optional ID and trust markup is identical on both routes.

## Repository checks

Node 24.21.0, npm 11.19.0; existing lock/dependencies only:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm ci --offline --cache ../cid-web-cro-02/.npm-cache --no-audit --no-fund
npm run check
npm run build
npm run verify
git diff --check
git diff --cached --check
```

PASS: ci; check (**22 files, 0 errors, 0 warnings, 1 existing unused-require hint**); build (**2 routes, 43 files, 2,203,399 bytes**); verify (both production consent runtimes and all 9 attribution/CTA contracts). No docs enter production output. Scoped diff checks pass before commit. The existing verbatim-reference Markdown whitespace exception remains restricted to supplied reference files.

Initial offline ci used an unpopulated cache (ENOTCACHED). Retry with the populated cache hit sandbox EPERM during extraction. The authorised elevated rerun passed without dependency/config edits. Failed attempts remain alongside the successful [ci](evidence/cro03a/npm-ci-pass.log), [check](evidence/cro03a/npm-check.log), [build](evidence/cro03a/npm-build.log), [verify](evidence/cro03a/npm-verify.log) logs.

Local machine paths in new logs and the offline receipt are replaced with placeholders; test results and measurements are unchanged.

## Browser verification

Chrome 157.0.8103.79, isolated headless profile, DPR 1, responsive CSS-pixel rendering. Node built-ins/CDP only. Local server binds 127.0.0.1:4178; interception permits only review/server/data resources, and CSP blocks outside connections/resources. No live analytics.

```powershell
node docs/CID-WEB-CRO-03/qa/serve.mjs
# In another terminal:
node docs/CID-WEB-CRO-03/qa/prepare-pages.mjs
node docs/CID-WEB-CRO-03/qa/prepare-gallery.mjs
node docs/CID-WEB-CRO-03/qa/polish-browser.mjs matrix
node docs/CID-WEB-CRO-03/qa/polish-browser.mjs review
node docs/CID-WEB-CRO-03/qa/polish-static.mjs
node docs/CID-WEB-CRO-03/qa/polish-index.mjs
```

The gallery/prototypes themselves work directly through file:// without a server.

| Check | Result |
| --- | --- |
| Responsive matrix | **36/36 PASS**: both routes at 320/360/390/430/768/1024/1440, first/saved; 1.6× text at 320/390, both states. |
| Offline gallery/pages | **6/6 PASS**, file:// at 390/1440; local assets, menu, FAQ, modal and consent work. |
| Overflow / clipping | None in final matrix. Enlarged text wraps/scrolls; genuine image proportions retained. |
| CTA/product | At 390 normal text, badge bottom 412.73px; a complete first catch is visible above consent. At 320 less product fits; scrolling reveals the rest. |
| Choice parity | Equal dimensions and styling. At 390 each button is 170 × 44px. Both choices work with no cookies/storage, tracking or outbound navigation. |
| Focus obstruction | Actual Tab events and solid outlines. Four additional route/width traversals at 1.6× text, 25 Tabs each: no focused page control obscured by the panel. |
| Consent reopening | Choice returns focus to footer opener; initial choice returns to primary badge. |
| Targets / FAQ / anchors | Exposed controls ≥44px high; anchors resolve; all FAQ answers open/readable. |
| Reduced motion | Scroll behaviour becomes auto; no animation/parallax. Focus correction is immediate. |
| Contrast | Authored pairs ≥4.5:1; minimum **4.64:1**. Consent text/button/caption pass. Photo is below body text; concept label is opaque navy. Unaltered app pixels are not certified as an app accessibility audit. |
| Authenticity | Source hashes match; record excerpt labelled honestly. Populated Journal once per page. |
| Network/runtime | **Zero external page requests, zero page exceptions**. Page-level observation, not an OS packet capture. |

First audit found slightly unequal desktop button widths; both are now 148px. It also misclassified body focus after a complete Tab cycle as an obscured page control; the harness now distinguishes those browser/body checkpoints. [Original audit](evidence/cro03a/matrix-first-audit.json) and [corrected final receipt](evidence/cro03a/matrix-verification.json) are retained. No actual failing control was suppressed.

Evidence: [capture index](CRO03A_CAPTURE_INDEX.md), [matrix](evidence/cro03a/matrix-verification.json), [offline](evidence/cro03a/review-verification.json), [source/contrast](evidence/cro03a/static-verification.json), [self-review](VISUAL_REVIEW.md), [asset requirements](ASSET_PROVENANCE.md).

Two visual passes and a rendered inline alternative are preserved. Fixed consent is an offline design proposal; production behaviour/configuration is unchanged. Enlarged text requires scrolling. No physical-device, Safari, Firefox, screen-reader, photography-rights or conversion validation is claimed.

The only deployment workflow is main push or workflow_dispatch; the review branch does not match. No main push, merge, PR, deployment, public preview, Pages change, Android/Play action or analytics/attribution/privacy configuration change.
