# CRO-10 — keyboard focus contrast

20 November 2026. **IMPLEMENTED — REVIEW CANDIDATE — NOT LIVE.** Branch: `codex/cid-web-cro-10-focus-contrast`, isolated from audited `68661d45ab5795d3b904b058d4ad71a9f04ad96d`; approved implementation beneath it is `94a4f5ed343b70e7f992556acb1a037158ebb9c4`.

The focus-contrast defect is corrected for the tested candidate. No new overall publication-readiness verdict or publication authority is implied. Pete's current instruction confirms the separate privacy correction is publicly visible: **CRO-09 G10 CLOSED — OWNER-CONFIRMED LIVE**. The privacy repository was not accessed or changed by this task.

[Before/after gallery](index.html) · [QA and limitations](QA.md) · [Sceptical review](REVIEW.md) · [Exact CSS diff](evidence/focus-css.diff) · [Contrast measurements](evidence/contrast-summary.json).

## Exact implementation

Only production file changed: `src/styles/global.css`, 14 inserted lines / 2 replaced lines. No content, component, script, dependency, asset or workflow edits.

- Define `--focus-ring:var(--teal)` (`#006c70`) on `:root`.
- Set `--focus-ring:#c57e23` on `.hero-shell,.insights-section,.final-invite,.mobile-menu nav,.home-page .skip`, and on the existing mobile `.consent` rule.
- Set `--focus-ring:var(--paper)` (`#f7f4ed`) on `.hero-shell .site-header>nav`. At tablet width with enlarged text, this navigation can overlap the photo; the pale indicator retains strong contrast there.
- Change the existing `button:focus-visible,a:focus-visible,summary:focus-visible` outline and `#analytics-title:focus-visible` outline to `3px solid var(--focus-ring)`.
- Keep the desktop general offset at 6px and analytics heading at 4px. Add `.play-badge:focus-visible { outline-offset:1px; }` for all widths, and use a 4px general offset at widths ≤760px. These focus-only offsets keep the complete ring inside the viewport and clear of badge captions; no control moves.

Unfocused styles remain unchanged. Colour variables are consumed only by the two existing `:focus-visible` outline rules. The homepage skip link retains gold against the dark header; the landing-page skip link remains teal against its light header. Mobile navigation on the light landing page explicitly inherits gold inside its dark menu. No mouse-only custom focus decoration was introduced.

## Measured contrast

Ratios below are displayed to three decimals; pass/fail uses unrounded values. All visible outline strokes remain 3 CSS pixels.

| Surface / state | Before | Final | Result |
| --- | ---: | ---: | --- |
| Journal sage `#e3e9df` | 2.661 | **5.027** | PASS |
| FAQ/footer paper `#f7f4ed` | 2.995 | **5.658** | PASS |
| Landing header/desktop consent `#eeeae0` | 2.739 | **5.173** | PASS |
| Hero navy `#071c2a`, retained gold | 5.281 | **5.281** | PASS |
| Homepage desktop navigation on navy, now paper | 5.281 | **15.819** | PASS |
| Mobile consent `#102d39`, retained gold | 4.382 | **4.382** | PASS |
| Actual photo behind tablet navigation, 768px / 1.6× text | 2.497 in first correction pass | **7.479 minimum** | PASS |
| Actual patterned final-download backdrop, worst sampled ring pixel | — | **3.671 minimum** | PASS |

The original CRO-09 reproducer fails on the unchanged baseline and passes on the candidate with identical assertions. Three engines measured **2,112 focus states** across both routes, 320/390/768/1440px, first visit/saved rejection and normal/1.6× text. All focus contrast, full-ring viewport/ancestor bounds, overflow and pointer-modality assertions pass. An additional **28 painted-background cases** measure the actual photograph/decorative backdrop underneath opaque outline pixels. This matters: inherited background colours alone missed the tablet-photo issue and an outline crossing badge text in the first pass.

The [WCAG non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) requires at least 3:1 against adjacent colours without rounding up borderline results. This handover closes the scoped focus defect for the tested conditions; it is not a whole-site conformance certificate.

## Preservation and verification

Install, check and build pass; exactly two pages. `npm run check` reports zero errors, zero warnings and four existing hints. The plain Windows verifier fails at the documented unchanged SiteInteractions CRLF comparison. The existing in-memory wrapper passes every unchanged assertion. `git diff --check` passes. No dependency upgrades or lockfile changes; `npm ci` still reports one moderate vulnerability, already part of the separate maintenance review.

All 41 other production source/public/script/workflow files are byte-identical to the audit worktree. Of 48 generated files, 45 are byte-identical; only the CSS bundle and the two HTML stylesheet references change. Both pages' complete non-style HTML, including inline scripts, remain byte-identical. Two official Play badges per route, attribution, consent behaviour, image provenance and page structure are preserved. [Scope evidence](evidence/scope.json).

Responsive/interaction regressions: **96 matrix cases, 60 interaction groups, 18 axe scans**, zero reported axe violations or assertion failures. See QA for WebKit/Firefox qualifications. Unfocused browser review found no layout/content/asset change. The final controlled comparison has 15/16 exact pixel matches; the remaining rotated SVG image raster difference and earlier comparison failures are explicitly retained, not called a complete pixel-identical pass.

## Independent publication gates still open

- Historical Journal/Records/Insights/ID fidelity, example-data and embedded-photo rights acceptance; final Pexels intended-use/third-party-rights sign-off.
- Actual Safari, clean physical Android/iPhone, spoken screen reader, native browser zoom/reflow and remaining Apple keyboard acceptance. Windows WebKit is not Safari.
- Unpublished clean Linux/Node 24 install/check/build/plain-verifier preflight. Windows LF/normalisation evidence is not Linux execution.
- Current Play Production evidence remains owner-confirmed 1.2.15/35, without fresh direct Console readback; retain the CRO-09 owner evidence decision for version-dependent claims.
- Pete's separate approval of the exact website publication candidate and separately authorised publication process. This task does not merge or deploy anything.

No main push, merge, deployment, public preview, catchid.app, Android/Play, Firebase, privacy-policy, advertising or outreach changes. Deployment remains restricted to a push to website `main` or manual workflow dispatch; neither was invoked.

**Recommended next action:** Pete and ChatGPT review the CRO-10 evidence and accept this focused correction while retaining the separate publication gates.

## Delivery receipt

The final remote verification is recorded after the review-only push. Implementation and documentation remain on the isolated branch.
