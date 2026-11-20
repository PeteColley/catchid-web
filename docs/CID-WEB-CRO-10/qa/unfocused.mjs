import fs from 'node:fs/promises';import crypto from 'node:crypto';import sharp from 'sharp';
import {chromium} from '../../../../cro09-runtime/tools/node_modules/playwright/index.mjs';
const out='docs/CID-WEB-CRO-10/evidence/';const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const beforeCss=(await fs.readdir('../cro10-runtime/baseline-dist/_astro')).find(x=>x.endsWith('.css'));
const afterCss=(await fs.readdir('dist/_astro')).find(x=>x.endsWith('.css'));
try{for(const route of ['/','/fishing-journal-app/'])for(const width of [320,390,768,1440])for(const saved of [false,true]){
 const captures=[];const id=(route==='/'?'home':'journal')+'-'+width+'-'+(saved?'saved':'first');
 const c=await b.newContext({viewport:{width,height:width===1440?1000:width===768?1024:844},reducedMotion:'reduce'});
 await c.route('**/*',r=>/^http:\/\/127\.0\.0\.1:419[12]\//.test(r.request().url())?r.continue():r.abort());
 if(saved)await c.addInitScript(()=>localStorage.setItem('catchid.website.analytics','denied'));
 const p=await c.newPage();await p.goto('http://127.0.0.1:4191'+route);
 for(const port of [4192,4191]){
  const href='http://127.0.0.1:'+port+'/_astro/'+(port===4192?beforeCss:afterCss);
  await p.evaluate(href=>new Promise((resolve,reject)=>{const s=document.querySelector('link[rel="stylesheet"]');s.onload=()=>resolve();s.onerror=()=>reject(new Error('stylesheet failed'));s.href=href;}),href);
  await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
  const focus=await p.evaluate(()=>({active:document.activeElement.tagName,visible:document.querySelectorAll(':focus-visible').length}));
  const computed=await p.evaluate(()=>[...document.querySelectorAll('body,body *')].map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,class:e.getAttribute('class'),rect:[r.x+scrollX,r.y+scrollY,r.width,r.height],style:Object.fromEntries([...s].filter(k=>k!=='--focus-ring').map(k=>[k,s.getPropertyValue(k).replaceAll(/http:\/\/127\.0\.0\.1:419[12]/g,'LOCAL')]))};}));
  const bytes=await p.screenshot({fullPage:saved&&[390,1440].includes(width),animations:'disabled'});captures.push({bytes,focus,computed});
 }
 await c.close();
 const a=await sharp(captures[0].bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true}),d=await sharp(captures[1].bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let pixels=0,minX=Infinity,minY=Infinity,maxX=0,maxY=0;for(let i=0;i<a.data.length;i+=4)if(a.data[i]!==d.data[i]||a.data[i+1]!==d.data[i+1]||a.data[i+2]!==d.data[i+2]||a.data[i+3]!==d.data[i+3]){pixels++;const x=(i/4)%a.info.width,y=Math.floor((i/4)/a.info.width);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
 const identical=captures[0].bytes.equals(captures[1].bytes);if(pixels){await fs.writeFile(out+'mismatch-before-'+id+'.png',captures[0].bytes);await fs.writeFile(out+'mismatch-after-'+id+'.png',captures[1].bytes);}
 const computedDifferences=captures[0].computed.map((x,i)=>JSON.stringify(x)===JSON.stringify(captures[1].computed[i])?null:{index:i,tag:x.tag,class:x.class,geometryEqual:JSON.stringify(x.rect)===JSON.stringify(captures[1].computed[i].rect),properties:Object.keys(x.style).filter(k=>x.style[k]!==captures[1].computed[i].style[k])}).filter(Boolean);
 results.push({id,route,width,saved,focus:captures.map(x=>x.focus),computedNodes:captures[0].computed.length,computedDifferences,beforeSha256:hash(captures[0].bytes),afterSha256:hash(captures[1].bytes),identical,changedPixels:pixels,bounds:pixels?{minX,minY,maxX,maxY}:null});
 }}finally{await b.close();}
await fs.writeFile(out+'unfocused-final.json',JSON.stringify({utc:new Date().toISOString(),method:'Same loaded browser DOM and image bitmap; actual baseline built CSS then actual candidate built CSS, decoded images/fonts and two settled frames. Non-style HTML equality independently proved in scope.json. Native PNG bytes and decoded RGBA pixels compared; no screenshot editing.',beforeCss,afterCss,results},null,2)+'\n');console.log(JSON.stringify({cases:results.length,identical:results.filter(x=>x.identical).length,failures:results.filter(x=>x.changedPixels)},null,2));if(results.some(x=>x.changedPixels))process.exitCode=1;
