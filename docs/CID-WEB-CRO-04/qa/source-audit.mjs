import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const baseline='42c997c13712a432c8e2384915aaa010a16d068b';
const approved='9c7b0847061a460aa095150a6e2dd1972ba7a436';
const docs=path.resolve('docs/CID-WEB-CRO-04');
const hash=b=>createHash('sha256').update(b).digest('hex');
const files=execFileSync('git',['ls-tree','-r','--name-only',baseline],{encoding:'utf8'}).trim().split('\n');
const protectedPaths=files.filter(p=>p.startsWith('src/assets/')||p.startsWith('public/')||p.startsWith('.github/')||['package.json','package-lock.json','astro.config.mjs','tsconfig.json','src/config.ts','scripts/verify-analytics.mjs','src/pages/robots.txt.ts','src/pages/sitemap.xml.ts'].includes(p));
const checks=[],failures=[];
for(const file of protectedPaths){
 const before=execFileSync('git',['show',baseline+':'+file],{maxBuffer:20e6});
 const current=await fs.readFile(file);
 const binary=/\.(?:png|jpe?g|webp|ico)$/i.test(file);
 const normalized=binary?current:Buffer.from(current.toString().replace(/\r\n/g,'\n'));
 const unchanged=before.equals(normalized);
 checks.push({file,unchanged,sha256:hash(current)});
 if(!unchanged)failures.push(file);
}
const script=text=>text.replace(/\r\n/g,'\n').match(/<script\b[^>]*>([\s\S]*?)<\/script>/)[1].trim();
const consent=script(await fs.readFile('src/components/WebAnalyticsConsent.astro','utf8'));
const originalConsent=script(execFileSync('git',['show',baseline+':src/components/WebAnalyticsConsent.astro'],{encoding:'utf8'}));
if(consent!==originalConsent)failures.push('Production consent script');
const concept=await fs.readFile('src/assets/review-only/trout-concept-reference.png');
const originalConcept=execFileSync('git',['show',approved+':docs/CID-WEB-CRO-03/reference/CatchID_JournalFirst_Hero_Desktop_Reference.png'],{maxBuffer:10e6});
if(!concept.equals(originalConcept))failures.push('Concept source changed');
const references=[];
await fs.mkdir(path.join(docs,'reference'),{recursive:true});
for(const route of ['home','fishing-journal-app'])for(const width of ['390x844','1440x1000'])for(const suffix of ['first','saved-full']){
 const name=`matrix-${route}-${width}-${suffix}.png`;
 const original=execFileSync('git',['show',approved+':docs/CID-WEB-CRO-03/evidence/cro03b/'+name],{maxBuffer:10e6});
 await fs.writeFile(path.join(docs,'reference',name),original);
 references.push({file:name,sourceCommit:approved,sha256:hash(original)});
}
const pairs=[['navy text on warm paper','071c2a','eeeae0'],['white on navy','fffdf8','071c2a'],['teal on sage','006c70','d5e2d7'],['muted on paper','4c6062','f7f4ed'],['white on consent','fffdf8','102d39'],['white on choices','fffdf8','173c48']];
const luminance=hex=>{const v=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2]};
const contrast=pairs.map(([name,a,b])=>{const x=luminance(a),y=luminance(b),ratio=(Math.max(x,y)+.05)/(Math.min(x,y)+.05);if(ratio<4.5)failures.push(name+' contrast');return{name,ratio:+ratio.toFixed(2)}});
const report={baseline,approved,checks,consentScriptUnchanged:consent===originalConsent,consentSha256:hash(consent),conceptSourceSha256:hash(concept),references,contrast,failures};
await fs.writeFile(path.join(docs,'evidence/source-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({protectedFiles:checks.length,consentScriptUnchanged:report.consentScriptUnchanged,referenceCaptures:references.length,failures},null,2));
if(failures.length)process.exitCode=1;
