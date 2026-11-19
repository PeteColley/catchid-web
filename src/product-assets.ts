import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import journal from './assets/journal.jpg';
import identify from './assets/identify.jpg';
import home from './assets/home-1.2.12.png';
import records from './assets/personal-records.jpg';
import insights from './assets/insights-overview.jpg';

// Original source files remain untouched. Build-time encoding only; no invented UI.
const sources: Record<string, ImageMetadata> = {
  'journal.jpg': journal,
  'identify.jpg': identify,
  'home-1.2.12.png': home,
  'personal-records.jpg': records,
  'insights-overview.jpg': insights,
};
export const assets = Object.fromEntries(await Promise.all(
  Object.entries(sources).map(async ([name, src]) => [name, await getImage({
    src, width: src.width, format: 'webp', quality: 95,
  })]),
));
export const originalInsights = insights;
