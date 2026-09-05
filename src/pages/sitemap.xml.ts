import type { APIRoute } from "astro";
// The production site origin supplies the single-page sitemap.
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? `<url><loc>${new URL("/", site).href.replaceAll("&", "&amp;")}</loc></url>` : ""}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
