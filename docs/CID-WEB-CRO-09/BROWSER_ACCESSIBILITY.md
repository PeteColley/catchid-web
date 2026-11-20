# CRO-09 — browser, device and accessibility acceptance

20 November 2026. Both `/` and `/fishing-journal-app/` were served from the exact built candidate on loopback `127.0.0.1:4191`. No public preview or production interaction. [QA scripts](qa/browsers.mjs), [edge/image script](qa/edges-performance.mjs), [gallery](index.html).

## What actually ran

| Surface | Actual coverage / outcome | Evidence and boundary |
| --- | --- | --- |
| Chromium / installed Chrome 157.0.8103.79 on Windows | PASS layout and interaction assertions; focus-contrast FAIL separately | [56 matrix cases](evidence/chromium/matrix.json), [20 interaction groups](evidence/chromium/interactions.json), [22 edges / 6 image-delivery cases](evidence/chromium/edges-performance.json) |
| Firefox 159.0, Playwright build 1572 on Windows | Actual Firefox engine; PASS assertions, explained loopback cookie warnings | [Matrix](evidence/firefox/matrix.json), [interactions](evidence/firefox/interactions.json), [edges/performance](evidence/firefox/edges-performance.json), [domain cookie check](evidence/firefox/domain-cookie.json) |
| WebKit 27.2, Playwright build 2388 on Windows | Actual WebKit engine; PASS layout and tested interactions; sequential anchor navigation limited by test shell | [Matrix](evidence/webkit/matrix.json), [interactions](evidence/webkit/interactions.json), [edges/performance](evidence/webkit/edges-performance.json), [Tab probe](evidence/webkit/keyboard-probe.json). **Not Safari.** |
| Actual Safari on macOS / iOS | **UNTESTED** | No authorised accessible Safari surface. Windows WebKit does not certify Safari UI, Apple fonts, OS keyboard settings or VoiceOver. |
| Physical Android Chrome | **UNTESTED** | No authorised clean physical test device identified. CSS viewport/DPR emulation is not a phone. No personal device or journal accessed. |
| Physical iPhone/Safari | **UNTESTED** | No authorised test iPhone identified. No mobile hardware, touch/OS magnification or device-memory acceptance claimed. |
| Spoken screen-reader operation | **UNTESTED** | Narrator was listed as installed but not running; no supported session with observable speech acceptance was established. No NVDA/TalkBack/VoiceOver operation occurred. DOM/AX assertions are not a screen reader. |
| Native browser zoom controls | **UNTESTED** | Native Chrome browser control was unavailable. Text resizing and viewport reflow below are explicit proxies, not actual 200%/400% browser zoom. |
| Automated accessibility | 18 axe-core 4.14.1 scans, **zero reported violations**, with contrast items requiring manual review | Six route/width combinations per engine (320/768/1440); WCAG 2 A/AA, 2.1 AA, 2.2 AA and best-practice tags. Raw `incomplete` results retained. **Not a conformance certificate.** |

Playwright 1.65.1 / axe-core 4.14.1 and official browser binaries were installed only in the isolated sibling `cro09-runtime`, outside the repository dependency tree. Existing browsers/profiles and website package/lock files were not modified.

## Responsive and interaction results

Each engine tested both routes at 320, 360, 390, 430, 768, 1024 and 1440 CSS px, first visit and saved rejection, normal and 1.6× text: 56 cases per engine, **168 total**. Supplemental checks cover both sides of 760/761 and 900/901 transitions with normal/1.6× text, plus 2× text at 320/390/768: **66 total**. No horizontal page overflow. Normal and 1.6× checks found no clipped text, missing images or undersized tested non-inline controls. Two official badges remained on each route. First-visit mobile primary badge is above the consent panel at normal text size; Accept/Reject have equal dimensions.

The 60 interaction groups exercise mobile menu, FAQ disclosures, focus visibility/restoration, reduced motion, rejection/acceptance, persistence, cross-tab withdrawal, cookie removal, history/route changes, storage failures and no-JavaScript fallback. At 1.6×, mobile sequential keyboard focus remains visible above the consent overlay or within its controls. Heading/landmark/alternative/link-name evidence is retained in the matrices; there is one main and one h1 per route, real headings, descriptive SVG crop names and genuine screenshot alt text. Inline links use the inline-text target exception; other inspected controls meet the project's 44px target check.

No-JS native menu and FAQs remain available; Play links keep their static page-specific attribution. Analytics remains off and the consent UI is hidden when no JS can run. Blocked storage fails closed with a visible status message and both choices. Reduced-motion preference disables smooth scrolling. Scripted Play activations were intercepted: no Play navigation or live analytics events were sent.

At **2× text / 320px**, the header wordmark and wrapping Menu label become crowded, although page overflow and button size checks pass. [Actual screenshot](evidence/chromium/home-320-text200.png). Treat this as a manual zoom/reflow acceptance item, not a claim that the 2× experience is fully polished. Do not infer full browser zoom acceptance from computed-font enlargement. Long Record/Journal sections preserve authentic UI and scrolling space; small screenshot helper text at 320px is less comfortable than main titles/values. Descriptive alternatives and visible excerpt/sample captions remain available. The screenshots themselves do not enlarge when only live text is scaled.

## Confirmed defect: focus contrast

The author-specified 3px gold outline `#c57e23`, offset 6px, is clearly visible to this reviewer but does not meet **3:1** against every adjacent background. Actual computed styles on focused controls establish:

| Control/background | Ratio | Result |
| --- | --- | --- |
| Explore the fishing journal, sage `#e3e9df` | **2.661468:1** | FAIL |
| FAQ summary, paper `#f7f4ed` | **2.995294:1** | FAIL; cannot round up |
| Same gold against hero ink `#071c2a` | 5.281183:1 | PASS |

[Machine evidence](evidence/focus-contrast.json), [Journal focus screenshot](evidence/chromium/focus-journal-link.png), [FAQ focus screenshot](evidence/chromium/focus-faq.png), [reproducer](qa/focus-contrast.mjs). This is an author-styled focus state subject to [WCAG 2.2 SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html); the threshold is not rounded. **Minimum correction:** separately authorise a small focus-colour/treatment adjustment that exceeds 3:1 on every used light and dark surface, then retest. No page redesign is warranted or performed.

Main colour-pair checks pass: ink/paper 15.82:1; muted/sage 5.38:1; teal/paper 5.66:1; mint/ink 10.81:1; consent text/button background 11.63:1. Axe marks some image/pattern/pseudo-element backgrounds as indeterminate, retained as incomplete. Visual review did not identify unreadable live text in the inspected screenshots; this does not close all manual low-vision/assistive-technology acceptance.

## Harness limitations and retained initial results

- [Initial WebKit interaction run](evidence/webkit/interactions-initial.json) assumed Chromium's third Tab would reach Menu. This shell skips anchors with Tab and Alt+Tab, so it instead activated Reject and later timed out. The [probe](evidence/webkit/keyboard-probe.json) records the actual sequence. The completed run uses native Tab to Menu, then **programmatic link focus** to test Enter activation; this is not a pass for sequential WebKit link navigation. Full Apple keyboard acceptance remains open. [Playwright's upstream discussion](https://github.com/microsoft/playwright/issues/5609) documents this family of preference differences; its Mac Alt+Tab workaround did not work in this Windows shell.
- [Initial Firefox run](evidence/firefox/interactions-initial.json) recorded eight invalid-domain cookie diagnostics when the cleanup loop tried parent fragments of `127.0.0.1`. Assertions passed. The completed result retains those messages as warnings. A synthetic `.test` hostname, fulfilled exclusively from local bytes, successfully removed both host-only and parent-domain GA cookies, retained an unrelated cookie and produced **no errors**. No DNS or real public hostname was contacted.
- Initial delivery checks incorrectly demanded that hidden mobile Insights and unreached lazy footer images already be decoded. Initial reports are retained. Corrected audit traversal scrolls to and decodes every displayed image, leaving deliberately hidden images deferred. Final delivery checks pass; combined edge script exits 1 solely for the real focus-contrast defect.
- Element-only screenshots can crop a figure extending beyond its parent section box. Prefer the `*-viewport-width.png` captures in the gallery: these are full-width **browser screenshots**, not edited raster composites. Production has no corresponding clipping.

## Smallest manual acceptance session

Use an authorised private/loopback test setup for the exact corrected candidate, without a public preview or personal CatchID data. Record OS/browser/device versions, candidate SHA, date and result for both routes.

1. On a clean Android Chrome phone: first visit, reject/accept/withdraw, menu, FAQ, both Play destinations (inspect destination without installing), scroll both long examples and confirm captions/320px readability where practical. Use TalkBack to traverse headings/links, hear image alternatives, operate disclosures and return focus after consent changes. Record actual spoken behaviour.
2. On an authorised iPhone/Safari: repeat first-visit consent, menu, FAQ, scrolling, touch targets and pinch enlargement. If available, add VoiceOver; it does not substitute for observing the real Safari page. On desktop Safari with keyboard navigation enabled, verify links, skip link and menu using the keyboard; if unavailable, keep this specific gap explicit for Pete's acceptance decision.
3. In a real desktop browser, check 200% zoom and 400% reflow from a practical desktop window, including the crowded header, both consent choices and keyboard focus. Recheck the corrected focus colours and disclose any remaining clipping/overlap.

Do not waive these tests as already done by the automation. No design changes should be commissioned unless this session finds an actual defect.
