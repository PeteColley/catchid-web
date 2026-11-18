import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function walk(dir){const out=[];for(const ent of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())out.push(...await walk(p));else out.push(p)}return out}
let out='# Complete review file inventory\n\n**DESIGN CONCEPT — NOT LIVE.** Every path is under `docs/CID-WEB-CRO-03/`. Source/evidence SHA-256 values describe local bytes. This inventory includes itself by name but omits its own self-referential hash. Regenerate with `node docs/CID-WEB-CRO-03/qa/manifest.mjs`.\n\n| Relative path | Bytes | SHA-256 |\n| --- | ---: | --- |\n';
const files=(await walk(docs)).filter(p=>path.basename(p)!=='FILE_MANIFEST.md').sort();
for(const p of files){const b=await fs.readFile(p);out+=`| ${path.relative(docs,p).replaceAll('\\','/')} | ${b.length} | ${createHash('sha256').update(b).digest('hex')} |\n`}
out+='| FILE_MANIFEST.md | self | omitted by design |\n';
out+=`\nTotal files: **${files.length+1}**. No production files are included.\n`;
await fs.writeFile(path.join(docs,'FILE_MANIFEST.md'),out);
