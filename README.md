# CatchID website

Static Astro website for [CatchID](https://catchid.app).

## Development

Use Node.js 24 and npm.

1. `npm ci`
2. `npm run check`
3. `npm run build`
4. `npm run verify`
5. `npm run preview`

The preview binds to the local computer. The site has one shared inline analytics-consent script per page, no generated JavaScript bundles, remote fonts, forms, or server runtime. Google Analytics loads only after an explicit saved acceptance.

## Structure

- `src/pages/index.astro`: homepage and SEO metadata.
- `src/pages/fishing-journal-app.astro`: fishing journal acquisition page and its metadata.
- `src/components/PlayLink.astro`: acquisition button.
- `src/components/WebAnalyticsConsent.astro`: shared optional website analytics and consent control.
- `src/config.ts`: typed Play Store campaigns, privacy, and support destinations.
- `src/styles/global.css`: responsive styles.
- `src/assets/`: product artwork, optimized by Astro at build time.
- `src/pages/robots.txt.ts`, `src/pages/sitemap.xml.ts`: static SEO endpoints.
- `scripts/verify.mjs`: generated-output checks.
- `scripts/verify-analytics.mjs`: deterministic behaviour checks against the generated consent script, run by `npm run verify`.

The homepage uses the `website_launch` Play campaign (`referral`); the fishing journal page uses `fishing_journal_app` (`organic`). Both use `catchid_website` as the source. Pass the campaign to `PlayLink`, or use `getPlayUrl` for plain links.

Verification covers both pages, their metadata and internal links, Play attribution, image assets, content guardrails, and the static output contract. For visual review, run `npm run preview` and inspect `/` and `/fishing-journal-app/` at 360, 390, 430, 768, 1024 and 1440 px. Confirm early access to the Play CTA, readable screenshots and FAQs, and no horizontal overflow.

## Optional website analytics

The only measurement ID is `G-LPXGL5VTB1`. The origin-scoped localStorage key `catchid.website.analytics` stores `granted` or `denied`. Missing, invalid or unreadable preferences leave analytics off. Before acceptance there is no Google script request, gtag initialisation, or analytics cookie creation. Both choices are equally prominent, and the footer's **Analytics choices** button reopens the prompt.

Acceptance loads the standard `gtag.js` once per document and configures its normal page view and enhanced measurement. Google signals and advertising personalisation signals are disabled; no custom events or user IDs are added. The site's navigation remains ordinary static page navigation.

Rejection sets Google's `ga-disable-G-LPXGL5VTB1` flag, saves the preference and attempts to expire `_ga` / `_ga_*` root-path first-party cookies for the host and parent domains. It cannot recall measurements already sent, queued or in flight while consent was granted; a previously queued request can finish after rejection. Subsequent rejected page loads do not load GA. Open tabs and pages restored from the back cache recheck the saved choice. If storage cannot be written, analytics stays off on that page and the prompt explains that the choice could not be saved; a stale saved grant is removed if storage permits. With JavaScript disabled, analytics and its inactive controls remain off/hidden.

For browser verification, clear that preference and inspect Network and Cookies on both routes: first visit has no Google request; rejection survives reload; acceptance requests `https://www.googletagmanager.com/gtag/js?id=G-LPXGL5VTB1` and measures the current page without a refresh; accepted reload starts once; reopening and rejecting clears accessible GA cookies and the next load makes no Google request. Check keyboard focus, cross-tab withdrawal, and the responsive widths above. Intercept collection requests when testing the real library locally to avoid recording test traffic in the production property.

Implementation references: [Google tag setup](https://developers.google.com/tag-platform/gtagjs) and [Google privacy controls](https://developers.google.com/tag-platform/security/guides/privacy?hl=en).

## Deployment

**Privacy prerequisite satisfied:** the [CatchID privacy policy](https://petecolley.github.io/catchid-privacy/) describes optional website analytics and was published in privacy-repository commit `6ce5a74f46ffdc33751d44cf108f82ada12f3acc`. The website analytics deployment has been separately authorised. The privacy repository remains outside this deployment slice.

GitHub Pages uses GitHub Actions. Pushes to `main`, or a manual workflow dispatch, install dependencies from the lockfile, check and build the site, verify the output, and deploy the Pages artifact.

In repository Settings → Pages, select **GitHub Actions** as the source and configure **catchid.app** as the custom domain. Domain ownership verification, DNS, and HTTPS must also be completed; see [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

The production origin is fixed to `https://catchid.app` in `astro.config.mjs`, with no repository-path base. `public/CNAME` is copied into the build as a domain declaration; for an Actions deployment, GitHub's Pages settings control the domain.

Only push the public `main` branch. Do not push local archive branches, all refs, or tags from development archives.
