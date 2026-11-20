# CID-WEB-CRO-08 — authentic product screenshots

**20 November 2026 · IMPLEMENTED / IMPLEMENTATION CANDIDATE ONLY / NOT LIVE.**

Branch: `codex/cid-web-cro-08-product-integration`. Starts at approved CRO-07A capture commit `aa818647e3acd7537e92774fb7b2f437388aa7ce`, with the unchanged CRO-06 website implementation `8d0731f361b94a81523bfe07f528b7fdb365ccb4` underneath. Commit/push verification is recorded in the delivery receipt below when completed.

## Result

- Homepage **01 / Record every catch**, `ManualEntry.astro`: approved genuine **Save catch upper** replaces the old Home entry-controls crop. Existing headline, copy and field list stay. Figure title is “Save catch · upper form”; the caption says it is an excerpt that continues below. No Save button is shown or implied.
- Homepage **02 / Your Catch Journal**, `JournalStory.astro`: approved genuine read-only **Catch details** replaces the Personal Records photograph excerpt. The headline and warm editorial layout remain. “The photograph” becomes “The moment”; the supporting caption describes a place, method and note without claiming a photo.
- Both examples visibly disclose **Actual CatchID UI · Controlled demonstration data · No photo required**, with descriptive accessible image text. The lower form remains evidence only.
- A small shared `CapturedScreen.astro` uses Astro Picture, responsive WebP and PNG fallback, reserved dimensions, lazy loading and a clearly labelled CSS viewport crop. Original PNG bytes are untouched. No invented, stitched or retouched UI.

Only these three production components and the necessary asset-specific assertions in `scripts/verify.mjs` change. Global CSS, homepage hero/photo, historical Journal/Insights/ID evidence, Fishing Journal source, consent, tracking, metadata, dependencies and deployment workflow remain unchanged. Existing Home artwork stays available and remains used on the unchanged Fishing Journal page. Exactly two official Google Play badges remain on each page. The story remains Record → Journal → Insights, with identification optional.

## Review package

- [Offline before/after gallery](index.html) — open locally; no hosting or external scripts.
- [Visual review and tradeoffs](VISUAL_REVIEW.md).
- [Asset provenance, rights and delivery sizes](ASSET_PROVENANCE.md).
- [QA, exact commands and retained failed attempts](QA.md).
- [Desktop homepage hero](evidence/final/matrix-home-1440x1000-first.png) and [full page](evidence/final/matrix-home-1440x1000-saved-full.png).
- [Mobile first visit](evidence/final/matrix-home-390x844-first.png) and [saved rejection](evidence/final/matrix-home-390x844-saved.png).
- Record: [desktop](evidence/final/record-1440.png), [mobile](evidence/final/record-390.png).
- Catch details: [desktop](evidence/final/journal-1440.png), [mobile](evidence/final/journal-390.png).
- Fishing Journal regression: [desktop](evidence/final/matrix-fishing-journal-app-1440x1000-saved-full.png), [mobile](evidence/final/matrix-fishing-journal-app-390x844-saved-full.png).

## Verification and sceptical assessment

Install, Astro check/build and scoped audit pass. Exactly two pages build. The normal verifier **fails at the preserved Windows CRLF presentation-script comparison**; the documented in-memory normalisation wrapper passes all existing and new assertions. No general verifier refactor was made. The check reports three inherited unused-require hints, zero errors/warnings.

Chromium checks pass: 56 responsive/text cases, 20 interaction groups, eight DPR/fallback image cases, ten normal section captures and ten enlarged-text section captures. No unexpected requests, runtime exceptions, missing images, overflow or failed controls in the completed runs. All six GA-loader attempts in consent tests were consented and intercepted locally; no real measurement or Play visit was performed.

Two deliberate visual passes were completed. The first found an undersized 768px form; the final local breakpoint stacks only these two sections at 761–900px. The final composition is legible and restrained at the tested sizes. These authentic tall views add page length compared with the old short crops. Small embedded app labels remain small at 320px, and raster UI text cannot reflow with text-only zoom; the surrounding copy and disclosure do reflow, and descriptive alternatives remain available. This is a sceptical self-review, not independent owner or accessibility acceptance.

The source audit protects all unrelated tracked files and the seven existing dirty Android files. Generated screenshot derivatives reproduce exactly from the approved originals. Consent source/output and the Fishing Journal HTML are byte-identical to baseline. Browser comparisons record tiny rotated-image rasterisation differences, not a claim of universally identical PNG bytes; see QA.

## Remaining publication gates

1. Historical Journal/Insights/ID asset-fidelity acceptance.
2. Final rights/use review, including the unchanged hero and historical embedded photographs. Platform licensing is not a blanket third-party-rights guarantee.
3. Independent Play Production evidence reconciling Pete's confirmation of 1.2.15/35. These are cloud-disabled playtest captures, **not Play-delivered screenshots**; lack of visible ads does not mean the production app is ad-free.
4. Firefox, Safari/WebKit, physical-device and screen-reader/accessibility acceptance.
5. Pete's separate publication approval.

No merge, deployment, public preview, catchid.app, DNS/Pages, Android application/release, Play Console, Firebase/backend, advertising or outreach change. Android continuity is an [unapplied documentation-only proposal](PROJECT_STATUS_PROPOSED.md).

**One recommended next action:** Pete and ChatGPT review the CRO-08 gallery and candidate, with publication still blocked by the remaining gates.

## Delivery receipt

Pending the authorized isolated-branch commit, push and remote readback. Implementation evidence above is complete; this line does not claim a release.
