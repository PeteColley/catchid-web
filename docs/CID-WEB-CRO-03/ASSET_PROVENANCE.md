# Asset provenance

**DESIGN CONCEPT — NOT LIVE · CRO-03A update · 18 November 2026**

All source files remain unchanged. Crops are presentation-only SVG viewBoxes over those files; there is no retouching, replacement text, generated app UI or invented catch data. The dark frames are website presentation, not a claim about a particular physical device. SHA-256 and byte comparisons are in [static-verification.json](evidence/cro03a/static-verification.json).

| Asset | Source and evidence | Treatment and limits |
| --- | --- | --- |
| catchid-icon.png | Website main `src/assets`, supplied brand identity | Exact original bytes; header/footer/favicon. |
| google-play-badge.svg | Website main `public/assets`, existing approved official download badge | Exact original bytes. No filters, redraw or recolouring. 218px wide desktop, 197px mobile; 17px/15px clear-space padding respectively. Local button opens a preview dialog. |
| journal.jpg | Website main `src/assets`; supplied published marketing artwork | Original 1080 × 1920. SVG crop `75 205 930 1655` removes the marketing heading/surround only. Original dates, species, photos, locations and details are retained. Used once in each hero; the duplicate Home section phone has been removed. Exact app version and capture date are not established. |
| home-1.2.12.png | Existing approved website asset; Android HOME-04 empty test-journal capture | Original 780 × 1688. SVG crop `38 232 705 458` shows all three actual Add a catch entry controls. No private catches. It proves the manual entry path, not the complete form. File name is provenance only; no version appears in website copy. |
| personal-records.jpg | Existing approved September 2026 website screenshot | Full 709 × 1536 pixels including status/navigation bars. Published example record, not a newly asserted statistic or performance claim. Primary mobile Insights proof at 265px wide, unchanged. The Journal story now additionally uses the original saved-record card as an excerpt: SVG viewBox `32 434 645 704`. Its photograph, species, PB label, weight, date, location and View catch details text are untouched. This is labelled a Personal Records excerpt, not a Catch Details screen. |
| insights-overview.jpg | Existing approved September 2026 website screenshot | Full 709 × 1536. Second desktop screen; local original-image link on mobile avoids two unreadably small screens. Counts belong to the original example only. |
| identify.jpg | Website main, supplied published marketing artwork | 1080 × 1920; presentation crop `75 205 930 1655`. Likely Common Bream, original confidence wording and correction control remain untouched. Artwork already ends around Visible clues; this is labelled an example, not a full current-screen capture or accuracy claim. |
| fishing-locations.jpg | Existing approved website screenshot, copied unchanged | Retained as an available source in this review pack; not displayed in the two designs. |
| river-lines.svg | Original simple vector linework created for this design | Decorative only, no product evidence or claimed geographic location. |

## Approved references and concept photography

The supplied ZIP SHA-256 is `2a60c1e63f852eeff8b6849a059fcd7dffc22cd68ce8a2390f7d677cab7a8b6b`. Its six files are preserved under [reference/](reference/), with their names unchanged. The pasted CRO-03 request is authoritative; the pack is supporting material. Its stale suggestion that the journal landing page is future work was superseded by current source inspection.

The desktop reference is 1487 × 1058; the mobile and section references are each 1024 × 1536. All three are AI-generated design targets. Their depicted app UI, badges, wordmark and statistics are not product evidence.

The concept photograph uses the far-right crop of the desktop reference: desktop SVG viewBox **`1170 90 317 748`**, mobile **`1170 180 317 530`**. It contains the illustrative trout/hand/water, with no illustrated screen, wordmark, badge or text. It is never presented as a recorded user catch. Every use is labelled **Concept art — not publication approved**. It now appears only in Home’s hero. Mobile uses full opacity in a bounded area below the copy, beside the journal, with a subtle edge fade. No web body text sits on the bright photograph; the concept label has an opaque navy background. The repeated concept photograph in the Journal section has been removed. The original reference image remains byte-identical. No image-generation or editing service was used.

This narrow source crop is not a production-resolution photography solution. Future publication needs rights-cleared, suitable outdoor imagery and an owner review of the subject/crop. A new photographic commission or approved owned asset would improve both variety and sharpness.

## CRO-03A search and exact missing-asset requirements

The latest Android inventory was checked at `ec74bf1f0a2feb3a078e3918f294ea06f3fe2a0d`. Files inspected include `docs/approved_mockups/02_save_catch.png` and `04_catch_details.png`: these are historical design composites, not verified captures of the current product. The folder name alone is not proof of genuine UI. `docs/CID-FREE-01C/evidence/screenshots/manual-catch-details.png` is a genuine disposable-emulator capture, but visibly contains test-only catch text and a Test Ad. `docs/CID-FREE-01/evidence/screenshots/details-length-notes-banner.png` similarly contains synthetic review notes. They are not repurposed as approved marketing material. No Android file or device was changed.

For Pete’s later asset review, the specific missing captures are:

| Capture | What it must establish | Required source quality |
| --- | --- | --- |
| Manual Add Catch form | Actual current form reached through Add without a photo; visible supported fields and Save control | Native full-resolution capture, ideally at least 1080px wide; no keyboard covering key controls; separate genuine scroll captures if needed. |
| Catch Details | An owner-approved existing catch, with its real photo or genuine no-photo state, date and recorded fields | Complete current screen; no disposable-test names, synthetic review notes, private coordinates or test-ad creative. Never retouch UI or replace values to make it presentable. |
| Populated Journal | Current live UI with approved non-private catch/photo content | Same reconciled app build and device scale as the Details capture; original unedited PNG. |
| Insights and ID refresh | Current screen states with enough approved data and honest uncertainty | Native original screenshots; preserve data-sufficiency and species-correction context. |
| Hero photograph | Rights-cleared, suitable outdoor atmosphere with useful horizontal and portrait framing | Original high-resolution photograph and permission/provenance. The AI reference crop does not provide rights clearance. |

These are requirements for a later asset handoff, not permission to seed a journal or invent catches. The present design uses only already approved public artwork.

### Remaining limitations

- A fresh, approved, populated Journal capture from the reconciled live app, at an appropriate high resolution.
- An approved complete **Add Catch form** and **Catch Details** capture with deliberate non-private example content. Neither is fabricated here. Existing Android test-fixture screenshots were inspected but not repurposed as marketing approval; some contain synthetic review notes or test advertising.
- Fresh approved Insights and ID captures after production-version reconciliation.
- Rights-cleared landscape and portrait fishing photographs suitable for the hero and journal story.

The design can be reviewed with these gaps visible. Publication readiness cannot be inferred from the visual mockup, from Git, or from the prepared Android candidate.

## Product and destination continuity

The source/status supports manual entry without a photo or identification, species correction, personal catch records and Insights based on recorded catches. No catch rate, effort, prediction or guaranteed improvement is implied. No-account start and optional Google-sign-in Journal Protection use the qualified wording already supported by source. Advertising is acknowledged. No live version, permanent price promise or broad privacy guarantee is added.

Existing destination text **Privacy** and **Support** is retained with a visible `(preview)` qualifier. Their intended destinations remain metadata on non-operative buttons:

- Privacy: `https://petecolley.github.io/catchid-privacy/`
- Support: `mailto:colley.apps@gmail.com`

No privacy document is rewritten or replaced. The production Play URL builder remains untouched. A later implementation must retain `utm_source=catchid_website`, Home `website_launch/referral`, journal route `fishing_journal_app/organic`, and the corresponding nested install referrer. These prototypes contain no outbound store URL or tracking calls.
