# CID-WEB-DEPS-01 — targeted dependency remediation

6 November 2026 (UTC / Europe-London). **IMPLEMENTED on `codex/cid-web-deps-01`; review branch only, NOT DEPLOYED.** The exact final pushed SHA is recorded in the delivery receipt and Android `PROJECT_STATUS.md`. Pete authorised remediation, verification and branch/continuity pushes, not website integration or publication. Unchanged visuals retain their existing approval.

## Baseline and scope

Safe fetches found website `main`/`origin/main` at published **`9fbef55613daded6e0d1c23bc616d8a91dca9f52`**, clean and 0 ahead / 0 behind. Android `main`/upstream was **`c35dc725e986b0521d2f3d622370ac672bc69788`**, also clean and synchronized. No existing dependency-maintenance branch or newer maintenance commit was found. Latest Android guidance/status, the [original security assessment](../CID-WEB-CRO-01/DEPENDENCY_REVIEW.md), its evidence, package files, configuration, workflow and the authoritative publication receipt were read.

A fresh isolated worktree was created from website `origin/main`. Existing environments, ignored `.astro/`, `.npm-cache/`, `dist/`, `node_modules/`, other worktrees and divergent `measurement/play-store-attribution` at `7db93560fb7aa94cd33f71bcdb437362abc9c0a2` were preserved. Website main and the published site remain at the baseline above.

Only `package.json`, `package-lock.json`, new `scripts/verify-dependencies.mjs`, this handover and its evidence change. Existing website source, CSS, content, original assets, configuration, deployment workflow and both existing verification scripts are unchanged. No direct dependency was added; only the Astro floor changes from `^7.3.1` to `^7.3.3`. No final override is present. No dev/preview server was started, no global tooling was changed, and no workflow was dispatched.

## Resolution and compatibility

| Package | Baseline | Final lock / installed |
| --- | --- | --- |
| Astro | 7.3.1 | **7.3.3** |
| Vite, including bundled editor | 8.2.2 | **8.2.4** |
| Sharp | 0.35.4 | **0.35.5** |
| devalue | 5.9.2 | **5.9.3** |
| fast-uri | 3.1.7 | **3.1.9** |
| smol-toml | 1.8.0 | **1.9.0** |
| source-map-js | 1.2.1 | **1.2.2** |
| npm undici | 8.10.2 | **8.12.2** |
| Zod | 4.5.4 | **4.6.6** |

Fresh official registry metadata confirmed availability, Node engines and dependency/peer ranges. A separate reviewer freshly read all **32 original official GitHub advisory records**: update timestamps and patched ranges were unchanged, and none was withdrawn. These are the smallest compatible releases addressing that advisory set on the selected release lines. In particular, numerically higher Vite 8.3.0–8.3.2 are still affected; [Vite 8.2.4](https://github.com/advisories/GHSA-587h-7wmj-h5pm) replaces the affected editor bundle. No separate launch-editor dependency was added. [Target metadata](evidence/target-metadata.json) and [all installed/locked copies, parent ranges and per-ID resolution](evidence/dependency-verification.json) are retained.

Exactly **39 lock entries** change: root metadata, the nine targets, **26 Sharp native entries**, required Astro dependencies `@astrojs/markdown-satteri` **0.4.0 → 0.4.1** and `find-proc` **0.1.0 → 0.2.0**, plus new `verkit` **0.4.0**. Astro's manifest requires those additional dependencies and drops its own semver edge. Existing svgo 4.1.0 satisfies its adjusted range. Shiki, Rolldown, PostCSS, compiler/checker/TypeScript and all unrelated package resolutions remain unchanged. [Exact lock-entry changes](evidence/lock-changes.json).

Resolution method: temporary npm resolver constraints selected the nine minimum versions and retained compatible baseline versions, avoiding an upgrade-to-latest sweep. These were removed before verification; they are **not overrides in the delivered manifest**. Initial installed-tree resolution and dedupe attempts caused incidental upgrades/relocation and were discarded. Final npm resolution used a fresh scratch directory containing a preserved copy of the original lockfile and no `node_modules`; the generated manifest/lock were then copied into the isolated worktree. A normal unconstrained `npm install --package-lock-only --ignore-scripts` retained the result, followed by clean `npm ci`. No integrity/resolution entry was manually fabricated, no lockfile was deleted, and no user work was reset. [Temporary constraint record](evidence/resolver-constraints.json); exploratory logs/locks remain local outside the public repository.

## Audit, reproducibility and platform evidence

- Environment: **Windows x64; Node v24.21.0; npm 11.19.0; `process.versions.undici` 7.29.1**. Target engines accept this Node version; every affected locked/installed copy and parent range passed the new guard, and `npm ls --all --json` passed without invalid dependency/peer errors.
- **Before:** fresh audit completed **21:58 UTC**, exit **1**, **9 affected packages: 3 moderate / 6 high, 32 unique advisories**. Baseline locked install and tree query exited 0. [Audit](evidence/audit-before.json), [tree](evidence/tree-before.json), [command outcomes](evidence/baseline-commands.json).
- **After:** fresh audit completed **22:02:38 UTC**, exit **0**, **0 affected packages / 0 unique advisories**; service responded successfully. All original **32 IDs map to resolved installed dependency paths**, not merely a reduced npm package count. [Audit](evidence/audit-after.json), [tree](evidence/tree-after.json), [32-ID mapping](evidence/dependency-verification.json).
- `npm ci`, `npm run check` (**0 errors/warnings/hints, 12 files**), `npm run build`, `npm run verify`, `npm audit --json`, `npm ls --all --json`, `node scripts/verify-dependencies.mjs`, and `git diff --check` all passed. The existing esbuild install-script notice remains; no approval policy was weakened. [Exit codes/timestamps](evidence/after-commands.json), [verification output](evidence/after-run-verify.log).
- Lock SHA-256 before/after clean installation and all checks is identical: **`cc5348a1851e4e2cc10c7128ee4cb898d16c18c12143bec0d15459f051fa10be`**. Baseline lock was `5529401d204589b1871006d74497ecff840889ed2dbd71fa0d6ef5302343e891`.
- Windows actually loaded Sharp **0.35.5**, libvips **8.18.7**, librsvg **2.63.2**. Every platform's Sharp wrapper/native and libvips lock entries were retained and updated coherently. Linux x64 selects `@img/sharp-linux-x64` **0.35.5** and `@img/sharp-libvips-linux-x64` **1.3.4**. Actual Linux tarballs were fetched from the locked registry URLs and their SHA-512 matched lockfile integrity; the libvips tarball's `versions.json` reports **librsvg 2.63.2**, the [advisory's patched dependency](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). [Package provenance](evidence/linux-native-provenance.json), [native version metadata](evidence/linux-libvips-versions.json).
- **Linux execution was not performed:** WSL reports not installed and Docker is unavailable. Package metadata/integrity inspection does not establish a successful Linux `npm ci`, native load or build, or rule out a different global-libvips environment. No production deployment was used to obtain test evidence. Complete an isolated Linux verification before a later publication where practical. No untrusted image or SVG rasterisation was introduced.

The dependency guard checks the historical advisory set and each installed copy; it deliberately does not replace a current audit or claim future advisories are covered. It is run separately without weakening or modifying the existing site verifier.

## Output and browser regression

The comparison baseline is the actual published Pages artifact from [run 42276387618](https://github.com/PeteColley/catchid-web/actions/runs/42276387618), previously verified against all live assets. The candidate retains exactly **42 static files and two HTML routes**. **All 41 non-CNAME files are byte-identical**, including both HTML documents, CSS, every image and the inline consent script. CNAME differs only by the Windows CRLF versus Linux LF line ending and still contains `catchid.app`. Page weight is **2,203,339 bytes** versus **2,203,338**, that one newline byte only; there is no image-quality or page-weight regression. [File hashes and comparisons](evidence/regression.json).

The full existing verifier passed unchanged: five homepage/four journal Play destinations for `com.catchid.app`, expected campaigns/install referrers, UTM/gclid/gbraid handoff and deduplication, consent defaults/controls/persistence/revocation/storage failures, unchanged GA ID and `play_store_click`, correct privacy/support links, canonical/SEO/internal-link output, Home provenance and official badge hash. No client dependency bundle, extra tracker/service, server route or JavaScript artifact was introduced.

Browser checks served **only built static files** on two loopback-only servers, one for each artifact. Both pages were compared at **390×844**, **1440×1000**, and **360×800 with 1.6× text**: **six paired cases / twelve renders**, all passing. Full-page PNG hashes are identical between baseline and candidate in every case. No horizontal overflow, clipped text, changed header/badge geometry or screenshot-navigation regression was found. Header focus, eager/high-priority hero badges, lazy later badges, mobile non-navigation and desktop image/back behaviour passed. First-visit consent, saved rejection, acceptance and revocation passed; the real handler queued one event after consent and none after revocation.

Interception was registered **before navigation** in every isolated browser context; only that context's loopback origin was permitted. The exact GA loader was replaced by an inert stub and all other external traffic blocked; Play navigation was prevented after the real handler ran. No production analytics or Play visit/install occurred. The browser harness prepares visible lazy images for complete screenshots, then restores their loading attributes before assertions. Early harness attempts waiting on lazy image decoding were interrupted and corrected; these were test-harness issues, not site failures. Broader UTM/referrer edge cases are covered by the unchanged deterministic suite. Servers and browser were closed after testing. GA ingestion, real install attribution, non-Chromium browsers and conversion lift are not claimed.

Compact visual evidence (not a new design approval request):

| View | Published baseline | Patched candidate |
| --- | --- | --- |
| 390px homepage, first visit | [Before](evidence/before-390-home.png) | [After](evidence/after-390-home.png) |
| 1440px homepage, first visit | [Before](evidence/before-1440-home.png) | [After](evidence/after-1440-home.png) |

[360px / 1.6× text conversion block](evidence/after-360-large-text-cta.png). The original genuine Home capture and all other source images are unchanged.

## Review, remaining risk and publication boundary

**Separate sceptical reviewer participated.** They freshly verified the original advisory targets and parent compatibility, independently inspected the final diff, required additional Astro packages, all-copy guard, audit/install evidence and Linux native provenance, and independently executed the guard. Their final review also covered this handover, browser records/harness and the large-text CTA screenshot; they did not independently rerun the browser. **No identified blocker to committing/pushing the review branch.** Unrelated solver churn was removed before final verification. Advisory mapping wording was clarified to show Vite resolves the bundled-editor advisories; JSON BOM handling is explicit. Public evidence was screened for private data/secrets; two command logs replace the local absolute worktree path with `<worktree>`, while original logs remain local. No personal catches/photos or credentials were added. Parent self-review additionally checked browser results and scope.

**Remaining tooling exposure:** Node's embedded undici **7.29.1** still falls within all **eight** original undici advisory ranges. Updating npm undici does not fix it. Their IDs are retained in `embeddedUndiciAffected` in the [guard evidence](evidence/dependency-verification.json); a supported Node release containing at least **7.30.1 on that release line**, or another officially unaffected line, is a separate tooling follow-up. Triggers include hostile SSE/WebSocket/HTTP peers, SRI integrity tokens, custom TLS callbacks, renegotiation and specific cache/decompression compositions. The exact site has no configured remote content/font loader or those application APIs; package installation/remote tooling still has external trust boundaries. No claim is made that the local Node installation is fully patched. [Representative official advisory](https://github.com/advisories/GHSA-2m5v-pch6-74hx).

Mutable Actions/Node selection, the existing action's preliminary install before the repository lockfile guard, registry/install scripts/cache provenance and global-toolchain hardening remain separate work. Zero current npm findings is not a complete-security guarantee. Existing static-site exposure conclusions remain bounded to the inspected source and inputs.

**Ready for merge/publication review**, with the explicit unperformed Linux execution check and separate Node/toolchain follow-ups above. **NOT merged or deployed**; live website baseline remains `9fbef55613daded6e0d1c23bc616d8a91dca9f52`. No website-main push, deployment dispatch, DNS, Android code/version/release, Play, Firebase/backend, growth/outreach/campaign or automation change is authorised or performed here. Android continuity receives only the relevant status entry after the maintenance branch push.

**Recommended next action:** review this branch for a separately authorised integration/publication decision, ideally after an isolated Linux clean-install/build/native-load check. Do not reopen unchanged visual approval.
