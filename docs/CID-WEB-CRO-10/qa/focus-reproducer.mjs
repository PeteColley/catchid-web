// CRO-09 reproducer: identical assertions, parameterised local URL/evidence output only.
const origin=process.env.BASELINE==='1'?'http://127.0.0.1:4192':'http://127.0.0.1:4191';
const stage=process.env.BASELINE==='1'?'before':'after';
import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(path.resolve('../cro09-runtime/tools/node_modules/playwright/index.mjs')));
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),c=await b.newContext({viewport:{width:900,height:800},reducedMotion:'reduce'}),p=await c.newPage(),result=[];
await c.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());
await p.goto(origin+'/');await p.locator('#analytics-reject').click();await p.keyboard.press('Tab');
for(const [name,selector] of [['journal-link','.journal-section .text-link'],['faq','.questions summary']]){
 const target=p.locator(selector).first();await target.focus();await target.scrollIntoViewIfNeeded();const v=await target.evaluate(e=>{const s=getComputedStyle(e),ancestors=[];for(let a=e;a;a=a.parentElement){const x=getComputedStyle(a);if(x.backgroundColor!=='rgba(0, 0, 0, 0)')ancestors.push({tag:a.tagName,class:a.className,color:x.backgroundColor});}return {label:e.textContent.trim(),focusVisible:e.matches(':focus-visible'),outline:s.outline,offset:s.outlineOffset,backgrounds:ancestors};});
 const nums=s=>s.match(/[\d.]+/g).slice(0,3).map(Number),lum=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);const fg=lum(nums(v.outline)),bg=lum(nums(v.backgrounds[0].color));v.contrast=(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);v.required=3;v.pass=v.contrast>=3;result.push(v);await p.screenshot({path:'docs/CID-WEB-CRO-10/evidence/reproducer-'+stage+'-focus-'+name+'.png'});
}
await fs.writeFile('docs/CID-WEB-CRO-10/evidence/reproducer-'+stage+'.json',JSON.stringify({utc:new Date().toISOString(),engine:b.version(),method:'Actual computed author focus styling; keyboard modality then focused representative controls; no source edits',result},null,2)+'\n');console.log(JSON.stringify(result));await b.close();if(result.some(r=>!r.pass))process.exitCode=1;
