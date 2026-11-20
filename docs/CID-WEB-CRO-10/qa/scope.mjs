import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const baseline='68661d45ab5795d3b904b058d4ad71a9f04ad96d',out='docs/CID-WEB-CRO-10/evidence/';
const git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim();
const files=git('ls-tree','-r','--name-only',baseline).split('\n'),changed=git('diff','--name-only',baseline).split('\n').filter(Boolean);
const nonCssSource=files.filter(p=>/^(src|public|scripts|\.github)\//.test(p)&&p!=='src/styles/global.css').map(p=>({path:p,workingBytesEqualBaseline:fs.readFileSync(p).equals(fs.readFileSync(path.join('../cid-web-cro-09',p)))}));
const built=['index.html','fishing-journal-app/index.html'].map(p=>{
 const a=fs.readFileSync(path.join('../cro10-runtime/baseline-dist',p),'utf8'),b=fs.readFileSync(path.join('dist',p),'utf8');
 const strip=s=>s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'').replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,'');
 return {page:p,allNonStyleHTMLBytesEqual:strip(a)===strip(b),scriptCount:(b.match(/<script\b/g)||[]).length};
});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const generated=walk('dist').map(p=>{const old=p.replace(/^dist/,'../cro10-runtime/baseline-dist');return {path:p.replaceAll('\\','/'),bytes:fs.statSync(p).size,sha256:sha(fs.readFileSync(p)),baselineEqual:fs.existsSync(old)&&fs.readFileSync(p).equals(fs.readFileSync(old))};});
const result={utc:new Date().toISOString(),baseline,changedTrackedFiles:changed,productionChangeOnlyCSS:changed.filter(p=>p!=='PROJECT_STATUS.md'&&!p.startsWith('docs/')).join(',')==='src/styles/global.css',nonCssSource,built,generated,packageLockUnchanged:git('diff','--name-only',baseline,'--','package.json','package-lock.json')===''};
fs.writeFileSync(out+'scope.json',JSON.stringify(result,null,2)+'\n');fs.writeFileSync(out+'focus-css.diff',execFileSync('git',['diff','--unified=0',baseline,'--','src/styles/global.css']));
console.log(JSON.stringify({sourceUnchanged:nonCssSource.filter(x=>x.workingBytesEqualBaseline).length,built,generated:generated.length,unchangedGenerated:generated.filter(x=>x.baselineEqual).length,changedOutput:generated.filter(x=>!x.baselineEqual).map(x=>x.path),packageLockUnchanged:result.packageLockUnchanged},null,2));
if(!result.productionChangeOnlyCSS||!result.packageLockUnchanged||nonCssSource.some(x=>!x.workingBytesEqualBaseline)||built.some(x=>!x.allNonStyleHTMLBytesEqual))process.exitCode=1;
