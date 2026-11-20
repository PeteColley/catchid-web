# CRO-09 — verification and sceptical review

20 November 2026. Audit branch `codex/cid-web-cro-09-readiness` begins at approved CRO-08 `94a4f5ed343b70e7f992556acb1a037158ebb9c4`. Only this folder and root PROJECT_STATUS are authorised changes. Final verdict: **NO-GO / AUDIT ONLY / NOT LIVE**.

## Orientation and preservation

Fresh GitHub reads covered Android main AGENTS (blob `edaa7694c58fd4e855dba2ac8e63bb46eb357353`) and PROJECT_STATUS (`a811c048466f36fe8f6f505e481ca2ce7db08a45`), current website status/source/workflow, CRO-06 handover, CRO-07/07A recovery/provenance and CRO-08 handover/QA, plus CRO-01A and DEPS-01 dependency evidence. Android main is `35cbf6d562d6f42906e33c5c7be95d0b95800ad7`. No Android file was edited; [continuity proposal](ANDROID_CONTINUITY_PROPOSED.md) is unapplied.

Website remote heads were verified: main `42c997c13712a432c8e2384915aaa010a16d068b`; CRO-06 `8d0731f361b94a81523bfe07f528b7fdb365ccb4`; CRO-07A `aa818647e3acd7537e92774fb7b2f437388aa7ce`; CRO-08 `94a4f5ed343b70e7f992556acb1a037158ebb9c4`. CRO-09 did not exist before this task. Fetching did not reset, overwrite, rebase, clean or merge other work. [Initial worktree inventory](evidence/worktree-orientation.json) covers 25 worktrees. The seven unrelated dirty files in `cid-free-02a` retain their previous hashes. Existing ignored build/cache/dependency directories and historical evidence were preserved.

[Static audit](evidence/static-audit.json) independently checks **615 baseline tracked files**, excluding only root continuity, against the approved Git blobs; checks all eight content-source hashes and all **16** newly captured screenshot derivatives; and compares all **48 generated output files byte-for-byte** with the approved CRO-08 build. It confirms exactly two pages and no added production dependencies or output diagnostics. [Reproducer](qa/static-audit.mjs).

## Commands and actual results

| Command/check | Real result | Evidence |
| --- | --- | --- |
| `npm ci --offline --cache ../cid-web-cro-02/.npm-cache --no-audit --no-fund` | PASS, exit 0; same locked install, 263 packages | [Log](evidence/npm-ci.log) |
| `npm run check` | PASS, exit 0; 0 errors, 0 warnings, 3 existing hints | [Log](evidence/npm-check.log) |
| Final `npm run check` after audit scripts | PASS, exit 0; 45 files, 0 errors/warnings, 4 hints (three existing; one audit callback async-style suggestion) | [Final log](evidence/npm-check-final.log) |
| `npm run build` | PASS, exit 0; 2 pages / 48 files | [Log](evidence/npm-build.log) |
| `npm run verify` | **FAIL, exit 1**, known SiteInteractions CRLF-vs-LF equality assertion | [Unmodified failure](evidence/npm-verify-plain.log) |
| `node docs/CID-WEB-CRO-06/qa/verify-baseline.mjs` | PASS, exit 0; existing assertions unchanged, one source read normalised in memory | [Log](evidence/npm-verify-normalised.log) |
| `node scripts/verify.mjs` in independent explicit LF Git archive | PASS, exit 0, unmodified verifier on Windows; **not Linux execution** | [Log](evidence/unmodified-lf-checkout-verifier.log) |
| `node scripts/verify-dependencies.mjs` | PASS for the fixed historical 32-advisory set | [Log](evidence/historical-dependency-guard.log) |
| `npm audit --json` | **Exit 1: one affected Astro entry / two new advisories** | [Fresh result](evidence/npm-audit.json); [exposure assessment](SECURITY_PRIVACY.md) |
| `npm ls --all --json` | PASS, exit 0 | [Tree](evidence/installed-tree.json) |
| `npm audit signatures` | PASS, exit 0; 263 signatures / 82 attestations | [Log](evidence/npm-audit-signatures.log) |
| `node docs/CID-WEB-CRO-09/qa/browsers.mjs <engine> matrix` | PASS, exit 0 for all three engines; 168 cases; 18 axe scans report zero violations, incomplete contrast retained | Engine matrix JSON in [gallery](index.html) |
| Same script, `interactions` | Completed assertions PASS, 60 groups; Firefox local-IP warnings and WebKit link-Tab limitation explicitly retained | [Browser report](BROWSER_ACCESSIBILITY.md) |
| `node .../edges-performance.mjs <engine>` | **Exit 1 solely for focus contrast** in final runs; 66 edge/text and 18 delivery cases otherwise pass | Each engine's `edges-performance.json` |
| `node .../focus-contrast.mjs` | **FAIL, exit 1**: real focus contrast 2.661468/2.995294, required 3 | [JSON](evidence/focus-contrast.json) |
| `node .../domain-cookie.mjs` | PASS: host/domain cookies removed, unrelated cookie retained, no errors | [JSON](evidence/firefox/domain-cookie.json) |
| `git diff --check` | Required final clean result recorded in delivery receipt below | Documentation-only diff; no production changes |

[Mandatory command exit record](evidence/commands.json). Node 24.21.0 / npm 11.19.0. The first default Git archive inherited Windows conversion and reproduced the same CRLF failure; [retained log](evidence/default-archive-verifier.log). A second archive created with `git -c core.autocrlf=false archive` supplied LF source and passed unchanged verification. Neither archive changed the working tree or Git configuration. WSL/Linux/container tooling was absent; the deployed Ubuntu/native-image combination remains **UNTESTED**.

The offline gallery was browser-rendered at 1280×900: all 15 linked evidence images loaded, all local report/image references resolved, no overflow, no scripts or external requests. [Browser receipt](evidence/index-browser.json), [screenshot](evidence/index-browser.png). Only task-owned loopback servers were used; they are stopped before delivery.

The first staged whitespace check identified trailing whitespace emitted by npm and a blank line in an audit script. Only new audit text was tidied. [Raw command logs](evidence/raw-command-logs.zip) retain the original unmodified outputs; the readable `.log` copies remove trailing whitespace/extra final blank lines only. [Evidence manifest](EVIDENCE_MANIFEST.json) hashes binaries exactly and text with LF-normalised line endings for portable readback.

Initial harness/probe issues are not hidden: WebKit's hard-coded Tab assumption and Firefox cookie diagnostics are retained as `interactions-initial.json`; premature lazy-image decoding assumptions are retained as `edges-performance-initial.json`. The browser report explains the evidence-driven harness corrections. A source-audit setup typo for `sitemap-0.xml` was corrected to the actual `sitemap.xml`; an audit probe initially written at the wrong path was removed only after its hash matched the intended duplicate. No production fix was made. Final raw findings still fail where the product actually fails.

## Sceptical review

First pass reviewed the existing original artwork, genuine captures and actual browser-rendered mobile/tablet/desktop composition. Second pass challenged optimistic automation: inspected 320px full-width Record/Journal, first-visit consent, enlarged text, and actual focus styles. This found the focus contrast defect despite zero axe violations. The 2×/320px header is crowded and needs actual zoom acceptance; 1.6× is usable in tested cases. The tall authenticated product examples remain honest, readable at normal primary-label/value level and consistent with the approved direction. No redesign is proposed.

The privacy link was actually fetched (HTTP 200), not merely syntax-checked; its stale Production/no-advert statement is a confirmed content problem. Historical photo ownership/data use remains unknown; no inference of permission was made from publication. No fresh Play Console, physical device, Safari or spoken screen-reader acceptance is claimed. Local timing measurements are not field performance. The consent tests use inert intercepted analytics, not real Google ingestion. Source-backed functionality is not equivalent to current release delivery evidence.

## Safety and delivery receipt

Only audit documents/evidence and website continuity are changed. No main push/merge, workflow dispatch, deployment, public preview, DNS/hosting, Android application/release, Play, backend/Firebase, dependency/lock or advertising/outreach action. catchid.app remains untouched. The existing publication workflow was inspected only. Remote push/readbacks and final worktree state are appended after delivery; the final response identifies the final audit commit.
