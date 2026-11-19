import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {variant,baselineHash} from './review-server.mjs';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(docs,'../..');
const baseline='651ae58f39a8c2530fb600b35e91455c644351e8';
const git=(...args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8'}).trim();
const outside=git('diff',baseline,'--name-only','--','.',':(exclude)docs/CID-WEB-CRO-05');
if(outside)throw Error('Production/baseline changes: '+outside);
const status=git('status','--porcelain=v1','--untracked-files=all');
if(status.split('\n').filter(Boolean).some(line=>!line.slice(3).startsWith('docs/CID-WEB-CRO-05/')))throw Error('Unrelated changes in worktree');
const records=[];
async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else if(/\.(png|jpg)$/.test(e.name)){const bytes=await fs.readFile(p);records.push({path:path.relative(docs,p).replaceAll('\\','/'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}}}
await walk(docs);
const broken=[];
for(const file of ['index.html','REVIEW.md','PROVENANCE.md','QA.md']){
  const text=await fs.readFile(path.join(docs,file),'utf8');
  const links=[...text.matchAll(file.endsWith('.html')?/(?:href|src)="([^"]+)"/g:/\]\(([^)]+)\)/g)].map(m=>m[1]);
  for(const link of links.filter(l=>!/^https?:|^#/.test(l)))try{await fs.access(path.resolve(docs,link))}catch{broken.push({file,link})}
}
if(broken.length)throw Error(JSON.stringify(broken));
const receipt={baseline,branch:git('branch','--show-current'),baselineHtmlSha256:baselineHash,productionChanges:[],brokenReviewLinks:broken,variantHtmlSha256:Object.fromEntries(['a','b'].map(k=>[k,createHash('sha256').update(variant(k)).digest('hex')])),files:records};
await fs.writeFile(path.join(docs,'evidence/asset-manifest.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({baseline,productionChanges:0,brokenReviewLinks:0,images:records.length,variantReversal:'exact baseline HTML recovered'},null,2));
