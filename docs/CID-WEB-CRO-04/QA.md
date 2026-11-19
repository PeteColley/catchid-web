# CRO-04 verification

**IMPLEMENTED CANDIDATE — NOT LIVE · 19 November 2026.**

## Baseline and isolation

Fresh website main: `42c997c13712a432c8e2384915aaa010a16d068b`. Approved design: `9c7b0847061a460aa095150a6e2dd1972ba7a436`. Both existing worktrees were clean; ignored dependencies, build outputs and caches were preserved. New `codex/cid-web-cro-04-implementation` worktree was created directly from refreshed main. No design-branch merge or evidence-archive import.

Latest Android AGENTS was reread in full. Latest PROJECT_STATUS was fetched (blob `0ac34723d88ffb0a2c17e6f4c3266ab525650e0a`) and reconciled against its previously fully read version; the complete new delta is the 19 November outreach visibility note. Android main `9e9b37e9dfdc2554321602bfbada2e18227d34e7` and the 1.2.15 release handover distinguish signing/manual Internal handoff from Production. Relevant source supports manual catch entry, recorded-catch observations and optional Journal Protection. No current Play version is assumed or shown.

## Existing checks

Node 24.21.0, npm 11.19.0, existing lockfile and dependencies only:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm ci --offline --cache ../cid-web-cro-02/.npm-cache --no-audit --no-fund
npm run check
npm run build
npm run verify
git diff --check
git diff --cached --check
```

PASS: install; check (0 errors, 0 warnings, one pre-existing unused-require hint); static build (two HTML routes); verification (four total official tracked badge links, sitemap/robots/canonical/metadata/local assets); scoped diff checks before commit. Final build: **24 files, 4,322,047 bytes**, including unchanged original images retained for provenance/full-image links. Build size is not page download weight.

Logs: [ci](evidence/npm-ci.log), [check](evidence/npm-check.log), [build](evidence/npm-build.log), [verify](evidence/npm-verify.log). npm's esbuild install-script policy warning is retained; no policy/dependency change was made and build/verify succeeded. The first verifier run still expected one script; the explicit two-script contract now verifies the exact shared consent script plus the bounded presentation script. Initial logs are preserved.

## Critical regression boundary

`src/config.ts` and `scripts/verify-analytics.mjs` are unchanged. The production consent script is byte-identical after line-ending normalisation to baseline, SHA-256 **`34836c83600fbfc1aa0464a0f1e29342189c6b50066d593411e41aa5bb6eb891`**. The main verifier now pins that fingerprint and runs every existing generated-runtime consent/attribution assertion against both pages.

Tests retain default-off behaviour, exact GA ID, saved choices, reload/navigation, rejection/withdrawal, cookie cleanup, failed storage, deduplication, cross-tab changes, restored-page events, consent-gated Play events and supported inbound campaign handling. Play links preserve `com.catchid.app`, `catchid_website`, Home `website_launch/referral`, Journal `fishing_journal_app/organic`, and the nested install referrer. Unconsented visits retain static website attribution without transmitting inbound campaign parameters.

The separate presentation script closes the mobile menu and reserves/scrolls around the real consent panel. It has no storage, network, analytics or script-injection API. No CTA-position metric was added. There are no framework hydration islands, generated JavaScript bundles, extra dependencies, remote fonts or additional trackers.

The source audit confirms **20 protected files** unchanged, including original screenshots, existing public files, package inputs, workflow, configuration, SEO endpoints and analytics regression suite. Eight reference PNGs match approved Git bytes. [Source/contrast receipt](evidence/source-audit.json).

## Actual browser verification

Isolated installed Chrome **157.0.8103.79**, native CDP, DPR 1. Local built site only at `127.0.0.1:4180`; no public preview. Captures are desktop-browser CSS-pixel emulation, not physical devices.

| Coverage | Result |
| --- | --- |
| Both routes × seven widths × first/saved denied × normal/1.6× text | **56/56 pass**, at 320/360/390/430/768/1024/1440. |
| Navigation and keyboard | Both routes at 320/390/768/1024/1440; actual Tab/Enter, solid visible focus, every header/menu link, anchor target and menu closing. |
| Enlarged-text focus | Both routes at 320/390; 24 actual Tab events each. Focused controls remain visible above or inside the panel. |
| Consent | First visit, deny, cross-route persistence, back/forward, reopen/focus return, accept, accepted reload, cross-tab withdrawal, cookie cleanup, withdrawn reload and blocked storage pass. |
| Play links | Both badge destinations inspected and clicked with default navigation prevented; unconsented hrefs remain unchanged, accepted inbound referrers and both consent-gated events verified. No Google Play navigation. |
| Progressive enhancement | JavaScript-disabled pages retain two real badge links and native Menu; analytics/prompt remain inactive as before. |
| FAQs and original image link | All answers open and fit; original Insights image loads as a normal local link. |
| Motion / layout | Reduced motion honoured; no horizontal overflow/clipped text, header overlap or wrapped wordmark in final matrix. |
| Requests / exceptions | Zero unexpected third-party requests and zero page runtime exceptions in completed passes. |

Receipts: [matrix](evidence/matrix-verification.json), [20 interaction groups](evidence/interactions-verification.json). The GA loader is intercepted before network transmission and fulfilled with an inert response; all six loader attempts occur only with a saved grant. This verifies the real page's consent/loader/event boundary without sending test measurements. It is not a live GA vendor-library or production-property reporting test. Back/forward is exercised in the browser; deterministic tests also cover the restored-page `pageshow` path, without claiming a specific browser cache hit.

Installed Edge **157.0.4341.60** also passes **8/8 mobile/desktop visual cases** and **20/20 interaction groups**, with zero unexpected external requests/exceptions. Its first interaction attempt exposed a harness navigation timing race; the harness now waits for the new document's exact loader lifecycle before querying it. The unsuccessful attempt is recorded alongside the completed [visual receipt](evidence/edge/initial-verification.json) and [interaction receipt](evidence/edge/interactions-verification.json).

Firefox and Safari/WebKit were unavailable; physical devices and screen readers were not tested. These remain explicit publication gates.

## Visual and performance review

[Before/after review](VISUAL_REVIEW.md) compares actual reference and candidate screenshots, including complete pages for both routes. The first seven-width enlarged-text audit passed overflow checks but visual review caught a wrapping tablet wordmark; its intrinsic-width fix was then retested across all 56 cases.

The temporary concept image is delivered as approximately **182KiB**, the hero journal approximately **144KiB**. Normal-text local captures record CLS between **0 and 0.024**; this is an observation from controlled local runs, not a Core Web Vitals/field claim. The harness eagerly decodes page images before screenshots, so its resource totals are an upper-bound full-page capture workload, not a cold first-view benchmark. Original dimensions and SVG viewBoxes reserve product geometry. No remote fonts, hydration or unnecessary hero animation.

Reproduce with `npm run preview -- --port 4180`, then `node docs/CID-WEB-CRO-04/qa/browser.mjs matrix`, `... interactions`, and `node docs/CID-WEB-CRO-04/qa/source-audit.mjs`. The browser harness intercepts external traffic; retain that interception when exercising acceptance. Source-audit reads the separate approved commit through Git and copies only the eight comparison images.

## Unchanged boundaries

No main merge/push, workflow dispatch, deployment, DNS/CNAME/app-ads.txt/privacy-hosting change, Android application or Play action, analytics configuration change, or marketing action. Only the named implementation branch is pushed. The cross-tool [continuity proposal](PROJECT_STATUS_PROPOSED.md) remains **unapplied**. Self-review and passing checks do not clear [publication blockers](ASSET_RELEASE_GATES.md).
