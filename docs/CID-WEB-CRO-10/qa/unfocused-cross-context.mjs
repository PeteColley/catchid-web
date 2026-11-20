import fs from 'node:fs/promises';import crypto from 'node:crypto';import sharp from 'sharp';
import {chromium} from '../../../../cro09-runtime/tools/node_modules/playwright/index.mjs';
const out='docs/CID-WEB-CRO-10/evidence/';const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
try{for(const route of ['/','/fishing-journal-app/'])for(const width of [320,390,768,1440])for(const saved of [false,true]){
 const captures=[];const id=(route==='/'?'home':'journal')+'-'+width+'-'+(saved?'saved':'first');
 for(const port of [4192,4191]){
  const origin='http://127.0.0.1:'+port;const c=await b.newContext({viewport:{width,height:width===1440?1000:width===768?1024:844},reducedMotion:'reduce'});
  await c.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());
  if(saved)await c.addInitScript(()=>localStorage.setItem('catchid.website.analytics','denied'));
  const p=await c.newPage();await p.goto(origin+route);await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
  const focus=await p.evaluate(()=>({active:document.activeElement.tagName,visible:document.querySelectorAll(':focus-visible').length}));
  const bytes=await p.screenshot({fullPage:saved&&[390,1440].includes(width),animations:'disabled'});captures.push({bytes,focus});await c.close();
 }
 const a=await sharp(captures[0].bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true}),d=await sharp(captures[1].bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let pixels=0,minX=Infinity,minY=Infinity,maxX=0,maxY=0;for(let i=0;i<a.data.length;i+=4)if(a.data[i]!==d.data[i]||a.data[i+1]!==d.data[i+1]||a.data[i+2]!==d.data[i+2]||a.data[i+3]!==d.data[i+3]){pixels++;const x=(i/4)%a.info.width,y=Math.floor((i/4)/a.info.width);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
 const identical=captures[0].bytes.equals(captures[1].bytes);if(pixels){await fs.writeFile(out+'mismatch-before-'+id+'.png',captures[0].bytes);await fs.writeFile(out+'mismatch-after-'+id+'.png',captures[1].bytes);}
 results.push({id,route,width,saved,focus:captures.map(x=>x.focus),beforeSha256:hash(captures[0].bytes),afterSha256:hash(captures[1].bytes),identical,changedPixels:pixels,bounds:pixels?{minX,minY,maxX,maxY}:null});
 }}finally{await b.close();}
await fs.writeFile(out+'unfocused-final.json',JSON.stringify({utc:new Date().toISOString(),method:'Sequential isolated Chrome contexts, decoded images/fonts plus two settled animation frames; native-size PNG bytes and decoded RGBA pixel comparison.',results},null,2)+'\n');console.log(JSON.stringify({cases:results.length,identical:results.filter(x=>x.identical).length,failures:results.filter(x=>x.changedPixels)},null,2));if(results.some(x=>x.changedPixels))process.exitCode=1;
