# CatchID website

Static Astro website for [CatchID](https://catchid.app).

## Development

Use Node.js 24 and npm.

1. `npm ci`
2. `npm run check`
3. `npm run build`
4. `npm run verify`
5. `npm run preview`

The preview binds to the local computer. The site contains no client-side JavaScript, analytics, remote fonts, forms, or server runtime.

## Structure

- `src/pages/index.astro`: homepage and SEO metadata.
- `src/components/PlayLink.astro`: acquisition button.
- `src/config.ts`: Play Store, privacy, and support destinations.
- `src/styles/global.css`: responsive styles.
- `src/assets/`: product artwork, optimized by Astro at build time.
- `src/pages/robots.txt.ts`, `src/pages/sitemap.xml.ts`: static SEO endpoints.
- `scripts/verify.mjs`: generated-output checks.

## Deployment

GitHub Pages uses GitHub Actions. Pushes to `main`, or a manual workflow dispatch, install dependencies from the lockfile, check and build the site, verify the output, and deploy the Pages artifact.

In repository Settings → Pages, select **GitHub Actions** as the source and configure **catchid.app** as the custom domain. Domain ownership verification, DNS, and HTTPS must also be completed; see [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

The production origin is fixed to `https://catchid.app` in `astro.config.mjs`, with no repository-path base. `public/CNAME` is copied into the build as a domain declaration; for an Actions deployment, GitHub's Pages settings control the domain.

Only push the public `main` branch. Do not push local archive branches, all refs, or tags from development archives.
