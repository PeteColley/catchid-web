// Review-only verification. No application edits, network, image writes or deployment.
// Usage: node docs/CID-WEB-CRO-07/verify-review.mjs ../cid-web-cro-06 ../cid-cro07-android-source
// First argument is the unchanged baseline checkout with its existing locked Sharp installation.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const area=import.meta.dirname, repo=path.resolve(area,'../..');
const reference=path.resolve(repo,process.argv[2] || '../cid-web-cro-06');
const android=path.resolve(repo,process.argv[3] || '../cid-cro07-android-source');
const baseline='8d0731f361b94a81523bfe07f528b7fdb365ccb4';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(dir,...args)=>execFileSync('git',['-C',dir,...args],{encoding:'utf8',windowsHide:true}).trim();
const lines=s=>s?s.split(/\r?\n/):[];
assert.equal(git(reference,'rev-parse','HEAD'),baseline,'Baseline checkout has moved');
assert.equal(git(reference,'status','--porcelain'),'','Baseline checkout is dirty');
const changed=lines(git(repo,'diff',baseline,'--name-only'));
const untracked=lines(git(repo,'ls-files','--others','--exclude-standard'));
for(const name of [...changed,...untracked])assert(name==='PROJECT_STATUS.md'||name.startsWith('docs/CID-WEB-CRO-07/'),`Out of scope: ${name}`);
const protectedFiles=lines(git(repo,'ls-tree','-r','--name-only',baseline)).filter(p=>p!=='PROJECT_STATUS.md');
const checkoutLineEndingDifferences=[];
for(const p of protectedFiles){
 const a=fs.readFileSync(path.join(repo,p)), b=fs.readFileSync(path.join(reference,p));
 if(hash(a)===hash(b))continue;
 assert(Buffer.from(a.toString('utf8')).equals(a)&&Buffer.from(b.toString('utf8')).equals(b),`Non-text baseline bytes changed: ${p}`);
 assert.equal(a.toString('utf8').replaceAll('\r\n','\n'),b.toString('utf8').replaceAll('\r\n','\n'),`Baseline content changed: ${p}`);
 checkoutLineEndingDifferences.push(p);
}
assert.equal(git(android,'rev-parse','HEAD'),'9e9b37e9dfdc2554321602bfbada2e18227d34e7');
assert.equal(git(android,'status','--porcelain'),'','Android tracked/untracked changes');
const preserved=JSON.parse(fs.readFileSync(path.join(area,'evidence/preserved-unrelated-files.json')));
for(const item of preserved)assert.equal(hash(fs.readFileSync(path.resolve(repo,'../cid-free-02a',item.path))),item.sha256,`Unrelated file changed: ${item.path}`);
const require=createRequire(path.join(reference,'package.json'));
const sharp=require('sharp');
const sources=['home-1.2.12.png','journal.jpg','personal-records.jpg','insights-overview.jpg','identify.jpg'].map(name=>({path:'src/assets/'+name,role:'existing historical product source'}));
sources.push({path:'docs/CID-WEB-CRO-07/evidence/emulator-anr-diagnostic-not-product.png',role:'diagnostic only; NOT a CatchID product capture'});
const assets=[];
for(const item of sources){
 const file=path.join(repo,item.path), bytes=fs.readFileSync(file);
 const metadata=await sharp(bytes,{failOn:'error'}).metadata();
 const {info}=await sharp(bytes,{failOn:'error'}).raw().toBuffer({resolveWithObject:true});
 assert.equal(info.width,metadata.width);assert.equal(info.height,metadata.height);
 assets.push({...item,bytes:bytes.length,sha256:hash(bytes),width:info.width,height:info.height,format:metadata.format,decoded:true,pixelsWritten:false});
}
assert.equal(assets.at(-1).width,1170);assert.equal(assets.at(-1).height,2532);
assert(!fs.existsSync(path.join(area,'captures')),'Unexpected product-capture directory: review claims must be revised');
fs.writeFileSync(path.join(area,'evidence/asset-verification.json'),JSON.stringify(assets,null,2)+'\n');
const linkResults=[];
for(const name of fs.readdirSync(area).filter(n=>/\.(md|html)$/.test(n))){
 const body=fs.readFileSync(path.join(area,name),'utf8');
 const links=name.endsWith('.html')?[...body.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]):[...body.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
 for(const href of links){if(/^(?:https?:|#)/.test(href))continue;const target=path.resolve(area,href.split('#')[0]);if(target!==path.join(area,'evidence/review-verification.json'))assert(fs.existsSync(target),`Missing local link ${name}: ${href}`);linkResults.push({file:name,href});}
 if(name.endsWith('.html')){assert(!/<script\b/i.test(body));assert(!/(?:src|href)="https?:/i.test(body));}
}
const result={at:new Date().toISOString(),baseline,protectedBaselineFiles:protectedFiles.length,allProtectedGitContentUnchanged:true,checkoutLineEndingDifferences,allProductImageBytesEqual:true,consentBytesEqual:hash(fs.readFileSync(path.join(repo,'src/components/WebAnalyticsConsent.astro')))===hash(fs.readFileSync(path.join(reference,'src/components/WebAnalyticsConsent.astro'))),androidSourceUnchanged:true,unrelatedFilesPreserved:preserved.length,scopePassed:true,decodedImages:assets.length,newProductCaptures:0,diagnosticPngs:1,localLinksChecked:linkResults.length,noGalleryScriptsOrExternalResources:true,sharpVersion:sharp.versions.sharp};
fs.writeFileSync(path.join(area,'evidence/review-verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
