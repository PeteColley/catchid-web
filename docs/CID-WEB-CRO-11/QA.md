# CRO-11 — verification receipt and sceptical review

20 November 2026. Evidence-only branch `codex/cid-web-cro-11-final-readiness`, based on approved `537dbc0945452ed66dbd74ef4400a1d04db31c9c`. No production implementation, dependency, lockfile, workflow, Android or privacy repository change.

## Orientation and preservation

Fresh GitHub Android main was `35cbf6d562d6f42906e33c5c7be95d0b95800ad7`; current PROJECT_STATUS blob `a811c048466f36fe8f6f505e481ca2ce7db08a45` and AGENTS blob `edaa7694c58fd4e855dba2ac8e63bb46eb357353` retain the reviewed continuity/invariants. Owner-confirmed release evidence is newer than the historical release language. Website status, CRO-09 readiness/assets/security/publication reports, CRO-10 handover/QA and actual workflow/source were inspected. Remote main `42c997c13712a432c8e2384915aaa010a16d068b` and CRO-10 `537dbc0` matched the requested baseline; no CRO-11 branch existed before creation.

[Worktree inventory](evidence/worktree-orientation.json) records tracked/untracked/upstream/ignored state across 28 worktrees. Unrelated dirty Smart Locations work, ignored app/build/release/test artifacts and historical emulators remain untouched. A new isolated CRO-11 worktree/branch was created from the exact approved commit; no reset/clean/rebase/force-push/merge or branch switch in a dirty tree.

Pages remains workflow-based, publishing from main. The workflow triggers only main push or manual dispatch, neither performed. Latest pre-task deployment remains successful run `42503395484`, 8 November, main `42c997c`; nine total existing runs. The isolated review-branch push does not match a deployment trigger.

[Final precommit readback](evidence/final-precommit-checks.json) confirms website/CRO-08/CRO-09/CRO-10, Android and privacy heads, unchanged Pages settings/run count, all local report links and all 27 unrelated worktree states. [Cleanup](evidence/cleanup.json) records closure of task-only loopback/browser/emulator processes; new and historical userdata/evidence remain preserved. [Screenshot manifest](evidence/screenshot-manifest.json) records original PNG dimensions and SHA-256 hashes.

## Real command results

Fresh Windows x64, Node **24.21.0**, npm **11.19.0**. [Machine-readable results](evidence/windows-command-results.json), readable `.log` files and byte-preserved `.raw.log.gz` files are retained.

| Command | Actual result |
| --- | --- |
| `npm.cmd ci` | PASS, exact lock; no dependency/lock change. One existing moderate npm vulnerability entry remains; not a clean security audit. |
| `npm.cmd run check` | PASS, 53 files, 0 errors, 0 warnings, 10 historical/QA hints. |
| `npm.cmd run build` | PASS, exactly two intended pages. |
| `npm.cmd run verify` | **FAIL**, original known Windows CRLF comparison in SiteInteractions. [Unmodified failure](evidence/npm-verify-plain.log). |
| `node docs/CID-WEB-CRO-06/qa/verify-baseline.mjs` | PASS, existing in-memory normalisation only; unchanged assertions. [Log](evidence/npm-verify-normalised.log). Not a plain-verifier or Linux pass. |
| `git diff --check` | PASS; repeated for final staged delivery. |
| `qa/scope.mjs` | PASS: 955 baseline files preserved in Git/content; 48/48 output bytes match approved CRO-10; no production diff; exact two pages. [Manifest](evidence/scope.json). |
| `qa/device-check.mjs android android-chrome-final` | PASS, both routes, actual Android browser; no failures/runtime errors/unexpected external requests. |
| Native zoom 200% / final isolated 400% | PASS with documented scroll-panel qualification; both routes. [Device report](DEVICE_ACCESSIBILITY.md). |
| Linux / physical devices / Safari / spoken reader | **UNTESTED**, not passed by analogy. [Availability](evidence/environment.json). |

`npm.cmd` is the standard npm Windows launcher. The first `npm ci` invocation selected npm.ps1 and was blocked by Windows execution policy before npm ran; [initial result](evidence/npm-ci-launcher-initial.log) retained. No Windows policy was changed. The successful standard launcher ran the same requested npm command.

## Evidence integrity and limits

- Fresh `dist` is byte-identical to the CRO-10 output used by the loopback server: pages, optimised photographs/screenshots, metadata, robots, sitemap, CNAME and inline consent/attribution scripts are unchanged. The normalised verifier validates all original asset/privacy/badge/metadata assertions. No new external resource, concept art or exposed diagnostic output was introduced.
- New test harnesses and gallery exist only under docs; no production QA dependency was added. Scripts use the previously installed external Playwright tooling. The same-day CRO-09 security review remains applicable to the unchanged actual lock/static path, including Astro and Node maintenance qualifications; no fresh broad clean-audit claim or package upgrade.
- The initial raw worktree-byte comparison flagged newly checked-out CRLF text versus LF files retained in the earlier worktree. [Initial scope result](evidence/scope-initial-worktree-bytes.json) preserved; final report explicitly lists only-checkout-line-ending differences and verifies empty production Git diff. Binary assets and all generated files match exactly. No source file was rewritten to hide this.
- Native zoom was performed through the [computer-use skill](C:/Users/chen2/.codex/plugins/cache/openai-bundled/computer-use/26.1111.21308/skills/computer-use/SKILL.md), in a new dedicated Chrome profile. Only that returned task window was selected. Initial Node REPL Playwright launch/connection attempts failed (module export, remote-debugging pipe, sandbox loopback EACCES); an authorised standard process launch and CLI CDP client succeeded. No user browser/session data was used.
- Initial device harness waited indefinitely decoding offscreen lazy images; stopped, preserved its screenshots, then used real scrolling and bounded loaded-image decode. No production loading behavior changed. Initial Android FAQ and strict 400% visibility failures, and a separate diagnostic 400% run, are retained. The final isolated acceptance run had no concurrent UI actions and passes; [device report](DEVICE_ACCESSIBILITY.md) explains qualifications instead of erasing failures.
- Default desktop Playwright screenshots at native zoom are clipped diagnostics. Accepted visual evidence uses the real compositor (`fromSurface:false`) and native-window capture; images are unedited. Android compositor screenshots are genuine emulator browser output. This does not convert emulator evidence into physical-device evidence or UI-tree inspection into spoken-reader testing.

## Sceptical self-review

This is a **self-review**, not an independent reviewer. The two originally confirmed defects are closed: CRO-10 focus contrast and owner-confirmed live privacy wording. Ownership confirmation closes the missing embedded fish-photo rights evidence without inventing fictional catch data or fresh UI provenance. The Pexels image remains third-party licensed. No new material functional defect was confirmed by Android/zoom checks. At 400% the consent panel requires internal vertical scrolling and can clip a focus ring edge; this is openly qualified, with complete controls and operation verified. A small marketing page can reasonably proceed after bounded preflight/owner acceptance without a speculative redesign, but a blanket accessibility/physical-device/Linux PASS would be false.

Final verdict and remaining conditions: [FINAL_READINESS](FINAL_READINESS.md). Publication decision is [explicitly unapplied](PUBLICATION_DECISION.md). Android main is untouched; no Android continuity write is required for this website-only evidence record.
