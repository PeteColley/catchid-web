# Approved screenshot provenance and delivery

**20 November 2026.** Owner-approved source selection from CRO-07A commit `aa818647e3acd7537e92774fb7b2f437388aa7ce`; original [recovery record](../CID-WEB-CRO-07/RECOVERY_07A.md), [manifest](../CID-WEB-CRO-07/evidence/recovery-07a/captures.json) and [build/source record](../CID-WEB-CRO-07/SCREENSHOT_PROVENANCE.md) are preserved unchanged.

| Original, under `docs/CID-WEB-CRO-07/captures/` | SHA-256 | Placement |
| --- | --- | --- |
| `save-catch-no-photo-upper-1080x2340.png` | `9a9f9671158643fc1ac8499a24177eac6fae40ffbf2cc74d71b8b50957dd6291` | Homepage Record every catch |
| `catch-details-no-photo-1080x2340.png` | `8467825c56f0796c15fe67ab76400945837631da90019dc7b9c0a333b6093fd5` | Homepage Your Catch Journal |
| `save-catch-no-photo-lower-1080x2340.png` | `28f36d07f095529eb8b7d1708311839263d02281be1f5d558f9da76ab4b5b07c` | Supporting evidence only; not imported/rendered in production |

All are untouched 1080 × 2340 PNGs from genuine CatchID 1.2.15/35, cloud-disabled debug playtest APK SHA-256 `94248cacfef23ef021dd75c4ffe38879ea5310ade42852227215ce62ddc4d3ac`, source `9e9b37e9dfdc2554321602bfbada2e18227d34e7`. Captured by binary-safe adb screencap on 19 November from a fresh offline Android 15/API 35 Pixel 5, 1080 × 2340, density 440, font 1.0, Europe/London. Genuine light app palette. No account, identification, private journal or production Firebase connection. No emulator or Android build was used in CRO-08.

One controlled demonstration catch was entered and reopened through actual UI: Brown Trout, 18 November 2026 09:20, fictional free-text Riverside, Fly / Dry fly, 0.75 kg, 34 cm, “Dry fly in a shallow run.” No photo. This is not a real customer's catch or an endorsement. Pete confirms this version live; fresh independent Play Console/Play-delivery verification remains absent. These are not Play-delivered screenshots. The offline absence of visible ads does not establish an ad-free production app.

## Presentation and honest crop

Components directly import the canonical originals above; there is no second editable copy. The CSS viewport is **x 40, y 148, width 1000, height 2110** in original pixels. It removes Android status/gesture bars and a small outer margin, retaining the app title and displayed form/details. The border and shadow are website framing outside the original UI. No UI is rewritten, rearranged, shortened, stitched, mirrored or retouched.

The upper form naturally continues below the fly selector; Save is not in this viewport. The details original is naturally scrolled: its decorative placeholder is already partially offscreen while “No photo recorded”, record values, Notes and Edit catch remain visible. The website does not claim either excerpt is the complete form/page. Both adjacent figcaptions include **Actual CatchID UI · Controlled demonstration data · No photo required**.

## Optimisation evidence

Existing Astro/Sharp tooling, quality 95, creates four WebP and four PNG fallback renditions per original. Original aspect ratio is retained during build; only CSS crops the rendered viewport. Width/height attributes and wrapper aspect ratio reserve space. One Picture element per screenshot, native lazy loading, asynchronous decode. No extra dependency, script or remote image service.

| Width | Save catch WebP | Catch details WebP | Save catch PNG | Catch details PNG |
| --- | ---: | ---: | ---: | ---: |
| 360 | 25,654 B | 16,290 B | 23,549 B | 15,299 B |
| 540 | 41,704 B | 27,386 B | 37,659 B | 24,101 B |
| 720 | 59,416 B | 38,656 B | 55,873 B | 33,940 B |
| 1080 | 92,092 B | 59,466 B | 53,951 B | 35,376 B |

At 390px/DPR 1, the actual browser chose the 540px WebPs: **69,090 bytes total**, versus 286,908 bytes for the two source PNGs. DPR 2/3 can choose the full-resolution 1080px derivative, capped at the original resolution. Native PNG fallback was decoded in two simulated unsupported-WebP cases. Every normal DPR probe made one request per screenshot; no simultaneous WebP/PNG duplicates or external image request. The original lazy attributes are recorded before the QA helper deliberately decodes offscreen images. These controlled local measurements are not field performance data.

All 16 derivatives are independently regenerated from the exact approved original with the installed Sharp encoder and compared byte-for-byte by [audit.mjs](qa/audit.mjs). Exact dimensions, byte sizes and SHA-256 are in [source/image audit](evidence/source-image-visual-audit.json); actual browser selection/CLS is in [image checks](evidence/final/images-verification.json). Measured CLS in those probes: mobile 0, desktop approximately 0.0078; consent and hero remain unchanged.

## Rights and retained history

The screenshots show the owner's actual app UI and controlled data, with no newly supplied third-party fish photograph or private information. Selection/integration approval is recorded by the CRO-08 task; publication remains separate. Existing Home, Personal Records, Journal, Insights and ID sources are untouched. The Patagonia Savage hero source, credit, checksum and Pexels licence record remain in CRO-05/06 evidence. This integration does not grant rights to every historical embedded photograph or establish that the platform licence covers all third-party rights. Final rights/use acceptance remains open.
