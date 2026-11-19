# CRO-05 verification receipt

**DESIGN ONLY — NOT LIVE · 19 November 2026.**

## Baseline and isolation

- Website main: `42c997c13712a432c8e2384915aaa010a16d068b`.
- Requested CRO-04 baseline: `651ae58f39a8c2530fb600b35e91455c644351e8`, verified locally and remotely before work.
- New branch/worktree: `codex/cid-web-cro-05-hero-photography`, created directly from that baseline. Existing CRO-04 source/evidence and ignored build/dependency files were preserved.
- Latest accessible Android main: `9e9b37e9dfdc2554321602bfbada2e18227d34e7`. AGENTS blob `edaa7694c58fd4e855dba2ac8e63bb46eb357353` and PROJECT_STATUS blob `0ac34723d88ffb0a2c17e6f4c3266ab525650e0a` match the previously read CRO-04 orientation. Current instructions, recent commits and relevant status were reconciled; no Android file was changed and no production-version claim was inferred.
- New tracked work is confined to `docs/CID-WEB-CRO-05/`. There is no production source, package, workflow or configuration change.

## Existing checks

`npm ci --offline --cache ../cid-web-cro-02/.npm-cache --no-audit --no-fund` passed. No dependency input changed. Existing esbuild install-script-policy warning retained.

`npm run build` passed: the same two-page static site, 24 files; no CRO-05 page/photograph is imported into production output. [Build log](evidence/build.log).

Final `npm run check` passed: 0 errors, 0 warnings, one pre-existing unused-require hint. [Final log](evidence/check.log). An earlier run during harness construction had unused-helper hints; [that log](evidence/check-in-progress.log) is retained.

**Unmodified `npm run verify` exposes a pre-existing CRLF comparison defect in CRO-04 on this fresh Windows checkout.** Astro emits LF inline JavaScript, while `scripts/verify.mjs` line 29 reads `SiteInteractions.astro` without the newline normalisation already used for the consent source. Its strict comparison at line 92 therefore fails on line endings alone. [Original failure](evidence/verify.log).

The review-only [normalisation wrapper](qa/verify-baseline.mjs) normalises only that one UTF-8 source read **in memory**, then executes the existing verifier unchanged. Every existing assertion passes, including both full consent/attribution regression suites and four official badges. No assertion was removed and no source file was rewritten. [Passing log](evidence/verify-normalised.log). This is a documented baseline limitation, not an unqualified claim that plain `npm run verify` passed. A future implementation task can address the verifier's checkout portability.

`node --check` passes for the review server and browser harness. `git diff --check` and scoped staged checks are used before commit.

The [asset manifest](evidence/asset-manifest.json) records SHA-256 hashes for all 22 source/screenshot images and both generated variant documents. The [audit](qa/audit.mjs) confirms no changes outside this docs folder, no broken local review links, and exact recovery of baseline HTML after reversing the photo substitutions.

## Browser evidence

Chrome **157.0.8103.79**, actual browser rendering through native CDP, CSS pixels / DPR 1. Loopback-only server `127.0.0.1:4185`, isolated browser profile. No public preview.

**12/12 final cases pass:** baseline, A and B × 1440×1000 / 390×844 × first visit / saved rejection. [Machine receipt](evidence/browser-verification.json). The gallery contains all four requested first-visit screenshots, saved-state alternatives, complete heroes and two full mobile pages. Initial Photo 3 framing and its passing receipt are retained under `evidence/initial-fit/`.

For all eight variant cases, the harness compares against the equivalent freshly rendered baseline: body copy (excluding the provenance label), every non-photo/non-label element's geometry, journal markup, both script bodies and Play URLs are identical. No horizontal overflow, clipped text or failed image load; no unexpected third-party requests or page exceptions. Rejection persists on reload; mobile Menu opens and closes on the final-section anchor.

The official primary badge bottom remains **672.20px desktop / 412.73px mobile**. First-visit mobile consent starts at **703.72px**; the badge remains unobscured. The journal frame starts at **473.995px mobile**, unchanged. Source-image dimensions are verified by browser decoding.

The server additionally checks that reversing only the authorised photo/style/provenance substitutions reproduces the baseline HTML exactly. It never writes to `src/`, `public/` or `dist/`. Real consent/attribution scripts are retained. A review-server CSP blocks third-party loading/transmission even if a reviewer accepts analytics; browser interception provides a second boundary. Thus no production GA reporting is sent or claimed. Play links retain their real destinations; they were inspected, not navigated to Google Play.

Readability was visually reviewed at both sizes: cream/mint text remains on the same dark field, with existing photo fades. No new tint/brightness/contrast change was necessary. This is not a new full accessibility audit, physical-device test or conversion test.

## Reproduction

From the CRO-05 repository worktree, after installing unchanged dependencies:

```text
npm run build
node docs/CID-WEB-CRO-05/qa/verify-baseline.mjs
node docs/CID-WEB-CRO-05/qa/review-server.mjs
```

Open `http://127.0.0.1:4185/review/` for the gallery, `/?photo=a` or `/?photo=b` for the local variants, `/` for the untouched baseline. The gallery also works as an offline HTML file once screenshots exist. The server binds loopback only; stop with Ctrl+C. Screenshots: `node docs/CID-WEB-CRO-05/qa/browser.mjs`. The browser executable can be specified with `CATCHID_CHROME`.

Initial local startup failed under restricted sandbox networking. Restarting the task-owned server and browser with authorised loopback access succeeded. No failed startup is represented as a browser pass.

## Publication and remote boundaries

Only the review branch is pushed, normally; no reset, rebase, overwrite of unrelated work or force push. Deployment workflow remains main-push/manual-dispatch only; neither trigger is invoked. Remote branch/commit and exact-commit review-file readback are verified at delivery, together with clean review/original worktrees. No main/catchid.app, Android, Play Store or release change. The local server/browser are stopped at handoff.

Limitations and recommendation are in [REVIEW.md](REVIEW.md); source rights are in [PROVENANCE.md](PROVENANCE.md). The final delivery includes the exact pushed SHA.
