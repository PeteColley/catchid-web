# CRO-11 — actual browser and accessibility evidence

20 November 2026. Exact approved CRO-10 output served on **127.0.0.1:4193 only**. [Fresh rebuild/output equality](evidence/scope.json) ties the tested files to unchanged source. No public preview or live website session was used.

## Coverage retained and added

| Coverage | Actual result and boundary |
| --- | --- |
| Chromium, Firefox, Windows WebKit | Retain [CRO-10 QA](../CID-WEB-CRO-10/QA.md): 2,112 focus cases, 28 painted-background samples (minimum 3.671:1), 96 responsive cases, 60 interaction groups and 18 axe scans with no reported violations. Not rerun wholesale because source/output are unchanged. Windows WebKit is not actual Safari; its Tab-to-anchor shell limitation remains. |
| Android Chrome | **PASS**, actual preinstalled Chrome **124.0.6367.219** on Android **15/API 35**, fresh Pixel 5 profile, 1080×2340 / density 440; real browser viewport **393×701 CSS px**, DPR 2.75. [Final report](evidence/android-chrome-final.json). This is an emulator, not a physical device; Chrome is an older bundled version, not a claimed current stable browser. UA version reduction reports Android 10/K; system properties establish Android 15. |
| Native Windows Chrome zoom | **PASS with qualification**, Chrome **157.0.8103.79**, actual UI Ctrl+plus zoom (computer-use skill). Native 200%: **713×394**, DPR 2.5. Native 400%: **356×197**, DPR 5; OS display scaling accounts for baseline DPR 1.25. No viewport/page-scale emulation used. [200%](evidence/zoom200-final.json), [final isolated 400%](evidence/zoom400-acceptance.json). |
| Physical Android/iPhone | **UNTESTED.** No authorised clean physical device was supplied/used. No personal phone, CatchID journal or unrelated browser content accessed. |
| Actual Safari | **UNTESTED.** No accessible Apple test environment identified. Windows WebKit cannot close this gate. |
| Spoken screen reader | **UNTESTED.** Narrator is installed but not running; fresh emulator includes TalkBack. Available control/inspection tools provide UI trees/screenshots, not a supported spoken-output acceptance session. Neither was represented as spoken testing. No global reader was enabled against unrelated user windows. |

## New tests and safeguards

Both routes: first visit, saved rejection, equal Accept/Reject controls, keyboard consent choice, persistence, consent heading focus, withdrawal and opener focus restoration; sequential Tab and menu Enter/navigation, FAQ keyboard operation; exactly two badges, `com.catchid.app`, route-specific UTM campaign and matching install referrer; two inert click events for two badge activations, no duplicates; no unexpected external resources, broken loaded images, horizontal overflow or runtime exceptions. Long sections were traversed by real scrolling. Descriptive alternatives and on-page sample/historical qualifications are unchanged.

The Android emulator used a **new** AVD/userdata directory. Only hardware configuration was copied from CRO-07A; no prior userdata or CatchID APK was copied, installed or opened. Preinstalled Chrome was continued without an account. [Environment evidence](evidence/android-environment.json): zero accounts, zero third-party packages, Android 15/35, Wi-Fi disabled; final airplane mode on and active default network **none**. The global mobile-data preference still reads 1 despite the earlier `svc data disable` command; it is not falsely reported as 0. The disconnected default network, startup dead proxy/DNS and browser interception are the isolation evidence. ADB reverse provides loopback access. No real analytics loader/events, sign-in, Play navigation/install, Firebase or advertising interaction occurred.

All external page requests were intercepted. The expected GA loader was served an inert local fixture **only after consent**; no Google analytics code ran or event reached Google. Badge navigation was prevented during the local event assertions, with full target URLs inspected. This does not claim a fresh live Play Store handoff test.

## Sceptical visual assessment

Actual Android captures retain the approved premium hierarchy, immediately reachable Play badge and equal consent choices. The old preinstalled browser renders the real hero and app imagery without a new layout defect. Full-page captures retain the long product sections; small text embedded in historical screenshots remains illustrative rather than a replacement for readable HTML copy and alt text. No new redesign is warranted.

At **400%**, the short 197px viewport invokes the existing consent `max-height:50dvh; overflow-y:auto`. Both choices are partially below the panel's initial scroll position; vertical panel scrolling or keyboard focus reveals them. They are equal, reachable and operable, not lost. Focus scrolls the panel approximately 27.8px; the bottom edge of the gold ring may meet/clip at the scrollport edge, while its top/sides and the complete control remain visible. Further panel scrolling reveals the edge. This is a real extreme-zoom usability qualification, not an all-focus-edges-visible claim. No two-dimensional page scrolling or loss of tested functionality was observed; full WCAG conformance is not asserted.

The initial 400% assertion incorrectly required all controls fully visible before scrolling and failed twice. Its [raw result](evidence/zoom400.json) is retained. The final assertion checks the intended scrollable panel's keyboard reachability and visible controls rather than waiving operation. An initial Android FAQ check read the state immediately after remote key dispatch and reported one failure; allowing 150ms for the event to settle passes on both routes. [Initial result](evidence/android-chrome.json) retained. No application changes were made to obtain either pass.

Default Playwright screenshots at native desktop zoom capture an unsuitable clipped portion of the compositor. Those diagnostic `zoom*.png` files are retained but **are not visual acceptance evidence**. Use the settled `native400-*-final.png` images captured by `Page.captureScreenshot({fromSurface:false})`, and the separate native-window screenshot. No pixels were edited. Android screenshots use the actual Android browser compositor. See the [offline gallery](index.html).

## Smallest final manual acceptance

Use an authorised clean device/session and the exact candidate served privately on a local network or USB loopback, **not a new public preview**. Block/intercept analytics while exercising acceptance. Do not install CatchID, sign in or use personal journal data.

1. On a physical Android Chrome phone, open both routes, scroll Record/Journal, use Menu and one FAQ, reject analytics, reload, reopen choices and verify withdrawal. Inspect the badge destination/package; no test install or live measurement is needed.
2. If an iPhone/Mac is available, repeat in actual Safari with text enlargement/zoom and the Apple keyboard preferences used by the tester. Record device/OS/browser, not “WebKit” as a substitute.
3. In one supported spoken reader session (TalkBack, VoiceOver or Narrator), hear the page title/headings, screenshot descriptions, two named Play links, Menu/FAQ states, consent heading and both choices; check that reopening/dismissing returns focus and nothing traps navigation.

This is one bounded acceptance session, not a new development milestone. If environments remain unavailable, Pete may explicitly accept the residual coverage risk for the modest static marketing site. Keep the result **UNTESTED / OWNER-ACCEPTED LIMITATION**, never PASS. A material issue actually observed must be resolved before publication; none is presumed from tool absence alone.
