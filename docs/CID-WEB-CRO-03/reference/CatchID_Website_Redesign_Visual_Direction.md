# CatchID website — journal-first visual direction

**Design concept only — NOT LIVE.** 18 November 2026. Product owner: Pete Colley. This is a proposed visual and content direction for review, not an authorisation to implement, merge or publish.

## Strategic position

CatchID is a personal fishing journal that becomes more useful as an angler records catches. The honest hierarchy is:

1. **Journal:** add catches with species, optional photo, dates, locations and fishing details; identification is not required.
2. **Insights:** personal records and careful patterns **based on recorded catches**, available as the journal grows. Never infer effort, catch rates, causation or the effectiveness of a method.
3. **Identify:** optional likely species suggestions from a photograph, with uncertainty and correction; never a guarantee.

The goal is **qualified click-through to Google Play**, ultimately attracting anglers who will save catches and return, not one-off curiosity clicks at any cost.

## Visual direction

The three accompanying images are **aspirational design references**:

- `CatchID_JournalFirst_Hero_Desktop_Reference.png` — desktop hero.
- `CatchID_JournalFirst_Hero_Mobile_Reference.png` — mobile hero.
- `CatchID_Website_Sections_Visual_Direction.png` — example of the longer homepage rhythm, featuring journal, Insights, optional identification and a closing CTA.

Use a premium outdoor/editorial composition: deep ink navy, aquatic teal accents, warm paper-white alternating sections, sophisticated readable typography, natural trout/river atmosphere, real product proof, strong mobile hierarchy and restrained contour-line motifs. The hero should feel like a high-quality outdoor product, not a generic software template.

**Important authenticity boundary:** These images are AI-generated *visual targets*, not screenshots of live CatchID. Their fish photos, illustrative journal/Insights/ID panels, simplified wordmark and Play badges are conceptual placeholders. No depicted example is evidence of an actual recorded catch, feature UI, identification accuracy or personal statistic. Before implementation, replace all product UI with real approved CatchID screenshots, the existing official icon/logo and official Google Play badge. Use only photographs that CatchID has appropriate rights to publish. Preserve correct product feature and privacy statements.

## Proposed homepage content architecture

| Order | Section | Core task | Primary visual proof |
| --- | --- | --- | --- |
| 1 | Journal-first hero | Explain CatchID in seconds and invite Google Play click | Real populated Catch Journal, fishing photograph |
| 2 | Record every catch | Demonstrate quick manual recording with or without photo or identification | Genuine add-catch UI and an authentic saved catch |
| 3 | Your Catch Journal | Show lasting, personal value: dates, species, photographs, places and details | Genuine populated journal and catch-detail UI |
| 4 | Discover Catch Insights | Give honest examples of personal records and recorded patterns, with available-data caveats | Genuine current Insights screens |
| 5 | Need help identifying? | Explain optional likely photo suggestion, visible evidence, alternatives/correction where supported | Genuine ID result UI |
| 6 | Simple and trustworthy | Explain free Android availability, no-account start and any verified optional backup/privacy arrangements | Simple factual copy and real UI if useful |
| 7 | FAQ and final CTA | Resolve objections and offer another official Play path | Official Google Play badge |

Possible later search-intent feature pages—fishing journal, personal fishing insights, fish identification—are **unapproved proposals**, not existing pages or part of this visual milestone. Site navigation, metadata, performance, privacy, consent, analytics and attribution require separate implementation review.

## Initial hero copy (design hypothesis)

- Eyebrow: **YOUR PERSONAL FISHING JOURNAL**
- Headline: **Every catch has a story. Keep yours.**
- Body: **Save your catches, photos and details in one personal journal. Discover records and insights as your fishing history grows.**
- Primary action: official **Get it on Google Play** badge linked to the existing correctly tracked destination.
- Reassurance: **Free on Android · No account needed to start**.
- Supporting ID note: **Not sure of the species? Get a likely suggestion from a photo.**

Do not use "no adverts", "free forever", "guaranteed ID", unapproved subscriptions, unsupported privacy guarantees, invented user ratings or testimonials. Confirm current app behaviour and claims against GitHub and authoritative release evidence before implementation.

## Visual and conversion review gates for a later Codex task

1. **First get Pete's explicit approval of this direction and any image/copy revisions.** Do not ask Codex to implement until approved.
2. Implement only in an isolated design/review branch; no merge, deploy, public preview, analytics/attribution changes, Play or Android changes.
3. Compare actual rendered desktop/mobile screenshots to these references after replacing fake product UI with genuine approved assets. At minimum review 320, 360, 390, 430, 768, 1024 and 1440 CSS px, first/saved analytics consent, keyboard navigation and 1.6× text.
4. Keep Google Play badge easy to find early on mobile; optimize *qualified* outbound clicks without hiding accurate information or breaking consent choices.
5. Preserve the existing verified Play link/UTM/install-referrer behaviour and consent/analytics implementation, accessibility, SEO and privacy. The design references intentionally omit the consent panel; the real site must not.
6. Require a sceptical visual critique in addition to automated correctness; a passing build is not proof of design quality. Pete's visual approval is a separate gate.
7. Keep the entire task design-only until Pete separately authorises production changes.

## State and continuity

The published website's main branch was last checked at `42c997c13712a432c8e2384915aaa010a16d068b`; earlier `CID-WEB-CRO-02` concepts are a separate design review at `1095c41927f2f5eabd6e0ac1996325d780009530`. This document and images do not change either repository. Android `PROJECT_STATUS.md` identifies the core product as Add a catch → Build your journal → Discover your insights, with identification optional. Production version references need separate Play Console reconciliation and are deliberately omitted from the visual copy.
