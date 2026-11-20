# CRO-10 verification receipt

20 November 2026, Windows, Node 24.21.0, existing locked npm tree. Actual browser engines: Chrome 157.0.8103.79, Firefox 159.0 (Playwright 1572), Windows WebKit 27.2 (2388). Playwright 1.65.1 and axe-core 4.14.1 reused from the sibling `cro09-runtime`, outside repository dependencies. No browser/profile, Android device or user journal data was used.

## Orientation and isolation

Current remote heads matched the supplied baseline: website main `42c997c13712a432c8e2384915aaa010a16d068b`, CRO-08 `94a4f5ed343b70e7f992556acb1a037158ebb9c4`, CRO-09 `68661d45ab5795d3b904b058d4ad71a9f04ad96d`; no pre-existing CRO-10 branch. Android main remained `35cbf6d562d6f42906e33c5c7be95d0b95800ad7`. Latest Android status and AGENTS were read via GitHub (unchanged blobs `a811c048466f36fe8f6f505e481ca2ce7db08a45` and `edaa7694c58fd4e855dba2ac8e63bb46eb357353`), alongside website continuity, CRO-09 browser/readiness reports, reproducer, CSS and workflow.

Existing tracked worktrees were clean, with prior ignored `.astro/`, `dist/`, `node_modules/` and `.npm-cache/` retained where present. An isolated worktree was created from the exact audit commit; no reset, clean, rebase, force-push or opportunistic merge. [Worktree inventory](evidence/worktree-safety.json). The unchanged GitHub workflow triggers only for main pushes and workflow dispatch. All browsing used loopback servers, baseline at 4192 and candidate at 4191, never a public preview.

## Commands and real outcomes

| Command | Outcome / evidence |
| --- | --- |
| `npm ci` | PASS, exact lockfile; 263 packages added; one moderate advisory reported; no fixes/upgrades. [Log](evidence/npm-ci.log) |
| Baseline `npm run build` | PASS before CSS editing; copied only to sibling runtime for comparison. [Log](evidence/baseline-build.log) |
| `npm run check` | PASS, 0 errors / 0 warnings / 4 hints. [Log](evidence/npm-check.log) |
| `npm run build` | PASS, exactly two pages, 48 files. [Log](evidence/npm-build.log) |
| `npm run verify` | **FAIL**, known Windows CRLF equality defect only. It did not pass. [Unmodified failure](evidence/npm-verify-original.log) |
| `node docs/CID-WEB-CRO-06/qa/verify-baseline.mjs` | PASS, unchanged original assertions; normalises only the SiteInteractions source read in memory. [Log](evidence/npm-verify-normalised.log) |
| `git diff --check` | PASS. [Command exit codes](evidence/command-results.json) |
| CRO-09 `focus-reproducer.mjs` | Unchanged contrast assertions; only URL/output destinations parameterised to preserve historical files. Baseline exit 1; final exit 0. [Before](evidence/reproducer-before.json), [after](evidence/reproducer-after.json) |
| `qa/focus-review.mjs` in three engines | 704 focus measurements per engine, all focus assertions PASS. Chromium's combined command also performs an unfocused screenshot comparison and exits 1 for two pixel mismatches; do not interpret that as a focus failure or claim the whole command passed. [Chrome](evidence/focus-chromium.json), [Firefox](evidence/focus-firefox.json), [WebKit](evidence/focus-webkit.json) |
| `qa/painted-contrast.mjs` | Final PASS: 28 actual-background samples; minimum 3.6707326307. [Result](evidence/painted-contrast.json) |
| `qa/browsers.mjs ENGINE matrix/interactions` | All six regression runs PASS: 96 matrix cases, 60 interaction groups, 18 axe scans with zero reported violations. Raw engine directories retain results and incomplete axe items. |
| `qa/scope.mjs` | PASS: only global CSS changes production source; 41 other files byte-identical; non-style HTML and inline JS unchanged; 45/48 generated files unchanged. [Result](evidence/scope.json) |
| `qa/unfocused.mjs` | **Qualified visual result, exact-pixel assertion exits 1**: 15/16 PNG/RGBA comparisons identical, one differs only inside the existing rotated Journal SVG screenshot. No geometry difference in any of 16 cases. Details below. [Result](evidence/unfocused-final.json) |

Reproduction: from repository root, serve the preserved baseline and final `dist/` on loopback 4192/4191, then run the scripts in this folder. `BASELINE=1` chooses the original reproducer baseline. The build artifact and runtime browser binaries are local test prerequisites, not production dependencies.

## Coverage and safeguards

Both routes at 320, 390, 768 and 1440px, first visit and saved consent, normal and 1.6× computed text. The inventory tests every displayed button/link/summary, mobile menu links and analytics heading under keyboard modality, including the light landing header, sage Journal, paper FAQ/footer, dark hero/Insights/final invite and dark mobile consent. Full ring bounds are tested against viewport and overflow ancestors. Pointer activation does not acquire a custom keyboard focus outline.

Regressions cover sequential keyboard navigation, mobile menu/FAQ operation, consent reopening and heading/opener focus restoration, equal choices, rejection/acceptance/persistence/withdrawal, blocked storage and no-JS fallback, reduced motion and image loading. Exactly two official badges per route, correct package/page attribution and install-referrer forwarding remain; scripted clicks produce one consent-gated event each. Requests are intercepted: no live GA request, event submission or Play navigation is sent. No unexpected external resources or runtime exceptions were observed.

Firefox produces eight known loopback invalid-domain cookie warnings in withdrawal checks; assertions pass, and these are retained as warnings, not hidden. CRO-09's separate domain-cookie proof remains historical evidence. Windows WebKit Tab skips anchors in its default shell. Native Tab reaches Menu; the inherited harness uses programmatic link focus to test Enter navigation. This does **not** certify sequential WebKit anchor traversal, Apple keyboard preferences or Safari.

The 18 axe scans are automated assertions, not spoken screen-reader acceptance or full conformance. Physical devices, actual Safari, native browser zoom, assistive technology and Linux execution remain UNTESTED here. Computed 1.6× text is not native browser zoom. CRO-09's 2×/320px header crowding and small embedded screenshot labels remain outside this change.

## Deliberate review and retained failed checks

1. First pass used teal on light and gold on dark surfaces. Computed contrast passed, but inspection identified the old mobile badge outline extending four pixels beyond the viewport, a possible one-pixel header outline loss after focus scrolling, and the desktop badge outline crossing its caption. Focus-only offsets now avoid these defects without moving content.
2. Painted-background testing found a genuine **2.496916:1** gold outline on the photograph behind the 768px enlarged desktop navigation. The pale navigation outline fixes it to **7.478999:1** minimum. [Initial failed painted result](evidence/painted-contrast-initial.json) is retained. Extremely low initial badge ratios were real caption intersections, not automatically dismissed as a harness issue. Final painted minimum across all cases is 3.670733:1 over decorative lines.
3. Cross-context unfocused comparisons initially passed 16/16, then produced two byte mismatches during the final combined run. A separate run found one difference within the rotated Journal SVG. The final controlled comparison applies the real baseline and candidate built CSS to the same loaded DOM, whose non-style HTML is independently byte-identical. It produces **15/16 pixel-identical cases**; the remaining difference is the 320px first-visit landing-page rotated Journal image (16,689 pixels in bounds x42–255/y442–703). This is recorded as a rendering/capture limitation, not declared an exact-pixel pass. Earlier mismatch screenshots/results are retained; no image pixels were edited.
4. Computed comparisons show identical element geometry in all 16 cases and identical resolved styles in 14. Two full-page homepage comparisons differ in auto-margin serialization on `.journal-layout`, with identical boxes and identical screenshot pixels. No related CSS rule changed. Combined with identical source/images/non-style HTML and visual inspection, no unintended design change was identified. The exact cause of the browser's rotated SVG raster variation was not established; no production workaround was added.
5. An initial output-tree comparison assumed CSS bundle filenames would be stable and stopped on the expected new content-hashed filename. The corrected scope checker inventories both trees and permits only the new CSS and its two HTML references. No production assertion was weakened.

No independent reviewer was used; this is a sceptical self-review. [Visual assessment](REVIEW.md). All screenshot files are actual browser captures, with original failed attempts retained. The historical CRO-09 evidence is unchanged.

The first staged `git diff --check` caught trailing whitespace emitted by Astro in command logs and a blank context line in the saved diff. Raw command logs are preserved byte-for-byte in [raw-command-logs.zip](evidence/raw-command-logs.zip); readable `.log` copies trim trailing whitespace only. The CSS diff uses zero context to remain a valid, whitespace-clean patch. No test result or assertion was altered. Final staged diff validation was rerun before committing.
