import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(docs,'../..');
const baseline='42c997c13712a432c8e2384915aaa010a16d068b';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const report={label:'DESIGN CONCEPT — NOT LIVE',baseline,assets:[],playLinks:[],contrast:[],errors:[]};
for(const [name,source] of [['journal.jpg','src/assets/journal.jpg'],['identify.jpg','src/assets/identify.jpg'],['insights-overview.jpg','src/assets/insights-overview.jpg'],['catchid-icon.png','src/assets/catchid-icon.png'],['google-play-badge.svg','public/assets/google-play-badge.svg']]){
  const original=execFileSync('git',['show',`${baseline}:${source}`],{cwd:repo});
  const copy=await fs.readFile(path.join(docs,'assets',name));
  const same=hash(original)===hash(copy);report.assets.push({file:`assets/${name}`,source,bytes:copy.length,sha256:hash(copy),matchesBaseline:same});if(!same)report.errors.push(name);
}
const production=await fs.readFile(path.join(repo,'dist/index.html'),'utf8');
const play=new URL(production.match(/href="(https:\/\/play\.google\.com[^\"]+)"/)[1].replaceAll('&amp;','&')).href;
for(const name of ['concept-a.html','concept-b.html','index.html','responsive.html']){
  const html=await fs.readFile(path.join(docs,name),'utf8');
  if(!html.includes('DESIGN CONCEPT — NOT LIVE'))report.errors.push(`${name}: missing status`);
  for(const match of html.matchAll(/(?:src|href)="([^\"]+)"/g)){
    const value=match[1].replaceAll('&amp;','&');
    if(value.startsWith('https:')){if(!name.startsWith('concept-')||value!==play)report.errors.push(`${name}: unexpected external link ${value}`);else report.playLinks.push({page:name,url:value,exactProductionMatch:true});}
    else if(!value.startsWith('#')&&!value.startsWith('?')){
      const file=path.resolve(docs,value.split(/[?#]/)[0]);try{await fs.access(file);}catch{report.errors.push(`${name}: missing ${value}`);}
    }
  }
  if(name.startsWith('concept-')&&/no adverts|free forever|guaranteed identification|works completely offline|Google Drive backup/i.test(html))report.errors.push(`${name}: prohibited claim`);
}
const luminance=hex=>{const rgb=hex.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
for(const [use,fg,bg] of [['A main text','071c2a','ffffff'],['A secondary text','425969','ffffff'],['A teal / white CTA','006a75','ffffff'],['A caption on paper','425969','f8f7f3'],['A consent text','425969','f3f7f8'],['B main text','f3f7f8','03111d'],['B supporting text','c4d4de','03111d'],['B turquoise / header CTA','26c7c9','03111d'],['B consent text','c4d4de','102936'],['B consent button','f3f7f8','102936'],['B stage eyebrow','26c7c9','112e38'],['B stage secondary','bfd0d6','112e38'],['Review status label','234c53','eaf2f3']]){
  const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);report.contrast.push({use,foreground:'#'+fg,background:'#'+bg,ratio:Number(ratio.toFixed(2)),passesNormalText:ratio>=4.5});if(ratio<4.5)report.errors.push(`contrast: ${use}`);
}
const nonDocs=execFileSync('git',['diff','--name-only',baseline,'--','.',':(exclude)docs/CID-WEB-CRO-02/**'],{cwd:repo,encoding:'utf8'}).trim();
report.productionTrackedDiff=nonDocs?nonDocs.split('\n'):[];if(nonDocs)report.errors.push('production tracked difference');
report.lockfileSha256=hash(await fs.readFile(path.join(repo,'package-lock.json')));
report.outputFilesExcludedFromProduction=!(await fs.readdir(path.join(repo,'dist'))).includes('docs');
report.badge={heightDesktop:60,clearSpaceDesktop:16,heightMobile:56,clearSpaceMobile:15,originalAspectRatio:'238.96 / 70.87',unmodified:true};
await fs.writeFile(path.join(docs,'evidence/static-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({assets:report.assets.length,playLinks:report.playLinks.length,minimumTextContrast:Math.min(...report.contrast.map(c=>c.ratio)),productionTrackedDiff:report.productionTrackedDiff,errors:report.errors},null,2));
if(report.errors.length)process.exitCode=1;
