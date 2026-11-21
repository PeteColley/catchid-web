# CID-WEB-CRO-13 — live placeholder-image correction

**Status: LIVE, independently checked on the public domain on 21 November 2026.**

Pete explicitly authorised a narrow correction and publication. This was not a new redesign, Android change or app release.

## What changed

- `src/components/ManualEntry.astro`: replaced the no-photo Save Catch capture with the existing genuine Home controls crop, showing Take a photo, Choose a photo and Add without a photo. Caption: “Add a catch with or without a photo.”
- `src/components/JournalStory.astro`: replaced the no-photo Catch Details capture with the existing Brown Trout Personal Records crop, including its actual photo and recorded details. Caption: “A saved catch in Personal Records.” The adjacent copy now describes a photograph and fishing memory, not internal test data.
- `scripts/verify.mjs`: replaced rules that required the no-photo demonstration images with positive checks for the approved replacement assets, original hashes, exact crops and honest captions. Added rejection checks for the removed no-photo asset names and review-only captions in public output.

The original problem was unsuitable no-photo examples used as marketing proof, not failed image downloads. Previous verification required those examples and therefore did not catch this visual/content failure. The new guard targets that specific regression; it does not substitute for visual approval of future artwork.

The homepage retains the approved premium journal-first design. There is no new header CTA. Exactly two official Google Play badges per route, consent controls, attribution/referrer behaviour, analytics implementation, advertising honesty, global stylesheet, dependencies and Pages workflow are unchanged. The hero photograph is unchanged. No generated, fabricated or newly licensed imagery was introduced.

## Source and publication receipts

- Previous published website main: `480748657da3913454cc9d7cca85945f97e756ca`.
- Tested/published implementation: `ff1b25db518177784465ec389f756102f689c641`.
- Exact implementation tree: `cfd1ec1aa3da5f4627ca338094c4418c0e2e55e9`.
- Branch: `codex/cid-web-cro-13-placeholder-fix`.
- Implementation diff: exactly the three files listed above.
- Main was fast-forwarded with an expected-head check, without force-pushing or overwriting unrelated work.
- [GitHub Pages run 44910120104](https://github.com/PeteColley/catchid-web/actions/runs/44910120104): build and deploy SUCCESS.
- Build job `136863946934`; deployment job `136864080034`; Pages artifact `14709815807`.
- Deploy-pages confirmed revision `ff1b25d`, environment `https://catchid.app/`, success at `2026-11-21T13:42:17.3090261Z`.
- This receipt and continuity updates are documentation-only follow-up changes; they do not alter the tested application output.

## Verification actually performed

1. Fresh Linux locked installation using Node 24.22.3/npm 11.19.1. Baseline and corrected `npm run check`, `npm run build`, `npm run verify` and `git diff --check` passed. The existing full GitHub Pages build/check/verify also passed. Historical informational check hints remain; they were not claimed fixed.
2. Independent read-only source review found no blocking issue. It verified genuine source artwork, truthful labels, exact scope and unchanged consent/attribution and focus-related source. This was not new runtime focus acceptance.
3. Output-isolation checks: Fishing Journal HTML is byte-identical to the previous build. All other retained output files are identical except homepage HTML. Homepage content outside the two affected sections and their compiled scoped styles is identical. No new output files; 16 unused no-photo image derivatives removed from generated output. Source image files and historical evidence were not deleted.
4. In-memory negative probes confirmed that reintroducing a no-photo asset, an internal demonstration caption or an incorrect crop coordinate fails the new verifier.
5. Sixty-four Chrome responsive cases: two routes × eight viewport widths (320, 360, 390, 430, 768, 900, 1024, 1440) × first visit/saved rejection × normal/1.6× effective text size. Zero detected horizontal overflow, clipped text containers, broken loaded images, incorrect badge counts/targets, missing approved crops or external resource requests in those cases. Consent visibility/equal choice checks passed.
6. Those cases used same-origin framed page viewports and effective per-element font/line-height scaling. They were not physical-device tests, mobile OS emulation, native browser zoom or screen-reader tests.
7. The affected sections were visually inspected at mobile and desktop widths. Actual live homepage recording and journal sections were inspected again in Chrome after deployment. The separate Fishing Journal route loaded successfully. Visual results were reviewed in this session; no new screenshot gallery is committed by this hotfix.
8. Existing deterministic verifier checks for consent, analytics gating, native-control accessibility attributes and tracked Play links remained in place and passed. No real Play click or consented analytics traffic was needed to manufacture test evidence.

## Public readback

At `2026-11-21T13:42:37.100Z`, direct independent HTTP readback returned 200 and exact tested bytes for:

| Public page | SHA-256 of served HTML |
| --- | --- |
| `https://catchid.app/` | `149b23dd701b767d756e43154a094ce57e4c246b36d8cb112999940a505a8047` |
| `https://catchid.app/fishing-journal-app/` | `2a6df3cbc9f40ea6bcb6bd6ca466f30d7808b3cc2384ee7b45f5c8aa05563d6e` |

The Home and Personal Records image URLs actually referenced by the published HTML also returned 200 and matched the tested image bytes. Removed no-photo asset references and internal review captions were absent. This is stronger evidence than a successful deployment receipt alone.

## Qualifications and safety

The reused artwork is the previously approved historical UI, with existing owner-attested fish-photo rights; it is not presented as a new current-production Android capture. No new physical-phone, Safari, Firefox or spoken-screen-reader acceptance was performed. No conversion uplift is asserted. Existing unrelated extreme-zoom/device limitations are not silently reclassified as passes.

No Android code, application identity, signing, user data, Firebase, Google Play release, privacy site, growth automation, outreach or paid-spend setting changed. Android project continuity receives a documentation-only cross-reference to this website correction.

The previous commit remains a history reference, not an automatic recommended rollback: it contains the rejected imagery. Any future regression should be corrected by a reviewed normal fix/revert, never by force-pushing history.

**Next action:** Pete can refresh the public homepage and inspect the two corrected sections. Fresh current photo-populated Save Catch/Catch Details captures can be considered separately; no new capture task or redesign is implicitly approved here.
