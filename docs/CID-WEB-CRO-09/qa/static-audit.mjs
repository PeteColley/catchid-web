import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const baseline='94a4f5ed343b70e7f992556acb1a037158ebb9c4',out='docs/CID-WEB-CRO-09/evidence';
const git=(...args)=>execFileSync('git',args,{maxBuffer:30e6}).toString().trim();
const hash=b=>createHash('sha256').update(b).digest('hex');
const tree=git('ls-tree','-r',baseline).split('\n').map(l=>l.match(/^\d+ blob (\w+)\t(.+)$/)).filter(Boolean).filter(m=>m[2]!=='PROJECT_STATUS.md');
const hashes=execFileSync('git',['hash-object','--stdin-paths'],{input:tree.map(m=>m[2]).join('\n')+'\n',maxBuffer:30e6}).toString().trim().split('\n');
tree.forEach((m,i)=>assert.equal(hashes[i],m[1],'Baseline preserved: '+m[2]));
const extras=git('ls-files','--others','--exclude-standard').split('\n').filter(Boolean);assert.ok(extras.every(f=>f.startsWith('docs/CID-WEB-CRO-09/')));
async function walk(dir){const result=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);result.push(...e.isDirectory()?await walk(p):[p.replaceAll('\\','/')]);}return result;}
const files=await walk('dist'),pages=files.filter(f=>f.endsWith('.html'));assert.deepEqual(pages.sort(),['dist/fishing-journal-app/index.html','dist/index.html']);
const priorRoot='../cid-web-cro-08',output=[],images=[];
for(const f of files){const b=await fs.readFile(f);assert.deepEqual(b,await fs.readFile(path.join(priorRoot,f)),'Exact approved build output: '+f);output.push({path:f,bytes:b.length,sha256:hash(b)});if(/\.(png|jpg|webp|avif)$/.test(f)){const m=await sharp(b).metadata();images.push({path:f,bytes:b.length,width:m.width,height:m.height,format:m.format});}}
assert.ok(!files.some(f=>/\.map$|\.env|\.log$|\.ts$|\.json$|docs\/|concept|node_modules/i.test(f)),'No unintended diagnostic/source files');
const html=await fs.readFile('dist/index.html','utf8'),landing=await fs.readFile('dist/fishing-journal-app/index.html','utf8');
assert.doesNotMatch(html+landing,/AI concept|trout-concept|save-catch-no-photo-lower|sourceMappingURL|PRIVATE KEY|AIza[\w-]{30}/);
const sources=['src/assets/journal.jpg','src/assets/personal-records.jpg','src/assets/insights-overview.jpg','src/assets/identify.jpg','src/assets/home-1.2.12.png','src/assets/hero/photo-1-patagonia-savage-37096316.jpg','docs/CID-WEB-CRO-07/captures/save-catch-no-photo-upper-1080x2340.png','docs/CID-WEB-CRO-07/captures/catch-details-no-photo-1080x2340.png'];
const originals=[];for(const f of sources){const b=await fs.readFile(f),m=await sharp(b).metadata();originals.push({path:f,bytes:b.length,width:m.width,height:m.height,sha256:hash(b)});}
const derivatives=[];for(const name of ['save-catch-no-photo-upper-1080x2340','catch-details-no-photo-1080x2340']){const b=await fs.readFile('docs/CID-WEB-CRO-07/captures/'+name+'.png');const renditions=images.filter(i=>i.path.includes(name+'.'));assert.equal(renditions.length,8);for(const i of renditions){const expected=await sharp(b,{failOn:'none',pages:-1}).rotate().resize({width:i.width,height:i.height,withoutEnlargement:true}).toFormat(i.format,{quality:95}).toBuffer();assert.deepEqual(await fs.readFile(i.path),expected);derivatives.push(i.path);}}
const preserved=JSON.parse(await fs.readFile('docs/CID-WEB-CRO-07/evidence/preserved-unrelated-files.json','utf8'));for(const f of preserved)assert.equal(hash(await fs.readFile('../cid-free-02a/'+f.path)),f.sha256);
const script=html.match(/<script id="catchid-web-analytics">([\s\S]*?)<\/script>/)[1];
const pageFacts=[html,landing].map((h,i)=>({route:i?'/fishing-journal-app/':'/',canonical:h.match(/<link rel="canonical" href="([^"]+)/)?.[1],title:h.match(/<title>(.*?)<\/title>/)?.[1],scripts:[...h.matchAll(/<script([^>]*)>/g)].map(m=>m[1]),externals:[...new Set([...h.matchAll(/(?:src|href)="(https?:[^\"]+)"/g)].map(m=>m[1]))],imageReferences:[...new Set([...h.matchAll(/(?:src|href)="(\/_astro\/[^\"]+)"/g)].map(m=>m[1]))]}));
const lock=JSON.parse(await fs.readFile('package-lock.json','utf8'));const lifecycle=[];const nonRegistry=[];for(const [p,v] of Object.entries(lock.packages)){if(v.hasInstallScript)lifecycle.push({path:p,version:v.version});if(v.resolved&&!v.resolved.startsWith('https://registry.npmjs.org/'))nonRegistry.push({path:p,resolved:v.resolved});}
const report={utc:new Date().toISOString(),baseline,protectedTrackedFiles:tree.length,unrelatedDirtyFilesPreserved:preserved.length,allApprovedDistFilesByteIdentical:output.length,pages,pageFacts,consentSha256:hash(Buffer.from(script)),packageLockSha256:hash(await fs.readFile('package-lock.json')),node:process.version,embeddedUndici:process.versions.undici,lifecycle,nonRegistry,robots:await fs.readFile('dist/robots.txt','utf8'),cname:await fs.readFile('dist/CNAME','utf8'),sitemap:await fs.readFile('dist/sitemap.xml','utf8'),originals,derivativesExactlyReproduced:derivatives.length,images,output,result:'PASS: no baseline implementation/evidence changes; exact approved build; local authentic derivatives'};
await fs.writeFile(out+'/static-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({result:report.result,protected:tree.length,files:output.length,pages:pages.length,derivatives:derivatives.length,lifecycle,nonRegistry}));
