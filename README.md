# CatchID website

Static Astro website for [CatchID](https://catchid.app).

## Development

Use Node.js 24 and npm.

1. `npm ci`
2. `npm run check`
3. `npm run build`
4. `npm run verify`
5. `npm run preview`

The preview binds to the local computer. The site has one shared inline analytics-consent script and one bounded presentation script per page, no generated JavaScript bundles, remote fonts, forms, or server runtime. Google Analytics loads only after an explicit saved acceptance.

## Structure

- `src/pages/index.astro`: homepage and SEO metadata.
- `src/pages/fishing-journal-app.astro`: fishing journal acquisition page and its metadata.
- `src/pages/guides/how-to-keep-a-fishing-journal.astro`: practical fishing-journal guide and standalone printable catch log.
- `src/layouts/SiteLayout.astro`: shared metadata and static document structure.
- `src/components/PlayLink.astro`: official Google Play badge link, used in acquisition-page heroes and final sections, and only in the guide's concluding section.
- `src/components/SiteHeader.astro`, `SiteFooter.astro`, and section components: the approved journal-first presentation.
- `src/components/SiteInteractions.astro`: mobile menu closing, focus/space handling for the fixed consent panel, and native worksheet printing; no analytics or storage.
- `src/product-assets.ts`: local build-time image encoding, with untouched original screenshot sources.
- `src/components/WebAnalyticsConsent.astro`: shared optional website analytics and consent control.
- `src/config.ts`: typed Play Store campaigns, privacy, and support destinations.
- `src/styles/global.css`: responsive styles.
- `src/assets/`: product artwork, optimized by Astro at build time.
- `src/pages/robots.txt.ts`, `src/pages/sitemap.xml.ts`: static SEO endpoints.
- `scripts/verify.mjs`: generated-output checks.
- `scripts/verify-analytics.mjs`: deterministic behaviour checks against the generated consent script, run by `npm run verify`.

The homepage uses the `website_launch` Play campaign (`referral`); the fishing journal page uses `fishing_journal_app` (`organic`); the practical guide uses `fishing_journal_guide` (`organic`). All use `catchid_website` as the source. Play destinations include the same values inside Google's `referrer` parameter for install attribution. Pass the campaign to `PlayLink`. Every direct Play action must use its unaltered official badge. The homepage and journal acquisition page each retain exactly two (hero and final section); the guide has one in its concluding CatchID section. Navigation may link to the final section.

Verification covers all three pages, their metadata and internal links, Play attribution, image assets, content guardrails, and the static output contract. For visual review, run `npm run preview` and inspect `/`, `/fishing-journal-app/`, and `/guides/how-to-keep-a-fishing-journal/` at 320, 360, 390, 430, 768, 1024 and 1440 px. Confirm early access to the acquisition-page Play CTA, readable screenshots and content, working nested navigation, and no horizontal overflow.

The guide's **Print the catch log** button uses native browser printing. The print stylesheet selects only the worksheet: five blank catch rows and optional separate trip notes on A4 landscape. Browser-added headers and footers should be switched off in the print dialog. Mobile shows a labelled first-row preview; all five rows print. With JavaScript disabled, use the browser Print menu. There are no form fields, submissions, saved worksheet data, generated-document dependencies or app import/export integration. The actual print PDF and screenshots are in [the CID-GROWTH-02 review pack](docs/CID-GROWTH-02/REVIEW.md).

## Optional website analytics

The only measurement ID is `G-LPXGL5VTB1`. The origin-scoped localStorage key `catchid.website.analytics` stores `granted` or `denied`. Missing, invalid or unreadable preferences leave analytics off. Before acceptance there is no Google script request, gtag initialisation, or analytics cookie creation. Both choices are equally prominent, and the footer's **Analytics choices** button reopens the prompt.

Acceptance loads the standard `gtag.js` once per document and configures its normal page view and enhanced measurement. Google signals and advertising personalisation signals are disabled and no user IDs are added. The only custom website event is `play_store_click`, emitted when a consenting visitor selects a CatchID Google Play link. If that consenting visit arrived with complete campaign UTMs, the Play link's install referrer is replaced at click time with the inbound campaign values (plus supported `gclid` / `gbraid` values when present), so the Firebase Analytics SDK can receive Play install-referrer attribution after install/open. Without consent, the website does not emit the custom event or dynamically copy inbound campaign parameters. The site's navigation remains ordinary static page navigation.

Rejection sets Google's `ga-disable-G-LPXGL5VTB1` flag, saves the preference and attempts to expire `_ga` / `_ga_*` root-path first-party cookies for the host and parent domains. It cannot recall measurements already sent, queued or in flight while consent was granted; a previously queued request can finish after rejection. Subsequent rejected page loads do not load GA. Open tabs and pages restored from the back cache recheck the saved choice. If storage cannot be written, analytics stays off on that page and the prompt explains that the choice could not be saved; a stale saved grant is removed if storage permits. With JavaScript disabled, analytics and its inactive controls remain off/hidden.

For browser verification, clear that preference and inspect Network and Cookies on both routes: first visit has no Google request; rejection survives reload; acceptance requests `https://www.googletagmanager.com/gtag/js?id=G-LPXGL5VTB1` and measures the current page without a refresh; accepted reload starts once; reopening and rejecting clears accessible GA cookies and the next load makes no Google request. Check keyboard focus, cross-tab withdrawal, and the responsive widths above. Intercept collection requests when testing the real library locally to avoid recording test traffic in the production property.

Implementation references: [Google tag setup](https://developers.google.com/tag-platform/gtagjs) and [Google privacy controls](https://developers.google.com/tag-platform/security/guides/privacy?hl=en).

## CRO-04 implementation candidate — not live

The CRO-03B design is implemented only on `codex/cid-web-cro-04-implementation`. See [handover](docs/CID-WEB-CRO-04/HANDOVER.md) and [asset release gates](docs/CID-WEB-CRO-04/ASSET_RELEASE_GATES.md). The hero uses temporary concept art with an on-page label. It is not cleared for publication; no deployment or main merge is authorised by this milestone.

## Deployment

**Privacy prerequisite satisfied:** the [CatchID privacy policy](https://petecolley.github.io/catchid-privacy/) describes optional website analytics and was published in privacy-repository commit `6ce5a74f46ffdc33751d44cf108f82ada12f3acc`. The website analytics deployment has been separately authorised. The privacy repository remains outside this deployment slice.

GitHub Pages uses GitHub Actions. Pushes to `main`, or a manual workflow dispatch, install dependencies from the lockfile, check and build the site, verify the output, and deploy the Pages artifact.

In repository Settings → Pages, select **GitHub Actions** as the source and configure **catchid.app** as the custom domain. Domain ownership verification, DNS, and HTTPS must also be completed; see [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

The production origin is fixed to `https://catchid.app` in `astro.config.mjs`, with no repository-path base. `public/CNAME` is copied into the build as a domain declaration; for an Actions deployment, GitHub's Pages settings control the domain.

Only an expressly authorised publication may advance `main`. Scoped review/implementation branches do not match the deployment trigger. Never push all refs, archive branches or tags from development archives.
