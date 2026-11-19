# Asset release gates — CRO-04

**IMPLEMENTATION CANDIDATE — NOT LIVE · 19 November 2026. NOT PUBLICATION READY.**

The approved design is CRO-03B at `9c7b0847061a460aa095150a6e2dd1972ba7a436`. Its complete provenance was read before implementation. Only the required reference image and decorative linework were carried into the implementation; the design branch and its evidence archive were not merged.

## Reusable assets

Existing `src/assets/` files are unchanged: CatchID icon; published Journal and identification artwork; the genuine Home entry-controls capture; Personal Records and Insights overview. Their original photos, data, wording and proportions are retained. `public/assets/google-play-badge.svg` is unchanged, with SHA-256 `4ffa4c7edd2f10b297ca4de2131eddaa00d03b2278d1e178fe512920d824ca34`.

Astro performs local WebP encoding for delivery. This is build-time compression of the existing sources, not generated UI or replacement text/data. Presentation SVG viewBoxes match CRO-03B:

| Asset | Approved presentation |
| --- | --- |
| Journal | `75 205 930 1655` over the original 1080×1920 artwork; once per hero. |
| Identification | Same viewBox and original dimensions; optional supporting proof. |
| Manual entry | `38 232 705 458` over Home 780×1688; proves the entry controls, not a complete Add Catch form. |
| Saved record | `32 434 645 704` over Personal Records 709×1536; explicitly labelled as an excerpt, not a Catch Details screen. |
| Insights | Full Personal Records and overview screenshots; mobile provides a normal link to the original overview image. |

Original assets, configuration and critical runtime checks are recorded in [source audit](evidence/source-audit.json). No user device, catch database, photo library or emulator was accessed or modified for this implementation.

## Blocking imagery decision

`src/assets/review-only/trout-concept-reference.png` is the exact supplied AI reference, **authorised only for this unmerged, undeployed candidate**. The on-page label remains **Concept art — not publication approved**. Desktop viewBox is `1170 90 317 748`; mobile is `1170 180 317 530`. It is not presented as a recorded catch.

The original reference is approximately 2MB; the browser receives an approximately 182KiB WebP rendition. It is narrow source material, not a production-resolution or rights-cleared photograph. A build and branch push confer no publication permission.

**Before publication:** Pete must supply/approve a rights-cleared, high-resolution outdoor photograph with useful desktop and portrait crops, or make an explicit alternative imagery decision. Validate the replacement against the approved composition and contrast. Do not deploy the present concept asset.

## Missing current product evidence

| Needed | Acceptance requirements |
| --- | --- |
| Manual Add Catch form | Genuine current form reached without a photo; supported fields and Save visible. Original full-resolution PNG, ideally ≥1080px wide; no keyboard hiding controls. |
| Catch Details | Owner-approved genuine catch/no-photo state and recorded fields, with current UI. No test names, synthetic review notes, private coordinates or test advertising. |
| Populated Journal | Approved non-private records and photos, reconciled current build, original unedited screenshot. |
| Insights / optional ID | Current actual screens with sufficient approved data and visible uncertainty/correction where relevant. |

Existing published assets are usable for this review. Their age/current-release fidelity must be accepted or refreshed before publication. Historical Android design composites and disposable test captures are not silently repurposed. Do not invent catches, seed a user's journal or retouch data to fill these gaps.

## Other release gates

Pete and ChatGPT must review this implementation candidate. Firefox, Safari/WebKit, physical-device and screen-reader checks remain unperformed in this Windows environment. Complete/accept those browser gates, resolve the imagery/product-evidence decisions, then obtain separate explicit publication authorisation. Main, deployment workflow, DNS/CNAME, app-ads.txt, privacy-policy hosting, Android and Google Play remain untouched.
