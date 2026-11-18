import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const evidence=path.join(docs,'evidence','cro03a');
const names=(await fs.readdir(evidence)).filter(n=>n.endsWith('.png')).sort();
let text='# CRO-03A browser capture index\n\n**DESIGN ONLY — NOT LIVE · 18 November 2026**\n\nActual Chrome 157.0.8103.79 captures, CSS-pixel responsive emulation at DPR 1. Not physical-device screenshots. Previous CRO-03 [capture index](CAPTURE_INDEX.md) and evidence remain available. All links below are CRO-03A evidence. Section crops are direct browser captures, not image edits.\n\nFinal matrix: both routes × seven widths × first/saved consent = 28 normal-text cases; both routes × 320/390 × both states at 1.6× text = eight further cases. Saved consent is a local in-memory simulation; no preference is stored. Full pages at 390/1440 are included in both normal-text states. Use saved-state full pages for pacing and first-view captures for fixed-panel placement.\n\nViewports: 320×720, 360×800, 390×844, 430×932, 768×1024, 1024×900, 1440×1000. Enlarged text changes computed text sizes, not DPR.\n\n';
const groups=[['Final responsive matrix','matrix-'],['Visual pass 1','pass1-'],['Visual pass 2','pass2-'],['Inline alternative — not selected','inline-option-'],['Offline gallery and pages','offline-'],['Component crops','section-'],['Keyboard and navigation',null]];
for(const [label,prefix] of groups){
  text+=`## ${label}\n\n| Capture | PNG pixels | State / note |\n| --- | --- | --- |\n`;
  for(const name of names.filter(n=>prefix?n.startsWith(prefix):!groups.some(g=>g[1]&&n.startsWith(g[1])))){
    const b=await fs.readFile(path.join(evidence,name));
    const note=[name.includes('first')?'first visit':'',name.includes('saved')?'saved choice':'',name.includes('text160')?'1.6× text':'',name.includes('full')?'full page':'viewport / component'].filter(Boolean).join(' · ');
    text+=`| [${name}](evidence/cro03a/${name}) | ${b.readUInt32BE(16)} × ${b.readUInt32BE(20)} | ${note} |\n`;
  }
  text+='\n';
}
text+=`Total: **${names.length} PNGs**, including intermediate passes and the rejected inline arrangement. Final evidence is matrix/review; historical pass receipts can contain issues subsequently corrected.\n\nReceipts: [final matrix](evidence/cro03a/matrix-verification.json), [offline review](evidence/cro03a/review-verification.json), [asset/contrast/source checks](evidence/cro03a/static-verification.json), [first audit retained for transparency](evidence/cro03a/matrix-first-audit.json).\n`;
await fs.writeFile(path.join(docs,'CRO03A_CAPTURE_INDEX.md'),text);
