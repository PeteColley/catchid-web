import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, relative } from "node:path";
import { createHash } from "node:crypto";
import { verifyAnalytics } from "./verify-analytics.mjs";

const origin = "https://catchid.app";
const dist = resolve("dist");
const decode = (value) => value.replace(/&(?:amp|quot|apos|lt|gt|nbsp|#39|#x27);/g, (entity) => ({
  "&amp;": "&", "&quot;": '"', "&apos;": "'", "&#39;": "'", "&#x27;": "'", "&lt;": "<", "&gt;": ">", "&nbsp;": " ",
})[entity]);
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map(([value]) => value);
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(([, key, value]) => [key, decode(value ?? "")]));
const visibleText = (html) => decode(html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, " ").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = resolve(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});
const files = walk(dist);
const pages = [
  { path: "/", title: "CatchID – Fishing Journal & Fish Identification App for Android", medium: "referral", campaign: "website_launch" },
  { path: "/fishing-journal-app/", title: "Fishing Journal App for Android | CatchID", medium: "organic", campaign: "fishing_journal_app" },
];
const pageFile = (path) => resolve(dist, `.${path}`, "index.html");
assert.deepEqual(files.filter((file) => file.endsWith(".html")).sort(), pages.map(({ path }) => pageFile(path)).sort(), "Exactly the two intended HTML pages");
const documents = new Map(pages.map(({ path }) => [path, readFileSync(pageFile(path), "utf8")]));
// CRO-07A originals are the only permitted sources for the two new examples.
const approvedCaptures = [
  ['save-catch-no-photo-upper-1080x2340', '9a9f9671158643fc1ac8499a24177eac6fae40ffbf2cc74d71b8b50957dd6291', 'ManualEntry'],
  ['catch-details-no-photo-1080x2340', '8467825c56f0796c15fe67ab76400945837631da90019dc7b9c0a333b6093fd5', 'JournalStory'],
];
for (const [name, hash, component] of approvedCaptures) {
  const source = `docs/CID-WEB-CRO-07/captures/${name}.png`;
  assert.equal(createHash('sha256').update(readFileSync(source)).digest('hex'), hash, 'Approved untouched capture: '+name);
  assert.ok(readFileSync(`src/components/${component}.astro`, 'utf8').includes(`from '../../${source}'`), 'Production example imports the genuine original');
}
const consentSource = readFileSync("src/components/WebAnalyticsConsent.astro", "utf8").replaceAll('\r\n', '\n').match(/<script\b[^>]*>([\s\S]*?)<\/script>/)[1].trim();
assert.equal(createHash('sha256').update(consentSource).digest('hex'), '34836c83600fbfc1aa0464a0f1e29342189c6b50066d593411e41aa5bb6eb891', 'Production consent logic remains unchanged from the verified baseline');
const presentationSource = readFileSync('src/components/SiteInteractions.astro', 'utf8').match(/<script\b[^>]*>([\s\S]*?)<\/script>/)[1].trim();
assert.doesNotMatch(presentationSource, /localStorage|sessionStorage|document\.cookie|fetch\(|XMLHttpRequest|sendBeacon|gtag|https?:|createElement/, 'Presentation code has no storage, analytics, network or script injection');
const manifest = JSON.parse(readFileSync("package.json", "utf8"));
assert.deepEqual(Object.keys(manifest.dependencies).sort(), ["@astrojs/check", "astro", "typescript"], "No added runtime dependencies");
for (const group of ["devDependencies", "optionalDependencies", "peerDependencies"]) {
  assert.deepEqual(Object.keys(manifest[group] ?? {}), [], "No added JavaScript dependencies");
}
const idsIn = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id);
const badgePath = "/assets/google-play-badge.svg";
// Fingerprint of the unchanged official English web SVG; see docs/ASSETS.md.
const badgeHash = "4ffa4c7edd2f10b297ca4de2131eddaa00d03b2278d1e178fe512920d824ca34";
for (const file of [`public${badgePath}`, `dist${badgePath}`]) {
  assert.equal(createHash("sha256").update(readFileSync(file)).digest("hex"), badgeHash, "Official badge artwork is unchanged");
}

function checkLocal(value, from, requireLocal = false) {
  const url = new URL(value, `${origin}${from}`);
  if (requireLocal) assert.equal(url.origin, origin, `Asset must be local: ${value}`);
  if (url.origin !== origin) return;
  const target = resolve(dist, `.${decodeURIComponent(url.pathname)}`);
  assert.ok(!relative(dist, target).startsWith(".."), `Path stays inside output: ${value}`);
  assert.ok(existsSync(target), `Local target exists: ${value}`);
  const file = statSync(target).isDirectory() ? resolve(target, "index.html") : target;
  assert.ok(existsSync(file), `Local target is a file: ${value}`);
  if (url.hash && file.endsWith(".html")) {
    assert.ok(idsIn(readFileSync(file, "utf8")).includes(decodeURIComponent(url.hash.slice(1))), `Anchor exists: ${value}`);
  }
}

let totalPlay = 0;
for (const page of pages) {
  const html = documents.get(page.path);
  const text = visibleText(html);
  const ids = idsIn(html);
  const links = tags(html, "a").map(attrs);
  const meta = tags(html, "meta").map(attrs);
  const metaValue = (name) => {
    const matches = meta.filter((item) => item.name === name || item.property === name);
    assert.equal(matches.length, 1, `${page.path}: one ${name}`);
    return matches[0].content;
  };
  assert.equal(ids.length, new Set(ids).size, `${page.path}: no duplicate IDs`);
  assert.equal(tags(html, "h1").length, 1, `${page.path}: one H1`);
  const titles = [...html.matchAll(/<title>(.*?)<\/title>/gs)];
  assert.equal(titles.length, 1);
  assert.equal(decode(titles[0][1]), page.title);
  assert.equal(attrs(tags(html, "html")[0]).lang, "en-GB");
  assert.equal(metaValue("viewport"), "width=device-width, initial-scale=1");
  const description = metaValue("description");
  assert.ok(description.length >= 80 && description.length <= 180, "Useful, concise description");
  const canonicals = tags(html, "link").map(attrs).filter(({ rel }) => rel === "canonical");
  assert.equal(canonicals.length, 1);
  assert.equal(canonicals[0].href, `${origin}${page.path}`);
  assert.equal(metaValue("og:url"), `${origin}${page.path}`);
  assert.equal(metaValue("og:type"), "website");
  assert.equal(metaValue("og:locale"), "en_GB");
  assert.equal(metaValue("og:site_name"), "CatchID");
  assert.equal(metaValue("og:title"), page.title);
  assert.equal(metaValue("og:description"), description);
  const scripts = [...html.matchAll(/(<script\b[^>]*>)([\s\S]*?)<\/script>/gi)];
  assert.equal(tags(html, "script").length, 2, "Only shared consent and bounded presentation scripts");
  assert.equal(scripts.length, 2);
  assert.deepEqual(attrs(scripts[1][1]), { script: "", id: "catchid-site-presentation" });
  assert.equal(scripts[1][2].trim(), presentationSource);
  assert.deepEqual(attrs(scripts[0][1]), { script: "", id: "catchid-web-analytics" }, "One inline script, with no static src or other script attributes");
  assert.equal(scripts[0][2].trim(), consentSource, "Both pages contain the exact shared implementation");
  assert.deepEqual([...new Set(html.match(/G-[A-Z0-9]{10}\b/g))], ["G-LPXGL5VTB1"], "Exact website measurement ID only");
  assert.doesNotMatch(html, /<\s*(?:iframe|object|embed)\b|\bGTM-[A-Z0-9]+\b/i, "No other tag manager/tracker embedding");
  assert.doesNotMatch(html, /<link\b[^>]*rel="(?:preconnect|dns-prefetch|preload|modulepreload)"/i, "No speculative third-party connections");
  const controls = tags(html, "button").map(attrs);
  assert.deepEqual(controls.map(({ id }) => id).sort(), ["analytics-accept", "analytics-choices", "analytics-reject"]);
  assert.ok(controls.every(({ type }) => type === "button"), "Native keyboard-accessible buttons");
  const opener = controls.find(({ id }) => id === "analytics-choices");
  assert.equal(opener["aria-controls"], "analytics-consent");
  assert.equal(opener["aria-expanded"], "false");
  assert.match(html, /<footer\b[\s\S]*?id="analytics-choices"[\s\S]*?>Analytics choices<\/button>[\s\S]*?<\/footer>/);
  assert.match(html, /<section\b[^>]*id="analytics-consent"[^>]*aria-labelledby="analytics-title"[^>]*hidden/);
  assert.match(html, /id="analytics-title" tabindex="-1"/);
  assert.match(html, /id="analytics-accept">Accept analytics<\/button>/);
  assert.match(html, /id="analytics-reject">Reject analytics<\/button>/);
  verifyAnalytics(scripts[0][2], page.path, links.filter(({ href }) => new URL(href, origin).hostname === 'play.google.com').map(({ href }) => href));
  assert.match(consentSource, /play_store_click/, "Shared consent runtime includes the consent-gated Play Store click event");
  assert.match(consentSource, /gclid.*gbraid/s, "Shared consent runtime preserves supported inbound paid-attribution keys");
  assert.doesNotMatch(html, /\son\w+\s*=|javascript:|<form\b/i, "No script handlers or forms");

  const play = links.filter(({ href }) => new URL(href, origin).hostname === "play.google.com");
  const homepage = page.path === "/";
  const badgeCount = 2;
  assert.equal(play.length, 2, `${page.path}: exactly the hero and final official badges`);
  const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)[0];
  assert.doesNotMatch(header, /play\.google\.com|play-badge|header-cta|<button/, 'No header download CTA or replacement badge');
  assert.doesNotMatch(html, /play-link compact|data-preview|preview-dialog|opens no store|Local demo/, 'No prototype store/consent simulation');
  assert.match(header, /aria-label="Main"/);
  assert.match(header, /class="mobile-menu"/);
  const anchorMarkup = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map(([markup]) => markup);
  const badges = anchorMarkup.filter((markup) => attrs(tags(markup, "a")[0]).class?.split(/\s+/).includes("play-badge"));
  assert.equal(badges.length, badgeCount, "Official badges at the intended acquisition moments");
  for (const [index, markup] of badges.entries()) {
    const link = attrs(tags(markup, "a")[0]);
    assert.ok(play.some(({ href }) => href === link.href), "Badge uses the tracked Play destination");
    const images = tags(markup, "img").map(attrs);
    assert.equal(images.length, 1);
    assert.equal(images[0].src, badgePath);
    assert.equal(images[0].alt, "Get CatchID on Google Play", "Badge link has an accessible name");
    assert.equal(images[0].width, "239");
    assert.equal(images[0].height, "71");
    assert.equal(images[0].loading, index === 0 ? "eager" : "lazy", "Only the above-fold badge loads eagerly");
    assert.equal(images[0].fetchpriority, index === 0 ? "high" : undefined);
    assert.equal(visibleText(markup), "", "No custom text or artwork added inside the badge link");
  }
  const hero = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)].map(([markup])=>markup).find(markup=>/class="(?:hero|landing-hero) wrap"/.test(markup));
  assert.ok(hero?.includes(badges[0]), 'Hero contains the first official badge');
  const final = html.slice(html.indexOf('class="final-invite wrap"'));
  assert.ok(final.includes(badges[1]), 'Final conversion section contains the second official badge');
  assert.equal(tags(html, "img").map(attrs).filter(({ src }) => src === badgePath).length, badgeCount, "No extra store badges in navigation");
  assert.equal((text.match(/Google Play and the Google Play logo are trademarks of Google LLC\./g) || []).length, 1, "One narrow Google trademark attribution");
  for (const { href } of play) {
    const url = new URL(href);
    assert.equal(url.origin, "https://play.google.com");
    assert.equal(url.pathname, "/store/apps/details");
    const referrer = new URLSearchParams({
      utm_source: "catchid_website", utm_medium: page.medium, utm_campaign: page.campaign,
    }).toString();
    assert.deepEqual([...url.searchParams].sort(), Object.entries({
      id: "com.catchid.app", utm_source: "catchid_website", utm_medium: page.medium, utm_campaign: page.campaign, referrer,
    }).sort(), `${page.path}: exact Play attribution and install referrer, with no duplicate parameters`);
    assert.equal(url.hash, "");
  }
  totalPlay += play.length;
  for (const { href } of links) checkLocal(href, page.path);
  for (const { href } of tags(html, "link").map(attrs)) checkLocal(href, page.path, true);
  for (const img of tags(html, "img").map(attrs)) {
    assert.ok(Object.hasOwn(img, "alt"), "Image has alt attribute");
    assert.match(img.width, /^[1-9]\d*$/);
    assert.match(img.height, /^[1-9]\d*$/);
    checkLocal(img.src, page.path, true);
    if (img.srcset) for (const candidate of img.srcset.split(",")) checkLocal(candidate.trim().split(/\s+/)[0], page.path, true);
    assert.ok(["lazy", "eager"].includes(img.loading), "Explicit image loading strategy");
    if (img.alt && img.src !== badgePath) assert.ok(img.alt.trim().length > 20, "Descriptive product-image alt");
  }
  for (const image of tags(html, 'image').map(attrs)) checkLocal(image.href, page.path, true);
  for (const svg of tags(html, 'svg').map(attrs)) {
    assert.equal(svg.role, 'img');
    assert.ok(svg['aria-label']?.length > 20, 'Descriptive crop accessible name');
  }

  assert.match(text, /manual(?:ly)? (?:entry|record)|log manually|add a catch yourself/i, 'Manual recording remains explicit');
  assert.match(text, /without a photo/i);
  assert.match(text, /likely species suggestion/i);
  assert.match(text, /A suggestion\W+never a guarantee/i);
  assert.match(text, /Identification is always optional/i);
  assert.match(text, /Free on Android · No account needed to start/);
  assert.match(text, /includes advertising/i);
  assert.doesNotMatch(text, /no adverts|no ads\b|ad[- ]free|free forever|private by default|guaranteed identification|guaranteed fishing/i);
  for (const concept of ['Personal Records','recorded species','fishing history']) assert.ok(text.toLowerCase().includes(concept.toLowerCase()));
  assert.match(text, /Based on your recorded catches\. Views develop as your journal grows; some need enough data\./);
  assert.match(text, /They don[’']t measure catch rates or fishing effort\./);
  const claims=text.replace(/They (?:do not|don[’']t) measure (?:catch rates or fishing effort|fishing effort or catch rates)\./gi,'');
  assert.doesNotMatch(claims,/\b(?:success(?:ful|\s+rates?)?|productiv\w*|best\s+(?:bait|venue|location|water|method)|catch\s+rates?)\b/i);
  const screenshotUrls=[...tags(html,'img'),...tags(html,'image')].map(attrs).map(x=>x.src||x.href);
  for(const asset of ['journal.','personal-records.','insights-overview.','identify.', ...(homepage ? approvedCaptures.map(([name])=>name+'.') : ['home-1.2.12.'])]) assert.ok(screenshotUrls.some(src=>src.includes(asset)), 'Authentic product evidence: '+asset);
  if (homepage) {
    for (const [section, name] of [['record', approvedCaptures[0][0]], ['journal', approvedCaptures[1][0]]]) {
      const markup=html.match(new RegExp(`<section\\b[^>]*id="${section}"[\\s\\S]*?<\\/section>`))?.[0];
      assert.ok(markup, 'Authentic example section exists: '+section);
      assert.ok(tags(markup,'img').map(attrs).some(i=>i.src.startsWith('/_astro/'+name+'.')&&i.loading==='lazy'), 'Local optimised derivative in correct section');
      const webp=tags(markup,'source').map(attrs).find(s=>s.type==='image/webp');
      assert.ok(webp?.srcset, 'Responsive WebP screenshot renditions');
      for (const candidate of webp.srcset.split(',')) {
        const [url,width]=candidate.trim().split(/\s+/);
        assert.ok(url.startsWith('/_astro/'+name+'.')&&url.endsWith('.webp'), 'Derivative of the selected genuine capture');
        assert.ok(['360w','540w','720w','1080w'].includes(width), 'Bounded screenshot rendition width');
        checkLocal(url, page.path, true);
      }
      const caption=visibleText(markup.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/)?.[1]||'');
      assert.match(caption, /Actual CatchID UI · Controlled demonstration data · No photo required/, 'Adjacent visible demonstration-data disclosure');
      assert.match(caption, /excerpt/, 'Crop is honestly labelled');
    }
    assert.doesNotMatch(html, /save-catch-no-photo-lower|Three ways to begin|The place\. The photograph\.|Original photograph and recorded details/, 'No supporting lower capture or obsolete nearby copy');
  }
  assert.doesNotMatch(html,/static\.metricool\.com/i);
  const protectionBlocks=[...html.matchAll(/<(article|details)\b[^>]*\bdata-journal-protection(?:="[^"]*")?[^>]*>[\s\S]*?<\/\1>/gi)].map(([markup])=>markup);
  assert.equal(protectionBlocks.length,2,'Bounded trust and account FAQ protection copy');
  for(const block of protectionBlocks){
    const copy=visibleText(block);
    assert.match(copy,/Journal Protection is optional|Optional Journal Protection/i);
    assert.match(copy,/Sign in with Google|Google sign-in/i);
    if(/restore/i.test(copy)){
      assert.match(copy,/(?:once|when) protection is up to date, your protected catch records and backed-up catch photos can be restored using the same Google account/i);
      assert.match(copy,/(?:keep using CatchID|still use CatchID|keep recording catches) without signing in/i);
    }
    assert.doesNotMatch(copy,/guaranteed|instant(?:ly)?|automatic(?:ally)?|every (?:gallery )?photo|end.to.end encrypt|account (?:is )?required|must sign in/i);
  }
  const outsideProtection=visibleText(protectionBlocks.reduce((remaining,block)=>remaining.replace(block,''),html));
  assert.doesNotMatch(outsideProtection,/\b(?:cloud|backups?|sync(?:ing|hronisation)?|multi[ -]device|imports?|CatchID Pro|ML|machine learning|Ask My Journal|Evidence Engine|journal protection)\b/i);
  assert.doesNotMatch(text,/\b(?:multi[ -]device|imports?|CatchID Pro|ML|machine learning|Ask My Journal|Evidence Engine)\b/i);
  assert.doesNotMatch(text,/CatchID 1\.2\.\d|Journal Protection[^.!?]*(?:planned|coming soon|not available|future|will be available)/i);
  assert.equal(visibleText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)[1]),homepage?'Every catch has a story. Keep yours.':'Your catches. Your details. Your journal.');
  assert.ok(links.some(({href})=>href==='/fishing-journal-app/'));
  assert.ok(links.some(({href})=>href==='/'));
  assert.ok(links.some(({href})=>href==='https://petecolley.github.io/catchid-privacy/'));
  assert.ok(links.some(({href})=>href==='mailto:colley.apps@gmail.com'));
  assert.ok(ids.includes('questions'));
  assert.equal(tags(html.match(/<div class="questions">([\s\S]*?)<\/div>/)[1], 'details').length,5);
  assert.equal(createHash('sha256').update(readFileSync('src/assets/home-1.2.12.png')).digest('hex'),'7e228e3c048f27aa5e3f40b604a9528ad6e81ef264328cda8ce7cdecfb69e349');

  console.log(`PASS: ${page.path} — metadata, semantics, links, images, honest copy; ${play.length} Play CTAs (${page.medium}/${page.campaign}), including ${badges.length} accessible official badges.`);
}

assert.equal(readFileSync("dist/robots.txt", "utf8"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url).sort(), pages.map(({ path }) => `${origin}${path}`).sort(), "Exactly the intended sitemap URLs");
assert.equal(readFileSync("dist/CNAME", "utf8").trim(), "catchid.app");
assert.ok(!files.some((file) => /\.(?:m?js|cjs)$/i.test(file)), "No JavaScript artifacts");
for (const file of files.filter((file) => /\.(?:html|css|xml|txt)$/i.test(file))) {
  const contents = readFileSync(file, "utf8");
  assert.doesNotMatch(contents, /localhost|127\.0\.0\.1|0\.0\.0\.0|https?:\/\/(?:[^/\s"<>]*\.(?:invalid|test|localhost)|example\.(?:com|org|net))|http:\/\/catchid\.app|https:\/\/(?:www\.catchid\.app|petecolley\.github\.io\/catchid-web)/i);
  if (file.endsWith(".css")) {
    const from = `/${relative(dist, file).replaceAll("\\", "/")}`;
    for (const [, url] of contents.matchAll(/url\(["']?([^\s)"']+)["']?\)/g)) checkLocal(url, from, true);
    assert.doesNotMatch(contents, /@import/i, "No external stylesheets or fonts");
  }
}
console.log(`PASS: ${pages.length} pages, ${totalPlay} tracked CTAs; exact sitemap, robots, CNAME; local assets; one shared inline consent script plus bounded presentation per page, no JavaScript artifacts or added dependencies.`);
console.log(`Static output: ${files.length} files, ${files.reduce((sum, file) => sum + statSync(file).size, 0)} bytes including full-size screenshot links.`);
