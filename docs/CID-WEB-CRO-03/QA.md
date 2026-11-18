# Verification and limitations

**DESIGN CONCEPT — NOT LIVE · 18 November 2026**

## Repository orientation and isolation

The original `catchid-web` worktree was clean on `main`, HEAD/upstream `42c997c13712a432c8e2384915aaa010a16d068b`, with no tracked or untracked changes. Relevant ignored output/cache directories `.astro/`, `.npm-cache/`, `dist/`, `node_modules/` were preserved. Fresh remote inspection confirmed CRO-02 `1095c41927f2f5eabd6e0ac1996325d780009530`; the CRO-03 candidate branch did not exist locally or remotely.

Created the separate `cid-web-cro-03` worktree and `codex/cid-web-cro-03-design` branch from exact remote main. Initial upstream was origin/main; review-branch upstream is set only by its scoped push. Other worktrees, CRO-01/CRO-02, dependencies and unrelated measurement work remain untouched. No web-specific AGENTS instructions were found.

Read the full current Android AGENTS/PROJECT_STATUS continuity, recent commits and 1.2.15 release handover. Current Android main is `ec74bf1f0a2feb3a078e3918f294ea06f3fe2a0d`; the newest insertion concerns outreach, not a new production release. The previously read status was compared in full against current content, and the only new 1,878-character insertion was read. Current AGENTS blob is unchanged. No private device or journal was accessed.

Read website README, both route sources, shared styles and components, PlayLink, WebAnalyticsConsent, config, asset provenance, verification script and deployment workflow. Consulted CRO-01 publication history and CRO-02 evidence. The Sites skill’s local authoring workflow was used within the user's explicit offline/docs-only scope; no Sites publication was invoked.

Only `docs/CID-WEB-CRO-03/` is added. All **78 tracked baseline Git blobs** compare unchanged. The byte manifest also compares both worktrees: 77 files match byte-for-byte; `public/app-ads.txt` has only the expected LF/CRLF difference from creating a fresh worktree under `core.autocrlf=true` (59 vs 60 bytes), with the same Git blob `bcf3853e127e62d5715b80837d0421262d34e10c`. Its creation/last-write times remain the worktree checkout time. It was not edited. All production Astro pages/components/styles, package/config/workflow files match their original bytes. The original main worktree is unchanged.

## Repository commands

Run from the isolated worktree, Node **24.21.0**, npm **11.19.0**:

```powershell
npm ci --offline --cache ../cid-web-cro-02/.npm-cache --no-audit --no-fund
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run check
npm run build
npm run verify
git diff --check
git diff --cached --check
```

- `npm ci`: PASS, 263 existing lockfile packages; no dependency/package edits. npm's esbuild install-script approval notice is retained in the log; the subsequent build succeeded.
- Initial check/build stopped before execution because Astro tried to create a telemetry config outside the sandbox. Retried with the repository workflow's existing `ASTRO_TELEMETRY_DISABLED=1` environment setting; no config file was edited and no telemetry was needed.
- `npm run check`: PASS, 13 files, **0 errors, 0 warnings, 1 existing unused-require hint**.
- `npm run build`: PASS, both unchanged production pages, 43 output files. No design files enter `dist`.
- `npm run verify`: PASS, both consent runtimes, 9 production tracked CTA contracts, attribution/referrer, metadata, local assets, sitemap/robots/CNAME. This validates the untouched baseline; it is not approval of its stale “No adverts” copy.
- Diff checks: PASS on the scoped staged changes before commit. The supplied reference Markdown retains its original intentional hard-break spaces and trailing blank lines; a directory-local `-whitespace` attribute applies only to those verbatim reference files. Authored code, documentation and logs remain checked. Assets/reference bytes are exempt from line-ending conversion; authored review text uses LF.

Logs: [ci](evidence/npm-ci.log), [check](evidence/npm-check.log), [build](evidence/npm-build.log), [verify](evidence/npm-verify.log). Local absolute workspace prefixes are replaced with `<review-worktree>` in retained logs.

## Browser evidence

Installed Chrome **157.0.8103.79**, headless, an isolated disposable profile under ignored `.npm-cache/cro03-browser`. Node built-ins and Chrome DevTools Protocol only; no dependency additions, browser extension, signed-in profile or live GA session. Responsive CSS-pixel emulation at DPR 1 is not physical Android validation.

Reproduce with two terminals from the worktree:

```powershell
node docs/CID-WEB-CRO-03/qa/serve.mjs
```

```powershell
node docs/CID-WEB-CRO-03/qa/prepare-pages.mjs
node docs/CID-WEB-CRO-03/qa/prepare-gallery.mjs
node docs/CID-WEB-CRO-03/qa/browser-check.mjs baseline
node docs/CID-WEB-CRO-03/qa/browser-check.mjs matrix
node docs/CID-WEB-CRO-03/qa/browser-check.mjs review
node docs/CID-WEB-CRO-03/qa/static-check.mjs
node docs/CID-WEB-CRO-03/qa/index-evidence.mjs
```

The server binds **127.0.0.1:4178 only**. `/baseline/` serves the unchanged built site; no baseline HTML is rewritten. Chrome's per-page request interception blocks anything outside the local server/review files/data URLs. Prototype CSP also forbids connections, remote scripts/fonts and form submission. Browser background networking is disabled. Recorded page requests contain **zero external attempts**, with **zero page exceptions**. This is page-level observed evidence, not a packet capture of the entire operating system.

`matrix` passes **36 cases**: both routes, widths 320/360/390/430/768/1024/1440, first and saved-choice appearance; 1.6× text additionally at 320 and 390 in both states. Eight normal-text full-page captures cover 390 and 1440, both routes/states. Four baseline first-visit cases and full captures cover both routes at 390 and 1440. Six offline file:// cases cover gallery and both pages at 390/1440.

## Interaction and visual checks

| Check | Result and evidence |
| --- | --- |
| Horizontal overflow / clipped text | No reported overflow or clipped leaf text across 36 final cases. Visual inspection includes full mobile pages, 1024/1440 heroes, the 320px enlarged-text case and section crops. |
| Mobile badge | At 390 × 844, primary button bottom 488.23px for both routes, first/saved. Reassurance directly follows. With 1.6× text the page grows and the badge can be below the first viewport; it stays reachable. |
| Touch targets | Exposed controls and navigation have at least 44px height in tested geometry. The desktop inline ID link also has a 44px target. |
| Keyboard / focus | Actual Tab events: skip link → brand → mobile Menu → primary badge; then consent on Home or guide link on Journal. Solid focus outlines observed. Skip target is below the header. Native disclosure and dialog semantics retained. |
| Consent | Accept and reject each hide the same panel and return focus to the primary badge; no cookies/storage. Footer reopens and focuses a choice. Saved query is visual simulation only, not persisted permission. |
| Badge / modal | Actual local badge opens a dialog; Escape closes it; file:// close button works. No navigation to Play. Privacy/Support are visibly marked non-operative previews with destinations as metadata. |
| Mobile navigation | Menu opens offline; links are local pages/anchors. Menu closes on link activation. |
| FAQ / anchors | All anchors resolve; all FAQ answers open and remain readable under file:// checks. Both route designs have a usable final invitation and footer. |
| Reduced motion | Emulated preference produces `scroll-behavior:auto`; animation/transition disabled. No parallax or autoplay. |
| Alt / images | Product SVG crops have descriptive role/labels. Image assets load offline; decorative brand icon has empty alt within a named brand link. Product/source descriptions were reviewed against visible pixels. |
| Repeated assets / scale | One approved populated journal repeated deliberately twice on Home; single instance on Journal. Same cropped atmosphere reused on Home only. Full mobile Insights screen replaces the too-small initial pair. No accidental double-rendered responsive image. |
| Contrast | Authored palette pairs **4.64:1 minimum**, all ≥4.5:1. Conservative brightest mobile photo composite gives 6.39:1 for normal white and 4.87:1 for dim caption text. Source screenshot/badge pixels are unaltered and are not certified as an app accessibility audit. |
| Offline / network | Gallery and both pages work through file://. Local scripts/styles/SVG image sources load; consent, FAQ, menu and modal work. Zero external page requests and exceptions observed. |

Receipts: [matrix](evidence/matrix-verification.json), [offline review](evidence/review-verification.json), [static/asset/contrast](evidence/static-verification.json), [baseline byte manifest](evidence/baseline-byte-manifest.json), [all captures](CAPTURE_INDEX.md).

## Publication firewall and limits

The only workflow is `.github/workflows/deploy.yml`: push **main** or explicit workflow_dispatch. A push to `codex/cid-web-cro-03-design` does not match the deployment trigger. No main push, PR, merge, workflow dispatch, Pages settings change, public preview, production asset edit, Android mutation or analytics change is part of this task.

This is self-review, not independent review. No physical phone, Safari, Firefox, screen reader, live consent integration, live attribution click, page-speed claim, owner acceptance, photography rights approval or conversion lift was tested/claimed. The prototype intentionally does not implement the production tracking/consent runtime. A future implementation must preserve those contracts under separate authorisation.
