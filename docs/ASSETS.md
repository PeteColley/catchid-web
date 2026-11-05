# Website assets

The CatchID icon and three product screenshots are supplied CatchID marketing artwork. They are used without alterations to their depicted product interface.

- `src/assets/catchid-icon.png`: app identity and favicon source.
- `src/assets/identify.jpg`: catch identification artwork.
- `src/assets/journal.jpg`: catch journal artwork.
- `src/assets/insights.jpg`: earlier Catch Insights artwork, retained but no longer used on either page.

Astro generates responsive image renditions at build time. The original journey screenshots remain available through the homepage's desktop larger-image links; at widths up to 600px the homepage renders non-navigating screenshots instead. Both presentations use the same optimized assets and alt text, with only one exposed to layout and accessibility at a time.

## Current Home evidence — CID-WEB-CRO-01

`src/assets/home-1.2.12.png` is an unchanged 780 × 1688 capture from the dedicated API 36 emulator, displaying the actual current Home UI with an empty, isolated test journal and the app's own clearly labelled EXAMPLE first-catch guidance. No personal catches, private locations or user photos are present. No device was modified for this website task. We chose this real first-use experience over the personalised test captures, whose photo slots contain geometric fixture images.

- Source: `catchid-android/docs/design/CID-DELIGHT-HOME-04/evidence/07-zero-catch.png`, read at Android main `a7f8b6e7f9a7ab13ba454db1634d9e8b884c93e3` on 5 November 2026.
- SHA-256: `7e228e3c048f27aa5e3f40b604a9528ad6e81ef264328cda8ce7cdecfb69e349`, matching the original HOME-04 verification manifest.
- Provenance: [HOME-04 handover](https://github.com/PeteColley/catchid-android/blob/a7f8b6e7f9a7ab13ba454db1634d9e8b884c93e3/docs/design/CID-DELIGHT-HOME-04/HANDOVER.md) and [capture manifest](https://github.com/PeteColley/catchid-android/blob/a7f8b6e7f9a7ab13ba454db1634d9e8b884c93e3/docs/design/CID-DELIGHT-HOME-04/evidence/verification.json).
- The Home rendering source matches the 1.2.12 Production build-source `e50e7a2c518c26346b44fa3ed35b3a6454de7a1a`; Android main also contains an unrelated banked What's new feature. This is an emulator UI capture, not a new Play-device capture.
- No compositing, retouching, cropping or invented UI. Astro emits WebP sizes at 360/540/720px (approximately 24/43/62 KB), reserves the genuine aspect ratio, and the website caption identifies first-catch example content.

## Google Play download badge

- Local asset: `public/assets/google-play-badge.svg`.
- Official supplied filename: `GetItOnGooglePlay_Badge_Web_color_English.svg`.
- Source: [Google Partner Marketing Hub — Google Play badges, Web SVG downloads](https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/?folder=86718).
- Retrieved 7 September 2026 from the Google Cloud Storage download linked by that page. The Hub lists the English file as updated 14 November 2025.
- Original viewBox: `0 0 238.96 70.87`. The supplied SVG is stored and served byte-for-byte, without optimisation, recolouring or redrawing.
- SHA-256: `4ffa4c7edd2f10b297ca4de2131eddaa00d03b2278d1e178fe512920d824ca34`.

[Current badge guidance](https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/) calls for the download badge rather than a lockup, at least 28 px digital height, clear space of one-quarter of its height on every side, an appropriate solid background, and unaltered current artwork. Both pages use the English badge at the hero and final download sections. It renders at 60 px high with its original aspect ratio and 16 px clear space; focus outlines sit outside that space. No effects are applied to the badge. Header and footer acquisition links remain secondary text navigation.

The [Partner Marketing Hub FAQ](https://partnermarketinghub.withgoogle.com/support/faq/) exempts ordinary badge campaigns below one million estimated impressions from approval, excluding TV and out-of-home campaigns. The linked [Google brand terms](https://partnermarketinghub.withgoogle.com/brands/google/trademarks-and-terms/terms-and-conditions/) require an ownership notice for Google Brand Features. Each page includes one small Google Play trademark attribution; no broader legal footer is added. Temporary signed download URLs are not retained in the repository.

## Web palette

White is the primary canvas. Deep aquatic navy (`#03111D`), ink (`#071C2A`) and turquoise (`#26C7C9`) connect the site to CatchID's fish-and-scanner icon and product colour system. The turquoise is reserved for small accents and emphasis on navy. A darker aquatic teal (`#006A75`) provides readable accent text on white; cool neutral (`#F3F7F8`) surfaces distinguish selected sections. Original screenshot colours are unchanged.

## Catch Insights 2.0 production screenshots

Downloaded unchanged on 30 September 2026 from the three sources specified in [issue #1](https://github.com/PeteColley/catchid-web/issues/1). Each was visually checked against its named production screen before use. No screen contents, catches or records were generated or altered.

| Local file under `src/assets/` | Source URL | SHA-256 |
| --- | --- | --- |
| `insights-overview.jpg` | https://static.metricool.com/planner/202609/7157367-file-16498964407747998319.jpeg | AC2884C9FA34510B257C2FBCDC40B2EAC50316925D89C837A7D4E7707E09EE36 |
| `personal-records.jpg` | https://static.metricool.com/planner/202609/7157367-file-8483491877648427285.jpeg | 4B20CD52CBD4A65718E35F13AC5B2764ECE429E64BD92CA8829439A1BB03669C |
| `fishing-locations.jpg` | https://static.metricool.com/planner/202609/7157367-file-12363935092292429902.jpeg | 6BD7DF483FCE43D0D1E4B1989635D58F440AF1873B8051C6F743312528250F42 |

The overview appears on both pages; Personal Records and Fishing Locations form a smaller supporting pair on the homepage only. Astro generates local WebP renditions. Larger-image links serve the original local JPEGs; production HTML does not reference Metricool.
