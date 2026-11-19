// CRO-07A capture/evidence validation only. No device, network, application or image writes.
// Run from the website review checkout: node docs/CID-WEB-CRO-07/verify-recovery.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const area=import.meta.dirname,repo=path.resolve(area,'../..'),workspace=path.resolve(repo,'..');
const reference=path.join(workspace,'cid-web-cro-06'),android=path.join(workspace,'cid-cro07-android-source');
const evidence=path.join(area,'evidence/recovery-07a');
const start='b900647065944f7751514a44adf2ad70607d4c4c',baseline='8d0731f361b94a81523bfe07f528b7fdb365ccb4';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(dir,...args)=>execFileSync('git',['-C',dir,...args],{encoding:'utf8',windowsHide:true}).trim();
const lines=s=>s?s.split(/\r?\n/):[];
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
assert.equal(git(repo,'branch','--show-current'),'codex/cid-web-cro-07-product-captures');
assert.equal(git(reference,'rev-parse','HEAD'),baseline);assert.equal(git(reference,'status','--porcelain'),'');
const allChanged=[...lines(git(repo,'diff',baseline,'--name-only')),...lines(git(repo,'ls-files','--others','--exclude-standard'))];
for(const p of allChanged)assert(p==='PROJECT_STATUS.md'||p.startsWith('docs/CID-WEB-CRO-07/'),`Out of scope: ${p}`);
const protectedFiles=lines(git(repo,'ls-tree','-r','--name-only',baseline)).filter(p=>p!=='PROJECT_STATUS.md');
for(const p of protectedFiles)assert.equal(hash(fs.readFileSync(path.join(repo,p))),hash(fs.readFileSync(path.join(reference,p))),`Baseline bytes changed: ${p}`);
const oldEvidence=lines(git(repo,'ls-tree','-r','--name-only',start,'docs/CID-WEB-CRO-07/evidence'));
assert.equal(git(repo,'diff',start,'--name-only','--',...oldEvidence,'docs/CID-WEB-CRO-07/verify-review.mjs'),'','Initial-attempt evidence changed');
assert.equal(git(android,'rev-parse','HEAD'),'9e9b37e9dfdc2554321602bfbada2e18227d34e7');assert.equal(git(android,'status','--porcelain'),'');
const apkHash=hash(fs.readFileSync(path.join(android,'app/build/outputs/apk/debug/app-debug.apk')));
assert.equal(apkHash,'94248cacfef23ef021dd75c4ffe38879ea5310ade42852227215ce62ddc4d3ac');
const preserved=readJson(path.join(area,'evidence/preserved-unrelated-files.json'));
for(const p of preserved)assert.equal(hash(fs.readFileSync(path.join(workspace,'cid-free-02a',p.path))),p.sha256,`Unrelated change: ${p.path}`);
const require=createRequire(path.join(reference,'package.json')),sharp=require('sharp');
const captures=readJson(path.join(evidence,'captures.json'));
assert.equal(captures.length,3);assert.equal(fs.readdirSync(path.join(area,'captures')).length,3);
for(const r of captures){
 const bytes=fs.readFileSync(path.join(area,r.path));assert.equal(hash(bytes),r.sha256);assert.equal(bytes.length,r.bytes);assert.equal(r.apkSha256,apkHash);assert.equal(r.sampleData,true);assert.equal(r.acceptedForPublication,false);
 const m=await sharp(bytes,{failOn:'error'}).metadata();const decoded=await sharp(bytes,{failOn:'error'}).raw().toBuffer({resolveWithObject:true});
 assert.equal(m.format,'png');assert.equal(m.width,1080);assert.equal(m.height,2340);assert.equal(decoded.info.width,r.width);assert.equal(decoded.info.height,r.height);
}
const checkUi=(file,texts,noEdit=false)=>{const xml=fs.readFileSync(path.join(evidence,file),'utf8');assert(xml.includes('package="com.catchid.app"'));for(const text of texts)assert(xml.includes(text),`${file}: missing ${text}`);if(noEdit)assert(!xml.includes('android.widget.EditText'));};
checkUi('upper-form-ui.xml',['Save catch','Brown Trout','Nov 18, 2026','9:20 AM','Riverside','No photo recorded']);
checkUi('lower-form-before-final-scroll-ui.xml',['Save catch','0.75','34','Dry fly in a shallow run.','Cancel']);
checkUi('reopened-details-ui.xml',['Catch details','Brown Trout','User entered','Riverside','Dry fly','0.75 kg','34 cm','Dry fly in a shallow run.','Edit catch','No photo recorded'],true);
const pre=readJson(path.join(evidence,'preinstall-gate.json')),post=readJson(path.join(evidence,'postcapture-gate.json')),shutdown=readJson(path.join(evidence,'shutdown-verified.json'));
for(const gate of [pre,post]){assert.equal(gate.airplane,'1');assert.equal(gate.mobileData,'0');assert(gate.network.includes('none'));assert(gate.wifi.startsWith('Wifi is disabled'));assert.deepEqual(gate.accounts.map(s=>s.trim()),['Accounts: 0']);assert.equal(gate.healthEvents,'');}
assert.equal(pre.catchid,'');assert.equal(pre.thirdPartyPackages,'');assert.equal(post.thirdPartyPackages,'package:com.catchid.app');assert.equal(post.adDiagnostics,'');assert.equal(post.runtimeErrors,'');assert.equal(post.sampleRecords,1);assert.equal(shutdown.serialAbsent,true);assert.deepEqual(shutdown.taskProcesses,[]);
let links=0;
for(const name of fs.readdirSync(area).filter(n=>/\.(md|html)$/.test(n))){const body=fs.readFileSync(path.join(area,name),'utf8');const hrefs=name.endsWith('.html')?[...body.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]):[...body.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);for(const href of hrefs){if(/^(?:https?:|#)/.test(href))continue;const p=path.resolve(area,href.split('#')[0]);if(p!==path.join(evidence,'verification.json'))assert(fs.existsSync(p),`Missing ${name}: ${href}`);links++;}if(name.endsWith('.html')){assert(!/<script\b/i.test(body));assert(!/(?:src|href)="https?:/i.test(body));}}
const result={at:new Date().toISOString(),start,baseline,scopePassed:true,protectedBaselineFilesUnchanged:protectedFiles.length,priorEvidenceFilesUnchanged:oldEvidence.length,priorVerificationScriptUnchanged:true,androidSourceUnchanged:true,apkHashMatched:true,rebuild:false,unrelatedFileHashesMatched:preserved.length,originalPngs:3,dimensions:'1080x2340',allPngsFullyDecoded:true,allCaptureHashesMatch:true,uiHierarchyChecksPassed:true,visualReview:'Self-review recorded separately; natural scroll boundaries disclosed',offlineGatesPassed:true,noAnrCrashOrAdRequestDiagnostics:true,emulatorStopped:true,localLinksChecked:links,galleryNoScriptsOrExternalResources:true,sharpVersion:sharp.versions.sharp};
fs.writeFileSync(path.join(evidence,'verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
