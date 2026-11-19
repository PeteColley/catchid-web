# CID-WEB-CRO-06 — approved hero photography integration

**IMPLEMENTED CANDIDATE — NOT LIVE · 19 November 2026. Not publication-ready.**

Variant A / Photo 1 by Patagonia Savage now replaces the homepage's AI concept image. The approved 35%/50% desktop and 30%/50% mobile positions, cover fit, scale 1 and existing gradients are preserved. One Astro `Picture` supplies local responsive WebP with JPEG fallback. A discreet credit replaces the obsolete concept label; accessible text describes a trout at the waterline without claiming it is a CatchID user's catch.

Branch: **`codex/cid-web-cro-06-hero-integration`**, created directly from CRO-04 **`651ae58f39a8c2530fb600b35e91455c644351e8`**. Approved source/evidence: CRO-05 **`e5ccb55f338cd954d38c11b992f0bc48ac0d8a39`**. No comparison branch was merged. Main remains **`42c997c13712a432c8e2384915aaa010a16d068b`**. The implementation SHA and remote receipt are recorded after push; the final delivery identifies any subsequent documentation-only receipt commit.

- [Before/after visual review](VISUAL_REVIEW.md) · [Offline gallery](index.html)
- [Asset provenance and rights](ASSET_PROVENANCE.md)
- [Image delivery evidence](PERFORMANCE.md)
- [Verification and limits](QA.md)
- [Website continuity](../../PROJECT_STATUS.md) · [Unapplied Android continuity proposal](PROJECT_STATUS_PROPOSED.md)

| Browser-rendered homepage | First visit | Saved rejection |
| --- | --- | --- |
| 390 × 844 | [Screenshot](evidence/matrix-home-390x844-first.png) | [Screenshot](evidence/matrix-home-390x844-saved.png) |
| 1440 × 1000 | [Screenshot](evidence/matrix-home-1440x1000-first.png) | [Screenshot](evidence/matrix-home-1440x1000-saved.png) |

Only the homepage photo markup, its dedicated component/source and the shared asset map change in production code. Headline, global CSS, journal screenshots, navigation, copy, badges, landing page, FAQs/footer, URL generator and consent component are unchanged. The consent Git blob and exact generated script bytes match baseline. The Fishing Journal build is byte-identical. The old concept file and historical evidence remain available; its import/output are removed.

Verification: npm ci/check/build pass; exactly two pages. Plain npm verify reproduces the known Windows CRLF defect; the documented in-memory wrapper passes every unchanged assertion. Chrome passes 56 responsive/text cases, 20 interaction groups and 8 image/fallback probes. Four approved/candidate screenshot comparisons have **zero differing pixels outside the photo frame** at a 2/255 channel tolerance. Source audit protects 256 baseline files.

Image delivery: 390px mobile requests one 600px WebP at **32,732 bytes** at DPR 1, **92,718 bytes** at DPR 2 and **186,714 bytes** at DPR 3. Desktop DPR 1 uses **92,718 bytes**; DPR 2/3 uses **328,818 bytes**. No full original, duplicate photo download, external image request or concept output. Local CLS is 0 mobile / 0.0078 desktop in the focused probes; this is not field performance evidence.

Self-review confirms the approved composition and restrained credit. At 320px the fixed consent panel initially hides more of the fish until scrolling; the badge and both consent choices remain accessible. Enlarged text requires natural scrolling. No crop, spacing or consent redesign was introduced to conceal those existing constraints.

**Remaining blockers:** current authentic Add Catch/Catch Details and refreshed/accepted product evidence; outstanding Firefox, Safari/WebKit, physical-device and screen-reader acceptance; final rights/use review and Pete's separate publication approval. The selected hero implementation is resolved; these other gates are not.

No main merge, deployment, public preview, catchid.app/DNS/Pages change, Android application/Play change, advertising/outreach change or announcement. Android continuity is an exact **unapplied proposal**; website continuity is recorded in this branch.

**One recommended next action:** Pete and ChatGPT independently review this CRO-06 implementation candidate before separately considering publication.
