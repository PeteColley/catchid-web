import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),repo=path.resolve(docs,'../..');
const errors=[],checks=[],assets=[];
const hash=b=>createHash('sha256').update(b).digest('hex');
const names=['catchid-icon.png','journal.jpg','identify.jpg','insights-overview.jpg','personal-records.jpg','fishing-locations.jpg','home-1.2.12.png','google-play-badge.svg'];
for(const name of names){const file=path.join(docs,'assets',name),source=path.join(repo,name.endsWith('.svg')?'public/assets':'src/assets',name);const a=await fs.readFile(file),b=await fs.readFile(source);assets.push({name,bytes:a.length,sha256:hash(a),matchesOriginal:hash(a)===hash(b)});if(hash(a)!==hash(b))errors.push('Changed original '+name)}
for(const route of ['home.html','fishing-journal-app.html']){
 const html=await fs.readFile(path.join(docs,route),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)errors.push(route+' duplicate id');
 if((html.match(/<main\b/g)||[]).length!==1)errors.push(route+' main landmarks');
 if(/No adverts|No Ads|Free forever|Private by default|G-LPX|catchid\.website\.analytics/i.test(html))errors.push(route+' disallowed copy/runtime');
 for(const [,ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(/^(https?:|mailto:|\/\/)/.test(ref))errors.push(route+' external resource '+ref);else if(ref.startsWith('#')){if(!ids.includes(ref.slice(1)))errors.push(route+' missing anchor '+ref)}else{try{await fs.access(path.join(docs,ref.split(/[?#]/)[0]))}catch{errors.push(route+' missing '+ref)}}}
 checks.push(route+': one main, unique ids, all local links/assets exist, no outbound href/src, no live consent keys, no forbidden claims');
}
const js=await fs.readFile(path.join(docs,'design.js'),'utf8');
if(/localStorage|sessionStorage|document\.cookie|fetch\(|XMLHttpRequest|sendBeacon|gtag|G-LPX/.test(js))errors.push('Persistent or network runtime');
const luminance=hex=>{const rgb=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
const pairs=[['ink on paper','071c2a','f7f4ed'],['teal on paper','006c70','f7f4ed'],['teal on pale','006c70','deece7'],['muted on paper','4c6062','f7f4ed'],['muted on sage','4c6062','e3e9df'],['white on navy','fffdf8','071c2a'],['mint on navy','70ded2','071c2a'],['quiet on navy','bdd2d3','071c2a'],['caption on navy','c4d4d6','071c2a'],['teal on landing panel','006c70','d5e2d7'],['white on maximum mobile photo composite','fffdf8','51606a'],['dim caption on maximum mobile photo composite','dce0dc','51606a']];
const contrast=pairs.map(([name,fg,bg])=>{const a=luminance(fg),b=luminance(bg);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(ratio<4.5)errors.push('Contrast '+name);return {name,foreground:'#'+fg,background:'#'+bg,ratio:Math.round(ratio*100)/100,pass:ratio>=4.5}});
// Independent byte comparison of every tracked baseline path (including config and workflow).
const paths=execFileSync('git',['ls-tree','-r','--name-only','42c997c13712a432c8e2384915aaa010a16d068b'],{cwd:repo,encoding:'utf8'}).trim().split('\n');
let equal=0;const baselineBytes=[];for(const name of paths){const original=execFileSync('git',['show',`42c997c13712a432c8e2384915aaa010a16d068b:${name}`],{cwd:repo,maxBuffer:20e6});const current=await fs.readFile(path.join(repo,name));const normalised=name.match(/\.(png|jpg|webp|ico)$/)?current:Buffer.from(current.toString().replace(/\r\n/g,'\n'));if(!original.equals(normalised))errors.push('Baseline drift '+name);else equal++;const mainCopy=await fs.readFile(path.resolve(repo,'../catchid-web',name));baselineBytes.push({path:name,sha256:hash(current),mainWorktreeSha256:hash(mainCopy),identical:current.equals(mainCopy)});if(!current.equals(mainCopy)&&current.toString().replace(/\r\n/g,'\n')!==mainCopy.toString().replace(/\r\n/g,'\n'))errors.push('Worktree byte difference '+name)}
await fs.writeFile(path.join(docs,'evidence/baseline-byte-manifest.json'),JSON.stringify(baselineBytes,null,2)+'\n');
const report={label:'DESIGN CONCEPT — NOT LIVE',checks,assets,contrast,baselinePathsCompared:paths.length,equalBaselinePaths:equal,normalization:'Text CRLF normalized only for Git blob comparison. Production worktree byte hashes separately recorded in baseline manifest.',errors};
await fs.writeFile(path.join(docs,'evidence/static-verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({checks,contrast,baselinePathsCompared:paths.length,errors},null,2));if(errors.length)process.exitCode=1;
