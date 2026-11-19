# CRO-06 — hero source, approval and rights

**19 November 2026 · approved for this integration candidate, not publication authorisation.**

Pete and ChatGPT explicitly selected CRO-05 Variant A / Photo 1. The source is copied byte-for-byte from `e5ccb55f338cd954d38c11b992f0bc48ac0d8a39:docs/CID-WEB-CRO-05/assets/photo-1-patagonia-savage-37096316.jpg`; only that image and four relevant approved screenshots are reused.

| Record | Value |
| --- | --- |
| Photographer | Patagonia Savage |
| Source page | [Pexels photo 37096316](https://www.pexels.com/photo/close-up-of-brown-trout-in-hand-in-river-water-37096316/) |
| Retained original | [Unmodified JPEG](../../src/assets/hero/photo-1-patagonia-savage-37096316.jpg) |
| Original dimensions / bytes | 6000 × 4000 / 2,950,990 |
| SHA-256 | `460e037b2ba3d9454d5ee668872bf7227c95599e928a49e299e4ef92533685b8` |
| Transform | Astro local encoding only; quality 85, WebP/JPEG, widths 600/900/1200/1800/2400. CSS cover crop at desktop 35% 50%, mobile 30% 50%; scale 1. |
| Existing treatment | Unchanged CRO-04 dark gradients, opacity, frame geometry and journal overlay. |
| Excluded operations | No mirroring, retouching, extension, new artwork or AI generation. |

The [Pexels licence](https://www.pexels.com/license/) was rechecked: free use and modification are permitted, including website promotion; attribution is optional but appreciated. Restrictions include implied endorsement, offensive depiction of identifiable people, unaltered resale, redistribution on stock/wallpaper services and use as a trademark. This is not a public-domain/CC0 assertion.

The [Pexels commercial-use guidance](https://help.pexels.com/hc/en-us/articles/360042295214-Can-I-use-the-photos-and-videos-for-a-commercial-project) confirms commercial website use but notes that depicted people, brands and other protected subject matter may involve additional rights. Retain the [governing terms](https://www.pexels.com/terms-of-service/). No independent authorship investigation or separate model/property-release documentation was obtained; platform licensing is not a blanket third-party-rights guarantee.

The used crop shows a fish and hands, with no visible face or obvious brand logo. The plain on-page credit is **“Photo: Patagonia Savage / Pexels”**, placed in the existing small label. Alt text is **“Brown trout held by an angler at the river waterline.”** Neither claims a CatchID catch, customer, testimonial or endorsement. The exact source URL and licence record remain here.

The old [concept reference](../../src/assets/review-only/trout-concept-reference.png) is retained unchanged for historical audit. Its import and map entry were removed from `src/product-assets.ts`; no concept image or label remains referenced in the homepage build, and no concept file is emitted to `dist/`. Historical CRO-03/CRO-04 evidence is untouched.

The original real photograph is retained in source control, but Astro's production output contains only its ten optimised renditions. Browsers select a single appropriate rendition. [Hashes, dimensions and source checks](evidence/source-image-visual-audit.json).

This completes the selected hero-photo integration gate. Current authentic Add Catch/Catch Details, current product-evidence acceptance, remaining browser/device/accessibility checks and separate publication approval are still outstanding. Existing [CRO-04 asset requirements](../CID-WEB-CRO-04/ASSET_RELEASE_GATES.md) remain historical context; their hero-selection requirement is superseded only by the explicit CRO-06 decision recorded here.
