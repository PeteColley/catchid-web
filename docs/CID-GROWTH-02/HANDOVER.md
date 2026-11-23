# CID-GROWTH-02 — fishing journal guide and worksheet

**Completed implementation candidate — NOT LIVE.** See [DELIVERY.md](DELIVERY.md) for the exact tested commit, remote push receipt and final status. The branch is `codex/cid-growth-02-journal-guide`. No website main update, deployment, public preview, Android runtime change or marketing publication is part of this task.

## Baseline and scope

GitHub connector readback and a fresh Git fetch confirmed website main `c5a2a9ea6dee8c3b2c0457552ed789605e46f687` and Android main `55c0cc6a9ac85e03fb88e55589f74f3f6bc91b57`, matching Pete's brief. The original website main checkout was at `42c997c13712a432c8e2384915aaa010a16d068b`, 0 ahead/18 behind, with ignored `.astro`, `.npm-cache`, `dist` and `node_modules` preserved. The existing Android main checkout was `b662d238a244ad193315819ecbd1d95651a9c7c6`, 0 ahead/7 behind and clean. Neither checkout was switched, reset or advanced. Implementation uses a fresh separate worktree at the verified website main. Existing Android branches, dirty work and ignored release/evaluation/build artifacts were inspected and left in place.

Read the current Android AGENTS/PROJECT_STATUS and historical README/DECISIONS/ROADMAP, the [approved editorial draft](https://github.com/PeteColley/catchid-android/blob/26928eb6373012933754231041cd89061cdbcb97/docs/growth/CID-GROWTH-01.md), website README, source, verifiers and publication workflow before implementation. Current continuity takes precedence over historical Android release claims. This task makes no new Play release claim.

Implemented only:

- One static guide at `/guides/how-to-keep-a-fishing-journal/`, with the approved title/description/canonical and shared Open Graph metadata, header, footer and consent experience.
- The approved practical advice, labelled carp example, six/three/one bait illustration and distinction between recorded catches and success rates. Separate trip notes are explicitly manual, without a Fishing Sessions or automatic-weather claim.
- A standalone native-print worksheet: eight fields, five blank rows, optional separate trip notes, no form/account/email/payment gate. Mobile uses a readable first-row preview; all five rows print.
- One concluding official Play badge with `catchid_website / organic / fishing_journal_guide`, using the existing typed configuration and nested install referrer. The two existing pages keep exactly two badges each.
- One journal-page paragraph link and one shared footer link. Guide navigation uses valid root-page destinations for How it works and Insights; the mobile download link targets the guide's conclusion.
- Narrow verifier extensions for the third page, sitemap, guide content, print control and badge policy. The old marketing-page assertions still run on both original pages. Shared asset/consent/attribution/network/dependency assertions remain active for all three.

No dependencies, package lock, global stylesheet, consent source, analytics tests, approved source images, measurement ID, privacy destination or Pages workflow changed. No new events/cookies/SDKs. The tiny existing presentation script gains only a null-safe native-print button binding. Pages deploy remains main-push/manual-dispatch only; neither is invoked.

## Verification and evidence

- Node **24.21.0**, npm **11.19.0**. Baseline and candidate locked `npm ci`, `npm run check`, `npm run build`, `npm run verify`, and `git diff --check` completed. Baseline check: 0 errors/0 warnings/10 informational hints. Candidate check includes the same historical diagnostics plus review-harness suggestions; exact final output is retained in evidence.
- Captured command output contained trailing spaces, detected when the new evidence files were staged. Readable log copies were whitespace-normalized; exact original log bytes are retained in adjacent `.raw.gz` files. The complete candidate diff against baseline was checked again after that evidence-only correction.
- Initial unmodified Windows baseline verifier failed because the generated presentation script uses LF while Git checked its source out with CRLF. The isolated presentation source was written with LF and the **unchanged baseline assertions passed**. No assertion was removed to bypass this mismatch. Final source retains LF locally; Linux checkout is naturally LF. The baseline failure and passing rerun logs are retained.
- Three intended HTML routes, exact sitemap/robots/CNAME, title/canonical/OG, heading hierarchy, internal anchors, local image assets, official badge identity and all five nested referrers pass. The consent runtime's normalized SHA-256 remains `34836c83600fbfc1aa0464a0f1e29342189c6b50066d593411e41aa5bb6eb891`.
- **144 Chromium cases:** three pages × 320/360/390/430/768/900/1024/1440 px × first visit/saved denied/saved granted × normal/1.6× effective font and line-height. No detected horizontal overflow, clipped text, broken loaded images, invalid local anchors, overlapping header controls or unequal consent choices. Actual runtime and exact case results: [browser report](evidence/browser-report.json).
- Keyboard skip link, menu opening and destination, consent selection/reopening/focus return, saved consent, withdrawal/GA-cookie deletion, every official Play badge, inbound UTM/gclid/gbraid handoff and consent-gated `play_store_click` checked in the browser. Full deterministic existing analytics suite remains unchanged and passes on all three pages, including storage-failure, cross-tab and back-navigation cases.
- The browser runs against disposable loopback fixtures. Every external request is intercepted; the approved GA loader is an inert local response. Play navigation is prevented after the real delegated event handler runs. No real GA collection, Play visit, install or acquisition statistic was manufactured. No runtime exceptions or unexpected outbound requests.
- The existing pages' rendered `main` markup is identical to baseline after removing only the requested journal-page link. Before/after captures verify footer and paragraph placement. Source asset hashes and existing product-claim guardrails remain checked.
- Actual Chromium `printToPDF` output from the first-visit mobile guide, with and without JavaScript: **one A4 landscape page**, five blank 17 mm rows, eight columns, separate trip notes, no site chrome or promotion. PDF table structure/text/margins are checked using pypdf/pdfplumber; Poppler renders the final preview for visual inspection. [Print checks](evidence/print-verification.json), [PDF](evidence/catch-log-a4-landscape.pdf).
- Six deliberate generated-output regressions are rejected by the verifier: missing row, wrong guide campaign, broken nested anchor, altered consent script, extra badge and rejected no-photo asset text. The harness restores the exact generated file after each probe. [Negative-probe results](evidence/verifier-negative.json).
- [Complete visual review pack](REVIEW.md), [browser harness](qa/browser.mjs), [PDF verification](qa/print-check.py). Review tooling uses the existing bundled runtime, without adding project dependencies.

## Sceptical self-review

This is **self-review, not independent design/code review**. Independent GitHub readback is a remote-state check, not a second reviewer.

The review challenged the risk of turning an informational resource into an advert, confusing catches with effort, presenting trip fields as existing product features, using rejected no-photo imagery, losing nested navigation, hiding worksheet rows in print, letting analytics start early, and changing existing conversion pages. The approved full editorial substance is retained; the only Play badge appears in the conclusion; historical product imagery is truthfully labelled. Mobile row preview is explicitly explained. The real A4 page has all rows, rather than merely appearing correct in print CSS.

The first visual pass found an untidy empty cell gap in the responsive worksheet preview. Bait now spans a full row, weight and length share a row, and notes span the final row. The corrected candidate was rebuilt and browser evidence refreshed. The earlier passing technical report is retained as history, not substituted for final visual evidence. A first browser attempt was blocked by sandbox loopback access; the authorised isolated run then succeeded. PDF extraction initially treated the page rectangle and trip-note rules as additional table rows; the checker now requires exactly six complete eight-cell rows (header plus five blank catches), while retaining the measured-size and content assertions. This was a parser-boundary correction, not a print-layout change. No product failure is hidden.

The required npm install reports **one moderate affected package (Astro), with two advisories**. The [dynamic-tag XSS advisory](https://github.com/advisories/GHSA-mh32-jxcr-mh9f) requires untrusted element-name input; the [image endpoint advisory](https://github.com/advisories/GHSA-r3h5-4585-7x3w) requires an on-demand `@astrojs/node` server. Source inspection finds neither in this static site. That is an exposure assessment, not an exploit test or a clean-security claim. The lockfile and dependencies remain unchanged as requested; the audit report is retained.

## Limits and release boundary

- Browser checks use installed desktop Chromium **157.0.8103.79** and CSS viewport/effective text scaling. No new physical Android/iOS, actual Safari/Firefox, spoken screen-reader, native browser-zoom or physical printer acceptance is claimed.
- Browser print headers/footers must be disabled in the native print dialog; the page explains this. The checked PDF uses those settings. Other engines/printer drivers may paginate differently.
- The approved product crop is historical published artwork with the prior owner-attested photo-rights qualifications. It is not a newly captured current Android screen.
- No ranking, indexing, traffic, conversion or retention result is claimed. The canonical route is an implementation candidate until publication is separately approved.
- The guide and review evidence are pushed for review only. Main, Pages deployment, Android runtime/version, Play/Firebase, parked Smart Locations, growth automation, outreach and spend remain outside this implementation.

**Only recommended next action: Pete and ChatGPT review the completed resource.**
