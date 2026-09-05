import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync("dist/index.html", "utf8");
const config = readFileSync("src/config.ts", "utf8");
const expected = config.match(/PLAY_URL\s*=\s*["']([^"']+)["']/)[1];
const decode = (s) => s.replaceAll("&amp;", "&");
const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => decode(m[1]));
const play = links.filter((href) =>
  href.startsWith("https://play.google.com/"),
);
assert.equal(
  play.length,
  4,
  "Header, hero, final and footer acquisition links",
);
assert.ok(
  play.every((href) => href === expected),
  "Every Play link uses the central tracked URL",
);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(ids.length, new Set(ids).size, "No duplicate HTML IDs");
for (const href of links) {
  if (href.startsWith("#") && href.length > 1)
    assert.ok(ids.includes(href.slice(1)), `Anchor exists: ${href}`);
  if (href.startsWith("/"))
    assert.ok(
      existsSync(resolve("dist", href.slice(1))),
      `Local link exists: ${href}`,
    );
}
for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  assert.match(match[0], /\salt(?:="[^"]*")?(?=\s|>)/);
  assert.match(match[0], /width="\d+"/);
  assert.match(match[0], /height="\d+"/);
}
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.ok(!/<script\b/.test(html), "No client-side JavaScript");
assert.match(html, /<html lang="en-GB"/);
assert.match(html, /name="description"/);
assert.match(html, /property="og:title"/);
assert.match(html, /name="viewport"/);
assert.match(html, /No identification or photo needed/);
assert.match(html, /A suggestion, never a guarantee/);
assert.match(html, /Currently free/);
assert.ok(existsSync("dist/robots.txt"));
assert.ok(existsSync("dist/sitemap.xml"));
const origin = "https://catchid.app";
assert.match(html, /<link rel="canonical" href="https:\/\/catchid\.app\/"/);
assert.match(html, /<meta property="og:url" content="https:\/\/catchid\.app\/"/);
assert.equal(
  readFileSync("dist/robots.txt", "utf8"),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
assert.equal(
  readFileSync("dist/sitemap.xml", "utf8"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>`,
);
assert.equal(readFileSync("dist/CNAME", "utf8").trim(), "catchid.app");
for (const match of html.matchAll(/(?:src|href)="(\/[^"]+)"/g)) {
  assert.ok(existsSync(resolve("dist", match[1].slice(1))), `Asset exists: ${match[1]}`);
}
for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const candidate of match[1].split(",")) {
    const src = candidate.trim().split(/\s+/)[0];
    assert.ok(src.startsWith("/") && !src.startsWith("//"));
    assert.ok(existsSync(resolve("dist", src.slice(1))), `Responsive asset exists: ${src}`);
  }
}
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = `${dir}/${name}`;
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const files = walk("dist");
assert.ok(!files.some((file) => /\.(?:m?js|cjs)$/.test(file)), "No JavaScript artifacts");
for (const file of files.filter((file) => /\.(?:html|css|xml|txt)$/.test(file))) {
  assert.doesNotMatch(readFileSync(file, "utf8"), /localhost|127\.0\.0\.1|catchid\.invalid|http:\/\/catchid\.app|https:\/\/(?:www\.catchid\.app|petecolley\.github\.io\/catchid-web)/i);
}
console.log("PASS: production canonical, Open Graph, sitemap, robots, CNAME, image/CSS paths, and no placeholder origins or JavaScript artifacts.");
console.log(
  `PASS: ${play.length} tracked Play CTAs; local links/anchors; image alt/dimensions; semantics/metadata; manual entry and uncertainty copy; robots/sitemap; zero client scripts.`,
);
console.log(
  `Static output: ${files.length} files, ${files.reduce((sum, file) => sum + statSync(file).size, 0)} bytes including full-size screenshot links.`,
);
