# CRO-08 visual review

**Sceptical self-review, 20 November 2026. Not independent owner, screen-reader or physical-device acceptance.** [Offline gallery](index.html).

## Pass 1 — identify the actual tradeoff

Used one upright genuine screenshot per section, an honest system-bar/margin crop and the original section copy/layout. [Initial Record desktop](evidence/pass1/record-1440.png), [mobile](evidence/pass1/record-390.png), [tablet](evidence/pass1/record-768.png); [initial details](evidence/pass1/journal-390.png).

The 1440/1024 desktop columns looked coherent, with the genuine fields more useful than the old short artwork. At 768px the inherited columns made the form too small. At 390px the first image-size hint slightly underestimated the crop's actual painted width; the chosen rendition was being upscaled. A narrow mobile gutter also left less usable image width than necessary. These were corrected within the two sections and shared screenshot frame.

## Pass 2 — final scoped refinement

- At 761–900px only these two sections stack, maintaining the established mobile copy-before-image order and capping the copy at 560px. Full-size images are readable instead of squeezed into narrow columns.
- Phone frames gain 8px on each side within the existing page margins, leaving 12px gutters on narrow phones; cap remains 390px. No screenshot content is fabricated to reduce height.
- The responsive `sizes` value accounts for the crop's actual 108% image width. The 390px/DPR 1 browser now uses 540px assets with clear labels and values.
- Rotation was removed from the new details presentation; the former rotation belonged to the obsolete photograph excerpt. The upright real form, subtle border/shadow, warm backgrounds, existing type and alternating editorial composition remain restrained.

Final sections: Record [1440](evidence/final/record-1440.png), [390](evidence/final/record-390.png), [320](evidence/final/record-320.png), [768](evidence/final/record-768.png); details [1440](evidence/final/journal-1440.png), [390](evidence/final/journal-390.png), [320](evidence/final/journal-320.png), [768](evidence/final/journal-768.png).

The form's real “Save catch” title, optional location, Brown Trout and Fly method remain visible. The cropped bottom visibly continues; caption and alt do not imply the Save button is displayed. Details retains No photo recorded, User entered, Riverside, Dry fly, weight, length, Notes and Edit catch. The old photograph language is removed. Disclosure is adjacent and readable, not relegated to documentation.

## Responsive, enlarged text and preserved design

The browser matrix covers 320, 360, 390, 430, 768, 1024 and 1440px, both pages, first visit/saved rejection, normal/1.6× text. All 56 geometry/control/image cases pass. Ten additional enlarged-text section captures are retained, including Record [390](evidence/final/record-390-text160.png) and details [768](evidence/final/journal-768-text160.png).

No horizontal overflow, clipped captions, inaccessible tested focus/touch controls or image overlap. Text grows naturally; raster screenshot UI does not reflow under text-only enlargement. At 320px the smallest embedded UI helper labels remain small; the main titles/values are recognisable, and the descriptive alternatives explain the shown content. Full-resolution originals remain in the review package. Do not call this complete screen-reader or low-vision acceptance.

The authentic tall screenshots require more scrolling than the former short crops. The extra height contains actual product information rather than added decoration; the copy remains centred against each desktop illustration and the mobile flow has no large empty spacer. The detail placeholder's genuine empty area remains; it communicates no photo, and has not been artificially collapsed. This tradeoff is appropriate for review, but owner acceptance remains separate.

Hero, navigation, Google Play badges, consent, Insights, optional identification, FAQ and footer preserve their approved design. The Fishing Journal HTML is byte-identical. Before/after hero comparisons have zero pixels changed beyond 4/255; one desktop first visit differs at 47 pixels by at most 4/255 on the unchanged rotated Journal image. Three full Fishing Journal comparisons are pixel-identical; the desktop first-visit full image has 254 pixels differing by more than 4/255 (maximum 13/255), confined to the unchanged rotated historical Insights image. Exact source/CSS/assets/HTML checks support a rasterisation variation, not a layout or asset change. Full statistics remain in the audit.

**Assessment:** the scoped integration is coherent, honest and suitable for Pete/ChatGPT review. It is not a publication or accessibility sign-off. The historical asset-fidelity, rights, independent Play evidence and remaining browser/device/accessibility gates still apply.
