import fs from 'node:fs/promises';
import {chromium} from '../../../../cro09-runtime/tools/node_modules/playwright/index.mjs';
import sharp from 'sharp';
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];const L=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const ratio=(a,c)=>(Math.max(L(a),L(c))+.05)/(Math.min(L(a),L(c))+.05);
try{
 for(const width of [320,390,768,1440])for(const text of [1,1.6]){
  const c=await b.newContext({viewport:{width,height:width===1440?1000:1024},reducedMotion:'reduce'});
  await c.addInitScript(()=>localStorage.setItem('catchid.website.analytics','denied'));
  await c.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:4191/')?r.continue():r.abort());
  const p=await c.newPage();await p.goto('http://127.0.0.1:4191/');
  await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
  if(text!==1)await p.evaluate(f=>{const es=[...document.querySelectorAll('body,body *')].filter(e=>!e.closest('svg')),sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*f+'px');},text);
  await p.keyboard.press('Tab');
  const selectors=width>760?['.site-header>nav a:nth-child(1)','.site-header>nav a:nth-child(2)','.site-header>nav a:nth-child(3)','.hero-copy .play-badge','.final-invite .play-badge']:['.hero-copy .play-badge','.final-invite .play-badge'];
  for(const selector of selectors){
   const loc=p.locator(selector);await loc.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await loc.focus();
   const fg=await loc.evaluate(e=>getComputedStyle(e).outlineColor.match(/[\d.]+/g).slice(0,3).map(Number));
   const visible=await p.screenshot();await loc.evaluate(e=>e.style.outlineColor='transparent');const backdrop=await p.screenshot();await loc.evaluate(e=>e.style.removeProperty('outline-color'));
   const a=await sharp(visible).ensureAlpha().raw().toBuffer(),d=await sharp(backdrop).ensureAlpha().raw().toBuffer();let minimum=Infinity,samples=0,worst=null;
   for(let i=0;i<a.length;i+=4){if(a[i]!==fg[0]||a[i+1]!==fg[1]||a[i+2]!==fg[2]||(a[i]===d[i]&&a[i+1]===d[i+1]&&a[i+2]===d[i+2]))continue;
    const bg=[d[i],d[i+1],d[i+2]],contrast=ratio(fg,bg);samples++;if(contrast<minimum){minimum=contrast;worst={x:(i/4)%width,y:Math.floor((i/4)/width),background:bg};}
   }
   results.push({width,text,selector,outlineRGB:fg,samples,minimumContrast:minimum,worst,pass:samples>0&&minimum>=3});
  }
  await c.close();
 }
}finally{await b.close();}
await fs.writeFile('docs/CID-WEB-CRO-10/evidence/painted-contrast.json',JSON.stringify({utc:new Date().toISOString(),method:'Actual rendered pixels beneath opaque straight portions of the focus outline, compared with the identical focused screenshot with only outline-color made transparent. Antialiased outline edge pixels excluded; no image editing or production-source changes.',results},null,2)+'\n');
console.log(JSON.stringify({cases:results.length,minimumContrast:Math.min(...results.map(x=>x.minimumContrast)),failures:results.filter(x=>!x.pass)},null,2));if(results.some(x=>!x.pass))process.exitCode=1;
