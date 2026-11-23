# CID-GROWTH-03 publication receipt

**LIVE AND VERIFIED — 23 November 2026.** The exact approved fishing journal guide and free catch-log worksheet are published. No production source changes were made during this publication task.

[Live guide](https://catchid.app/guides/how-to-keep-a-fishing-journal/) · [Live worksheet and print control](https://catchid.app/guides/how-to-keep-a-fishing-journal/#worksheet) · [Live visual/print review](REVIEW.md)

## Revision and deployment

| Item | Verified value |
| --- | --- |
| Tested implementation | `829beb5b7141e4fbadded37be9e6ece64fe21b47` |
| Approved candidate, final website main and actual deployed revision | `871ebbeb8e72f0222427002c1ac58f696c328e0d` |
| Previous website main | `c5a2a9ea6dee8c3b2c0457552ed789605e46f687` |
| Publication | Expected-head guarded fast-forward, no force; three commits ahead, no divergence |
| Existing Pages workflow | [45290863748 — success](https://github.com/PeteColley/catchid-web/actions/runs/45290863748) |
| Ubuntu build job | [138098951322 — success](https://github.com/PeteColley/catchid-web/actions/runs/45290863748/job/138098951322), completed 23:41:13 UTC |
| Pages deploy job | [138099229677 — success](https://github.com/PeteColley/catchid-web/actions/runs/45290863748/job/138099229677), completed **23:41:27 UTC** |
| Environment | `github-pages`, [https://catchid.app/](https://catchid.app/) |
| Pages artifact | `14873742177`; archive digest `sha256:1ec454c7bd082687ae72a851b7d41dfcdb2db806962715ae8a3bd3c2374e78e1` |

The deployment log names the exact approved revision and environment URL. [Workflow metadata](evidence/deployment.json), [Linux build log](evidence/linux-build.txt), [deploy log](evidence/pages-deploy.txt). The push-triggered workflow was used once; no additional dispatch or workflow change.

## Preflight and release review

Refreshed website and Android refs; read current Android AGENTS/PROJECT_STATUS and website README, CID-GROWTH-02 delivery/handover. The approved head contains only two documentation-file changes after the tested implementation. The publication checkout is isolated at `codex/cid-growth-03-publication`; original main checkouts, unrelated worktrees, dirty/untracked files and ignored artifacts were preserved.

Windows Node **24.21.0**, npm **11.19.0**: `npm ci`, `npm run check`, `npm run build`, `npm run verify`, `git diff --check` passed. Check: **0 errors, 0 warnings, 11 informational hints**. No local WSL installation, Docker or Podman was available; no standalone Linux preflight was claimed. The unchanged deployment workflow ran the same install/check/build/verify checks on Ubuntu with Node **24.22.3**, passing before its dependent deployment job.

[Source/output comparison](evidence/preflight.json) matched all **32** approved source hashes. Lockfile, package/configuration, consent source, original analytics tests, global stylesheet, source artwork and deployment workflow are unchanged. The initial strict byte comparison exposed LF/CRLF differences in three copied text assets (CNAME, app-ads.txt and river-lines.svg): reproducing CRLF exactly reproduces their previous hashes. All other **31** approved output files match byte-for-byte. The new clean LF build has 34 files / 3,919,409 bytes and matches the public deployment in full.

The brief records Pete's approval and ChatGPT's independent review of CID-GROWTH-02 source, screenshots and actual print. Codex's focused release review is **self-review**. It checked source drift, scope, existing pages, publication ancestry, consent/attribution, crawlability and print. Existing-page main content and approved genuine artwork remain covered by unchanged CID-GROWTH-02 evidence. The 144-case responsive/text/consent matrix, keyboard and inbound campaign tests, negative verifier probes and JavaScript/no-JavaScript print checks were reused because source identity was verified; they were not misrepresented as newly performed live tests.

No new material defect, security exposure, divergence or scope discrepancy was identified. No corrective production commit or revert was needed.

## Actual public verification

Final controlled public check completed **2026-11-23 23:43:52 UTC**. [Full live results and SHA-256 hashes](evidence/live-verification.json).

- **HTTP 200:** homepage, `/fishing-journal-app/`, guide, `/sitemap.xml`, `/robots.txt`, plus every generated public asset. All **34 served files matched the clean tested build byte-for-byte**.
- All three canonical URLs and deployed titles/content are correct. Every image decoded, genuine product artwork loaded, and local anchors worked. No detected horizontal overflow at **390 and 1440 px** on each of the three routes.
- Crawlable shared-footer links and the journal-page link were checked and navigated to the guide.
- Official Play badges remain **2 / 2 / 1**. The guide's source/medium/campaign are `catchid_website / organic / fishing_journal_guide`; top-level and nested install-referrer fields match. Package remains `com.catchid.app`.
- Live consent default-off, deny/accept persistence, reopening/focus, accepted page initialization, all five Play-click handlers, withdrawal and cookie cleanup passed. All external browser requests were intercepted; GA's exact loader was fulfilled with inert code and Play navigation prevented after the real event handler. No Google collection or Play visit/installation was generated. No unexpected external requests or browser runtime errors.
- The live guide was visually inspected at desktop/mobile sizes, including the official badge and genuine Personal Records artwork. Initial full-page captures after reload omitted an offscreen lazy badge; this was a capture timing issue, not missing source or a failed asset. The review harness now explicitly decodes images after reload; final captures and detailed badge screenshots were regenerated and inspected.
- Native print-button keyboard activation passed. Actual browser PDF from the live first-visit mobile page is **one landscape A4 page (841.91998 × 594.95996 pt)** with **five blank rows (about 17 mm each), eight fields and separate trip notes**. Text and table bounds are within margins; no site navigation, consent, badge or link annotations. [Actual live PDF](evidence/live-catch-log-a4-landscape.pdf), [PDF structural checks](evidence/print-verification.json), [rendered preview](evidence/live-print-preview.png). Headers/footers disabled. Poppler preview visually inspected.

## Search discovery

Ready for discovery: normal crawlable links, correct self-canonical, sitemap inclusion, no meta/header noindex and robots `Allow: /` with the correct sitemap. **Google indexing is not confirmed.** The existing authorised read-only GSC Wizard call returned `payment_required / subscription_required`. No new subscription, tool, tracking, infrastructure or submission was introduced. Readiness does not establish indexing, rankings, traffic or conversion uplift.

## Android continuity

The separately authorised [Android PROJECT_STATUS update](https://github.com/PeteColley/catchid-android/blob/e811e297066f5e4b12928df61cd2d9d2c80cf280/PROJECT_STATUS.md) succeeded in commit **`e811e297066f5e4b12928df61cd2d9d2c80cf280`**, directly parented by the freshly checked `55c0cc6a9ac85e03fb88e55589f74f3f6bc91b57`. Current blob guard `cb3cb426286108cfeccb3f12c2d7619a6864c732`; resulting blob `edd162ab2ac40fef876003087b40459c0cc06d61`.

Independent GitHub readback exactly matched the prepared document. Commit inspection confirms **only PROJECT_STATUS.md changed, 19 added lines, zero deletions**; unrelated history is intact. [Inserted entry](ANDROID_CONTINUITY.md). This explicit new authority resolved the earlier CID-GROWTH-02 approval limitation; no control was bypassed.

Android production remains **owner-confirmed 1.2.15 / code 35, without fresh direct Play Console readback**. No Android runtime/version, release, Firebase, cloud/user data, Smart Locations, Growth OS automation, email, social post or advertising-spend change.

## Residual limitations

The [unchanged dependency audit](evidence/audit.json) still identifies one moderate affected Astro package and two advisories: [dynamic tag-name XSS](https://github.com/advisories/GHSA-mh32-jxcr-mh9f), and [Node-adapter image endpoint sibling-directory read](https://github.com/advisories/GHSA-r3h5-4585-7x3w). No corresponding untrusted dynamic-tag or Node image-server path was identified in this static site. Dependencies are unchanged; this is not a clean-security or exploit-test claim.

Browser checks used desktop Chrome **157.0.8103.79** with emulated viewport sizes. No new physical Android/iOS, actual Safari/Firefox, spoken-reader, native browser-zoom or physical-printer acceptance. No-JavaScript print coverage is inherited from identical CID-GROWTH-02 source. Browser-added print headers and footers must be off. Imagery retains historical-UI and previously documented owner-attested photo-rights qualifications. No traffic, indexing, retention or conversion result is asserted.

Evidence and this receipt are committed only on the publication branch so website main stays at the exact approved deployed revision.

**Only recommended next milestone, subject to ChatGPT review:** prepare the first assistant-produced organic distribution experiment using this published resource. The experiment has not begun.
