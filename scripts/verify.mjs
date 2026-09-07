import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, relative } from "node:path";
import { createHash } from "node:crypto";

const origin = "https://catchid.app";
const dist = resolve("dist");
const decode = (value) => value.replace(/&(?:amp|quot|apos|lt|gt|#39|#x27);/g, (entity) => ({
  "&amp;": "&", "&quot;": '"', "&apos;": "'", "&#39;": "'", "&#x27;": "'", "&lt;": "<", "&gt;": ">",
})[entity]);
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map(([value]) => value);
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(([, key, value]) => [key, decode(value ?? "")]));
const visibleText = (html) => decode(html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, " ").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = resolve(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});
const files = walk(dist);
const pages = [
  { path: "/", title: "CatchID – Fish Identification & Fishing Journal App for Android", medium: "referral", campaign: "website_launch" },
  { path: "/fishing-journal-app/", title: "Fishing Journal App for Android | CatchID", medium: "organic", campaign: "fishing_journal_app" },
];
const pageFile = (path) => resolve(dist, `.${path}`, "index.html");
assert.deepEqual(files.filter((file) => file.endsWith(".html")).sort(), pages.map(({ path }) => pageFile(path)).sort(), "Exactly the two intended HTML pages");
const documents = new Map(pages.map(({ path }) => [path, readFileSync(pageFile(path), "utf8")]));
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
  assert.equal(tags(html, "script").length, 0, "No client scripts or unnecessary schema");
  assert.doesNotMatch(html, /\son\w+\s*=|javascript:|<form\b/i, "No script handlers or forms");

  const play = links.filter(({ href }) => new URL(href, origin).hostname === "play.google.com");
  assert.equal(play.length, 4, `${page.path}: header, hero, final and footer Play CTAs`);
  const anchorMarkup = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map(([markup]) => markup);
  const badges = anchorMarkup.filter((markup) => attrs(tags(markup, "a")[0]).class?.split(/\s+/).includes("play-badge"));
  assert.equal(badges.length, 2, "Official badges at the two primary download moments");
  for (const markup of badges) {
    const link = attrs(tags(markup, "a")[0]);
    assert.ok(play.some(({ href }) => href === link.href), "Badge uses the tracked Play destination");
    const images = tags(markup, "img").map(attrs);
    assert.equal(images.length, 1);
    assert.equal(images[0].src, badgePath);
    assert.equal(images[0].alt, "Get CatchID on Google Play", "Badge link has an accessible name");
    assert.equal(images[0].width, "239");
    assert.equal(images[0].height, "71");
    assert.equal(visibleText(markup), "", "No custom text or artwork added inside the badge link");
  }
  for (const name of ["hero", "final-cta"]) {
    const section = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)].map(([markup]) => markup)
      .find((markup) => attrs(tags(markup, "section")[0]).class?.split(/\s+/).includes(name));
    assert.ok(section && badges.some((badge) => section.includes(badge)), `${name} contains an official badge`);
  }
  assert.equal(tags(html, "img").map(attrs).filter(({ src }) => src === badgePath).length, 2, "No extra store badges in navigation");
  assert.equal((text.match(/Google Play and the Google Play logo are trademarks of Google LLC\./g) || []).length, 1, "One narrow Google trademark attribution");
  for (const { href } of play) {
    const url = new URL(href);
    assert.equal(url.origin, "https://play.google.com");
    assert.equal(url.pathname, "/store/apps/details");
    assert.deepEqual([...url.searchParams].sort(), Object.entries({
      id: "com.catchid.app", utm_source: "catchid_website", utm_medium: page.medium, utm_campaign: page.campaign,
    }).sort(), `${page.path}: exact Play attribution, with no duplicate parameters`);
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
    if (page.path !== "/") {
      assert.ok(["lazy", "eager"].includes(img.loading), "Explicit image loading strategy");
      if (img.loading === "eager") assert.equal(img.fetchpriority, "high", "Only the hero warrants eager loading");
      if (img.width !== "42" && img.src !== badgePath) assert.ok(img.alt.trim().length > 20, "Descriptive screenshot alt");
    }
  }
  assert.match(text, /manual(?:ly)? (?:entry|record)/i, "Manual recording is explicit");
  assert.match(text, /No identification or photo needed/i);
  assert.match(text, /likely species suggestion/i);
  assert.match(text, /A suggestion\W+never a guarantee/i);
  assert.match(text, /Currently free/i);
  assert.match(text, /Insights reflect saved catches\W+They (?:do not|don[’']t) measure fishing effort\W+blank sessions or success rates/i);
  // Allow the evidence limitation, but reject success claims elsewhere in visible copy.
  const claims = text.replace(/They (?:do not|don[’']t) measure fishing effort\W+blank sessions or success rates/gi, "");
  assert.doesNotMatch(claims, /\b(?:success(?:ful|\s+rates?)?|productiv\w*|best\s+(?:bait|venue|location|method)|catch\s+rates?)\b/i);
  assert.doesNotMatch(text, /\b(?:cloud|backups?|sync(?:ing|hronisation)?|multi[ -]device|imports?|CatchID Pro|ML|machine learning|Ask My Journal|Evidence Engine|journal protection)\b/i);
  if (page.path === "/") {
    assert.ok(links.some(({ href }) => href === "/fishing-journal-app/"), "Homepage links to journal page");
  } else {
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)[1];
    assert.equal(visibleText(h1), "A fishing journal that grows with every catch");
    assert.ok(links.some(({ href }) => href === "/"), "Journal links home");
    for (const field of ["species", "date", "time", "location", "weight", "fishing method", "bait", "lure", "fly", "photo"]) assert.ok(text.toLowerCase().includes(field), `Catch field: ${field}`);
    assert.ok(ids.includes("faq"), "Visible FAQ section exists");
  }
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
console.log(`PASS: ${pages.length} pages, ${totalPlay} tracked CTAs; exact sitemap, robots, CNAME; local assets; no development origins or JavaScript.`);
console.log(`Static output: ${files.length} files, ${files.reduce((sum, file) => sum + statSync(file).size, 0)} bytes including full-size screenshot links.`);
