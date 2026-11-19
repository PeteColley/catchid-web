# CRO-06 — image delivery evidence

**Local measurements · 19 November 2026.** [Generated image manifest](evidence/source-image-visual-audit.json) · [Actual browser requests](evidence/images-verification.json).

One `Picture` uses WebP plus JPEG fallback at quality 85. Intrinsic width/height are 1200 × 800; the existing absolute photo frame reserves its geometry. Eager loading and high fetch priority are explicit. No separate desktop/mobile image elements or preloads cause duplicate downloads. CSS changes only the approved crop position at 760px.

Because `object-fit: cover` exposes a narrow slice of a 3:2 photograph, `sizes` describes the uncropped rendered image width: 533px for the smallest frame, 585px for other mobile frames, 1200px for desktop. Using only the narrow visible frame width would undersupply pixels and soften the fish. Outputs cap at 2400px to bound high-DPR desktop transfer.

| Width × height | WebP bytes | JPEG fallback bytes |
| --- | ---: | ---: |
| 600 × 400 | 32,732 | 42,249 |
| 900 × 600 | 60,632 | 83,725 |
| 1200 × 800 | 92,718 | 134,422 |
| 1800 × 1200 | 186,714 | 282,475 |
| 2400 × 1600 | 328,818 | 505,846 |

The original is **2,950,990 bytes**. It is retained for provenance, omitted from production output and never requested by the tested pages. All renditions are local. Total static build: **32 files / 3,880,554 bytes**, with exactly two HTML pages; that aggregate includes unchanged full-image product assets and every fallback, not a single-visit download weight.

| Actual viewport / DPR | Selected source | Photo bytes | Requests | Local page CLS |
| --- | --- | ---: | ---: | ---: |
| 390 × 844 / 1 | 600px WebP | 32,732 | 1 | 0 |
| 390 × 844 / 2 | 1200px WebP | 92,718 | 1 | 0 |
| 390 × 844 / 3 | 1800px WebP | 186,714 | 1 | 0 |
| 1440 × 1000 / 1 | 1200px WebP | 92,718 | 1 | 0.0078 |
| 1440 × 1000 / 2 | 2400px WebP | 328,818 | 1 | 0.0078 |
| 1440 × 1000 / 3 | 2400px WebP | 328,818 | 1 | 0.0078 |

The normal mobile DPR-1 photo is about **98.9% smaller** than the original; desktop DPR-1 is about **96.9% smaller**. No photo duplication or external image requests occurred. JPEG fallback decoding was additionally verified at both viewport sizes by marking only the offered WebP type unsupported in a test document; this simulates source selection, not a real legacy-browser test.

Measurements use isolated Chrome on loopback with cache disabled for the six normal image probes. They are controlled observations, not field Core Web Vitals, bandwidth-throttled performance or conversion evidence. Normal and enlarged text, image quality and crop were visually inspected; the existing consent presentation can still produce a small desktop page shift. No photo-specific layout shift or control obstruction was observed.
