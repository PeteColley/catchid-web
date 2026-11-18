# CODEX TASK — CID-WEB-CRO-03 · Premium journal-first website redesign · DESIGN ONLY

**Owner:** Pete Colley  
**Date/decision:** 18 November 2026  
**Status:** Approved *visual direction* and approved *design-only exploration*; **not approved for live website implementation, merge, publication, or a public preview**.  
**Repository:** `https://github.com/PeteColley/catchid-web`  
**Android continuity:** `https://github.com/PeteColley/catchid-android`  
**Target review branch:** `codex/cid-web-cro-03-design` (new, isolated; confirm availability)  
**Target review directory:** `docs/CID-WEB-CRO-03/` only.

## 1. The brief

Deliver a **beautiful, genuinely premium, responsive, full-website design prototype** for CatchID. Pete likes the approved reference mockups but rejected the visual quality of the earlier `CID-WEB-CRO-02` browser-built concepts. This is a visual-quality correction, **not another request for two generic hero variations**.

Create **one cohesive, thoroughly refined editorial/outdoor visual system**, with polished mobile and desktop presentations of:

1. The **entire homepage**, not just its first viewport.
2. The **existing `/fishing-journal-app/` landing page**, harmonised with the homepage while retaining its own search-intent purpose and tracked campaign semantics for later implementation.
3. Shared navigation, responsive header, calls to action, consent presentation, footer, and the essential styling patterns for future website work.

Both pages must work as **offline, self-contained review prototypes** under `docs/`, with a visual gallery and reproducible browser evidence. The production Astro pages and shared components **must remain byte-for-byte untouched**. **Do not deploy, merge, publish, run a workflow dispatch, change GitHub Pages settings, or claim conversion lift.**

The commercial objective is **qualified outbound click-through to CatchID on Google Play**, supporting anglers who will add catches and build a habit. This is a design hypothesis until tested on the live site after a separate future approval. The badge must feel obvious and reassuring at the decision point without turning the page into an aggressive download ad.

## 2. Reference pack — required inputs

Pete and ChatGPT have approved the premium visual direction in the attached `CatchID_CRO03_Design_Reference_Pack.zip`. Unpack the following files *for inspection*, keeping their names and provenance:

- `CatchID_JournalFirst_Hero_Desktop_Reference.png` — aspirational desktop hero composition.
- `CatchID_JournalFirst_Hero_Mobile_Reference.png` — aspirational mobile hero composition.
- `CatchID_Website_Sections_Visual_Direction.png` — section rhythm across the whole homepage.
- `CatchID_Website_Redesign_Visual_Direction.md` — strategy, content architecture, copy and authenticity rules.
- `CID-WEB-CRO-03-REFERENCE-PACK-README.md` — current constraints and correction about the existing journal landing page.

**First milestone: inspect and describe these actual images.** Identify the features to reproduce: editorial photography atmosphere; balanced dark navy/teal and light warm-paper sections; elegant serif/sans typography; generous yet controlled spacing; foregrounded real app screens; refined asymmetry; a strong mobile CTA; and premium finishing details. Briefly record what made `CID-WEB-CRO-02` look less polished by looking at its rendered evidence, rather than just reading its successful test report.

These references are **AI-generated design targets, not real CatchID screenshots**. Their illustrated app panels, catch statistics, wordmarks and Play badges are fictional, not authoritative product evidence. Never pass them off as real UI or ship the composites as production UI. Use the true CatchID brand/icon, an official Google Play badge from existing approved site assets, and genuine approved CatchID screenshot pixels. Never fabricate a catch, screenshot, species score, insight, testimonial, rating or privacy promise. Design-only photographs are placeholders until rights and suitability are established; any reused atmospheric crop must be clearly marked *concept art — not publication approved*. If authentic screenshots are insufficient for a strong composition, flag the exact asset gaps instead of silently inventing screenshots.

**If the reference ZIP is missing or unreadable, stop before designing and request it.** Do not infer the target aesthetic from this text alone. The files are to be supplied alongside this prompt. If the pack's older narrative suggests that `/fishing-journal-app/` does not exist, the repository's current source and README supersede that stale sentence: the page **does exist**.

## 3. Mandatory current-state orientation before editing

Read current remote `main` versions of:

- `catchid-android/PROJECT_STATUS.md` **in full**, `catchid-android/AGENTS.md`, latest relevant commits and release evidence. Do not infer a live Play version from Git, signed AABs or Internal Testing. No version number belongs in proposed website copy.
- `catchid-web/README.md`, `package.json`, source for `src/pages/index.astro`, `src/pages/fishing-journal-app.astro`, existing styles/components/assets, `src/components/PlayLink.astro`, `src/components/WebAnalyticsConsent.astro`, `src/config.ts`, `scripts/verify.mjs`, and relevant deployment workflow(s). Check for web-specific AGENTS instructions if present.
- Prior `codex/cid-web-cro-02-design` evidence and review; earlier `CID-WEB-CRO-01` publication history as relevant. Check remote branches/commits before assuming SHAs are unchanged.

At handoff preparation, the inspected website `main` was `42c997c13712a432c8e2384915aaa010a16d068b` (last deployment: authorised `app-ads.txt`); prior rejected design-only review branch was `codex/cid-web-cro-02-design` at `1095c41927f2f5eabd6e0ac1996325d780009530`. **Verify afresh**. Android status currently says the core is **Add a catch → Build your journal → Discover your insights**, with optional identification, current advertising, and no evidence for later production publication. The latest direct Production evidence in that status is 1.2.12/code 32 on 2 November; do not put this version on the website or claim it remains current without fresh Console evidence.

Report before edits: working directory cleanliness; tracked/untracked/ignored relevant artifacts; current branch/HEAD/upstream; remote main; whether the candidate branch already exists; dependency/build baseline; whether any push to this new review branch could trigger deployment. **Do not switch from a dirty worktree, overwrite, clean, reset, rebase, force-push, merge unrelated work, or move local evidence.** Fetch and branch safely. If isolation is not safe, pause and report the blocker, rather than damaging anything.

## 4. Product positioning and honest content

The site must now tell this story, in this visual hierarchy:

**1. Journal / logging first.** Anglers can save catches manually with or without a photograph; fish identification is not required. Show the personal fishing record that accumulates over time.

**2. Insights as the payoff.** Recorded catches can reveal personal records and cautious patterns *based on that person's saved catches*. Use honest copy such as “your most recorded species,” “based on your recorded catches,” and “see what your journal reveals.” **Never** imply catch rates, fish per hour, best-performing methods, fishing effort, predictive accuracy, causation or guaranteed improvement from catch-only data. Don't present speculative future Insights as existing features.

**3. Identification as optional help.** When unsure of a fish, take a photo for a *likely species suggestion*; explain uncertainty and correction if supported. Identification is one feature section, not the headline promise or the hero's dominant graphic.

The first impression should be **“My fishing history deserves a beautiful place to live”**. The continued story is **“And the more I record, the more meaning I can find in it.”** Avoid a clinical AI fish-scanner look, social-network positioning, broad spot-sharing claims, bloat-bashing and heavy feature icon grids.

Suggested **hero** copy (refine wording only if it improves clarity without shifting hierarchy):

- Eyebrow: `YOUR PERSONAL FISHING JOURNAL`
- Headline: **Every catch has a story. Keep yours.**
- Support: **Save your catches, photos and details in one personal journal. Discover records and insights as your fishing history grows.**
- Main CTA: official **Get it on Google Play** badge, visually high priority; in the *prototype* it must never fire tracking or leave the offline gallery.
- Microcopy, if verified: **Free on Android · No account needed to start**.
- Subtle note: **Not sure of the species? Get a likely suggestion from a photo.**

No “No Ads,” “No adverts,” “Free forever,” “No subscriptions forever,” unqualified “Private by default,” false offline claims, forced-install guarantees, fabricated testimonials or numerical app scores. The published app includes approved ads, so a prior marketing “no adverts” assertion is stale. Verify claims against source/status, qualify uncertain ones or omit them. Backups/location privacy need similarly careful feature verification. Don't invent monetisation/Pro functionality or change Android.

## 5. The full homepage — seven intentional sections

Create the following sections as a designed, connected journey. Each should have a distinctive visual reason to exist; **do not produce seven lookalike stacked cards**.

| # | Section | Message and recommended evidence | CTA guidance |
|---|---|---|---|
| 1 | **Journal-first hero** | Premium editorial atmosphere and genuine populated journal/saved-catch proof; clear headline; tasteful real fishing photography/approved concept placeholder; optional ID tertiary | Immediate official Play badge, with microcopy directly beneath |
| 2 | **Record every catch** | Show that anglers can add a catch without a photo or ID; species, optional date/weight/location/method/details only where actually supported | Light contextual link or repeated badge only if it helps |
| 3 | **Your Catch Journal** | A real, populated journal image and a catch detail; personal fishing history, photos and memories; substantial visual storytelling | Reinforce lasting value |
| 4 | **Discover Catch Insights** | Real Insights screens, personal records and genuine *recorded* distributions; explain that the view grows with the journal and may be staged/need enough data | Support return value, no promises |
| 5 | **Need help identifying?** | Secondary feature: photo-based likely species suggestion with uncertainty/alternatives/correction where verified | Keep less prominent than Journal and Insights |
| 6 | **Simple and trustworthy** | Free Android availability; verified no-account-to-start/backup/privacy facts; no speculative claims. Trust through clarity and authentic visuals | Reduce hesitation near next CTA |
| 7 | **FAQ and final invitation** | Concise accurate questions; single strong end-of-page Google Play badge; footer with existing legal/support/analytics-choice destinations | A confident last click opportunity |

The hero should lead on desktop with a beautiful asymmetrical content-and-product composition. On mobile, stack **headline → practical promise → Play badge → honest microcopy → product proof** in a readable order. The consent controls must remain accessible and balanced; they are absent from the inspirational mockups but **must be shown in the prototype**.

## 6. Existing `/fishing-journal-app/` page

The current site already has this acquisition route. Design it **as a first-class page of the same system**, with more task-specific “fishing journal app” language for visitors arriving from search. Retain journal-first truth, manual entry, authentic journal/Insights proof, optional identification and FAQ. Do not simply paste the homepage with a different title. Give it a distinct opening hierarchy and targeted copy while reusing the premium design language, shared navigation, footer, trust treatment and badge. The live route's campaign is `fishing_journal_app` (`organic`) whereas the homepage uses `website_launch` (`referral`); **design must anticipate both without changing their actual code or values**.

Future feature-specific pages for Insights or Identification may be **described as later research opportunities** in a brief note, but **do not create any new production or prototype routes** beyond the two existing page designs and the offline gallery. Preserve the actual privacy-policy destination and text. Do not invent an internal privacy page.

## 7. Visual art direction and craft standards

Follow the *level of finish* and intended visual structure of the attached images, while being critical about fictitious details:

- **Atmosphere:** premium river/trout/outdoor editorial, quiet confidence, not “generic SaaS landing page.” Authentic fish imagery where permission allows; no obvious AI-UI composites.
- **Palette:** inky navy (close to current `#071c2a`) and deep aquatic teal, paired with warm ivory/paper surfaces and restrained muted greens. Let section backgrounds and photographic crops create rhythm. The result should not be all-dark or all-white.
- **Typography:** excellent display hierarchy with a purposeful editorial serif and highly legible interface sans; use locally available/licensed resources or robust system fallbacks, no remote font network. Avoid cramped line lengths, tiny captions and excess all-caps.
- **Layout:** real grid discipline, considered asymmetry, generous but efficient whitespace, photographic/product layers, refined edge/rounded-corner handling, subtle contour/river-line details. No needless gradients, stock template icon fields, repetitive cards or oversized empty blocks.
- **Product proof:** actual CatchID screenshot pixels in high-resolution screens/frames, never fabricated screen contents. Size and position UI so real text is plausibly readable; no fuzzy pinprick screenshots. Phone/device mockups should enhance, not obscure, the content.
- **CTAs:** unmistakable official Play badge at hero and last section; clear keyboard focus and minimum 44px touch area. A small header CTA may help; avoid a huge competing secondary button. Position the badge early on small screens, without burying the trust line.
- **Responsive:** design 320px through wide desktop intentionally, not by reducing font sizes and hoping. On 390 × 844, the main CTA should be visible in the early hero with an appropriate first-visit consent treatment; do not hide consent or squeeze copy into unreadability.
- **Restraint:** avoid fake parallax, distracting motion and visual clutter. Honor `prefers-reduced-motion`.

Use Pete's approved mockups as a **visible reference** in your working process. At least **two deliberate visual refinement passes** must compare *actual rendered screenshots* with the references and improve the result. Document the critiques and substantive changes. A green build cannot substitute for a high-end design review.

## 8. Scope, implementation and hard boundaries

**Allowed:** new files under `docs/CID-WEB-CRO-03/` (offline HTML/CSS/JS, copied approved existing marketing assets, screenshots and review documents), and only the minimal support files in that directory. Do not edit production files: `src/**`, `public/**`, `scripts/**`, `package*`, `astro.config.*`, `.github/**`, `README.md` or configuration. Do not introduce dependencies. Do not embed analytics tags, live consent storage/keys, telemetry, production `PlayLink` calls or outside network requests into the gallery. Demonstration CTA should be focusable but remain in the gallery (for example, a local preview-only target). Design consent may use a *clearly labelled local simulation* of first-visit and saved-choice appearances, but never Google analytics or production preference storage.

Keep all prototypes self-contained and openable with `file://` without npm, a server, remote fonts or third-party assets. Prefer one polished concept with route switcher/navigation in `index.html` and working `home.html` and `fishing-journal-app.html`; the exact file organisation may vary as long as users can easily review both. All prototype internal links must work offline; all externally directed actions must be visibly non-operative examples. Put **DESIGN CONCEPT — NOT LIVE** visibly on the gallery and in documentation. Avoid watering down the actual mockups with large “prototype” ribbons inside the page design screenshots; label the review shell instead.

No GitHub Pages deployment, branch integration, new public route, DNS, privacy rewrite, Android source/data/console changes, Analytics/UTM/referrer changes, Ads, Pro, outreach, automations, release or paid spend. This milestone does not authorise a future production implementation. Protect the actual Play Store attribution mechanisms and both consent choices when designing their presentation. The published site's analytics is consent-gated (`catchid.website.analytics`, `G-LPXGL5VTB1`); **do not trigger real analytics during tests**.

## 9. Required visual evidence and verification

Before claiming completion:

1. Inspect unchanged main/baseline pages. Capture at least homepage and `/fishing-journal-app/` at 390px and 1440px for context. Do not compare solely against source text.
2. Use a real browser to capture both new page concepts at **320, 360, 390, 430, 768, 1024, 1440 CSS px**. Cover first-visit and saved-consent visual states and **1.6× text** on critical mobile widths. Include full-page captures and at least 390×844 and 1440×1000 first-view hero comparisons. Visual evidence must be from the actual offline prototypes, not the AI reference images.
3. Explicitly check both pages for horizontal overflow, clipping, repeated assets, odd phone scaling, text contrast (WCAG AA normal-text target 4.5:1), keyboard order/focus, 44px touch targets, sensible focus and reduced-motion behavior. Check link/anchor behavior, FAQ readability, proper alternative text, actual image source provenance and zero external requests.
4. Run repository `npm ci`, `npm run check`, `npm run build`, `npm run verify` if safe/appropriate using its required Node version. For this docs-only change also run `git diff --check` and prove **no production source changed**. Avoid local requests to live GA while testing; capture network restrictions. These commands are verification, not authorisation to deploy.
5. Make a **sceptical visual self-review** (call it self-review unless truly independently reviewed). Judge hero resemblance to approved references, perceived professionalism, actual journal-first story, consent/badge balance, mobile composition, quality of full-page pacing and authenticity. Score each area 1–5 with short reasons; **revise any critical area below 4** or explain the blocker. Include at least two iteration notes, before/after screenshot references, and any asset-related compromise. Don't certify UI as pixel-perfect because reference UI is fictional.
6. Explain whether screenshot age, missing current-version proof, missing photography rights or device/browser testing affect a possible *future* rollout. Do not claim unperformed physical-device/Safari/Firefox/screen-reader validation.

Deliver:

- An **offline gallery** `docs/CID-WEB-CRO-03/index.html` with obvious Home / Fishing Journal views, desktop and mobile evidence, and simple review instructions.
- Working offline prototype pages and all local assets used by them.
- A rich **`VISUAL_REVIEW.md`**: side-by-side crops of approved references vs actual browser results; desktop/mobile screenshots; evaluated components, visual-score notes, authentic-vs-concept assets, first/saved-consent, what improved over CRO-02, and explicit known tradeoffs.
- **`CAPTURE_INDEX.md`** for screenshot dimensions/states and links.
- **`QA.md`** with exact commands/results and manual review evidence.
- **`HANDOVER.md`** stating design-only status, all files/remote SHA, tests, limitations and *one* recommended next action: Pete and ChatGPT inspect and approve/revise this design; no implementation or publication implied.
- A **proposed, unapplied** Android `PROJECT_STATUS.md` continuity note if warranted, stored in this docs directory. Do **not** push/edit the Android repository merely to log a website design.

Keep the evidence set tidy and useful. Avoid hundreds of nearly identical images in the primary gallery; retain complete capture indexing and a concise best-of visual comparison.

## 10. Remote review handoff — publication firewall

Once the local design is verified, create a scoped commit on the new review branch containing **docs/CID-WEB-CRO-03 only**, preserving the previous CRO-02 branch. Check the repository's workflow triggers **before** pushing. Push the review branch only if no production deployment can result and remote branch publication is allowed; if unsafe, **do not push**, report the local commit and exact blocker instead. Never push to `main`, dispatch deployment, open an auto-merge PR, merge, tag a release or change production files. Verify remote branch SHA and read back the gallery/review file if pushed. If a GitHub PR is required for review, do not open one unless Pete separately asks.

In the handover, distinguish **design prototype committed/pushed** from **live website**; `catchid.app` must be unchanged. Do not suggest a measured conversion uplift. Include GitHub review links, local offline gallery instructions, one screenshot each for homepage and journal landing on desktop and mobile, and one concrete next action for Pete.

**Codex final-response format:** Put your **entire final answer inside exactly one fenced Markdown code block**, with nothing before or after the block. Include a plain-English design summary, branch and commit SHA/state, verified test results, primary links, visual quality assessment, authenticity caveats, publication status **NOT LIVE**, and one recommended next action. Avoid excess administration for Pete.

