import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
const runtime=path.resolve('../cro09-runtime');
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(runtime,'browsers');
const pw=await import(pathToFileURL(path.join(runtime,'tools/node_modules/playwright/index.mjs')));
const output=path.resolve('docs/CID-WEB-CRO-10/evidence');
const engine=process.argv[2]||'chromium';
const browser=await pw[engine].launch(engine==='chromium'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{});
const report={engine,version:browser.version(),utc:new Date().toISOString(),method:'Real Windows engine; keyboard modality plus programmatic focus inventory, complemented by separate sequential keyboard interactions; CSS viewport sizing is not physical-device testing.',focus:[],screenshots:[],unfocused:[],mouse:[],failures:[],errors:[],external:[]};
const check=(v,label)=>{if(!v)report.failures.push(label);};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function lum(rgb){return rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);}
function ratio(a,b){const x=lum(a.match(/[\d.]+/g).slice(0,3).map(Number)),y=lum(b.match(/[\d.]+/g).slice(0,3).map(Number));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
async function pageFor(route,width,{stage='after',saved=false,text=1}={}){
 const origin=stage==='before'?'http://127.0.0.1:4192':'http://127.0.0.1:4191';
 const context=await browser.newContext({viewport:{width,height:width===1440?1000:width===768?1024:844},reducedMotion:'reduce'});
 await context.route('**/*',r=>{if(r.request().url().startsWith(origin+'/'))return r.continue();report.external.push(r.request().url());return r.abort();});
 if(saved)await context.addInitScript(()=>localStorage.setItem('catchid.website.analytics','denied'));
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url());});
 await page.goto(origin+route,{waitUntil:'load'});
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
 if(text!==1)await page.evaluate(f=>{const es=[...document.querySelectorAll('body,body *')].filter(e=>!e.closest('svg')),sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*f+'px');},text);
 return {page,context};
}
async function focus(page,locator){
 await locator.evaluate(e=>{
  const menu=document.querySelector('.mobile-menu');if(menu)menu.open=!!e.closest('.mobile-menu nav');
  if(!e.classList.contains('skip')&&!e.closest('.analytics-consent')&&!e.closest('.mobile-menu nav'))e.scrollIntoView({block:'center',behavior:'instant'});
 });
 await locator.focus();
 return locator.evaluate(e=>{
  const s=getComputedStyle(e),r=e.getBoundingClientRect(),reach=parseFloat(s.outlineWidth)+parseFloat(s.outlineOffset);
  let parent=e.classList.contains('skip')?document.querySelector('.hero-shell,.landing-top'):e.parentElement;
  const bg=[];for(let a=parent;a;a=a.parentElement){const b=getComputedStyle(a).backgroundColor;if(b!=='rgba(0, 0, 0, 0)'){bg.push({tag:a.tagName,class:a.className,color:b});break;}}
  const clips=[];for(let a=e.parentElement;a;a=a.parentElement){const st=getComputedStyle(a);if(['hidden','clip','auto','scroll'].includes(st.overflowX)||['hidden','clip','auto','scroll'].includes(st.overflowY)){const ar=a.getBoundingClientRect();if(r.x-reach<ar.x-.5||r.right+reach>ar.right+.5||r.y-reach<ar.y-.5||r.bottom+reach>ar.bottom+.5)clips.push({class:a.className,overflow:[st.overflowX,st.overflowY]});}}
  return {label:e.getAttribute('aria-label')||e.textContent.trim().slice(0,90),tag:e.tagName,id:e.id,class:e.className,focusVisible:e.matches(':focus-visible'),outline:s.outline,outlineColor:s.outlineColor,width:s.outlineWidth,offset:s.outlineOffset,bg,ring:{left:r.x-reach,right:r.right+reach,top:r.y-reach,bottom:r.bottom+reach},viewport:{width:innerWidth,height:innerHeight},ancestorClipping:clips,scrollWidth:document.documentElement.scrollWidth};
 });
}
try{
 for(const route of ['/','/fishing-journal-app/'])for(const width of [320,390,768,1440])for(const saved of [false,true])for(const text of [1,1.6]){
  const {page,context}=await pageFor(route,width,{saved,text});await page.keyboard.press('Tab');
  const count=await page.locator('a,button,summary,#analytics-title').count();
  for(let i=0;i<count;i++){
   const loc=page.locator('a,button,summary,#analytics-title').nth(i);
   const eligible=await loc.evaluate(e=>{if(e.closest('.mobile-menu nav'))return getComputedStyle(e.closest('.mobile-menu')).display!=='none';return !!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';});
   if(!eligible)continue;
   const value=await focus(page,loc);value.contrast=ratio(value.outlineColor,value.bg[0].color);value.required=3;
   value.pass=value.focusVisible&&value.width==='3px'&&value.contrast>=3;
   const id=route+' '+width+' '+saved+' '+text+' '+value.label;
   check(value.pass,id+' focus style/contrast');check(value.ring.left>=-.5&&value.ring.right<=width+.5,id+' horizontal ring clipping');check(value.ring.top>=-.5&&value.ring.bottom<=value.viewport.height+.5,id+' vertical ring clipping');check(value.ancestorClipping.length===0,id+' ancestor ring clipping');check(value.scrollWidth<=width,id+' overflow');
   report.focus.push({route,width,saved,text,...value});
  }
  await context.close();
 }
 // Pointer modality must not create the custom keyboard outline.
 for(const route of ['/','/fishing-journal-app/']){
  const {page,context}=await pageFor(route,390,{saved:true});await page.locator('.questions summary').first().click();
  const value=await page.locator('.questions summary').first().evaluate(e=>({visible:e.matches(':focus-visible'),outline:getComputedStyle(e).outlineStyle}));report.mouse.push({route,...value});check(!value.visible,route+' pointer-only focus');await context.close();
 }
 if(engine==='chromium'){
  const cases=[
   ['journal-sage','/',1440,'.journal-section .text-link',true],['faq-paper','/',1440,'.questions summary',true],
   ['header-dark','/',1440,'.site-header>nav a',true],['mobile-menu','/',390,'.mobile-menu nav a',false],
   ['header-photo-text160','/',768,'.site-header>nav a:nth-child(3)',true,1.6],
   ['hero-badge-desktop','/',1440,'.hero-copy .play-badge',true],
   ['consent-mobile','/',390,'#analytics-accept',false],['analytics-heading-mobile','/',390,'#analytics-title',false],
   ['hero-badge-mobile','/',390,'.hero-copy .play-badge',false],['skip-home','/',390,'.skip',false],
   ['landing-header','/fishing-journal-app/',1440,'.site-header>nav a',true],
   ['landing-menu','/fishing-journal-app/',390,'.mobile-menu nav a',false],
   ['landing-consent','/fishing-journal-app/',1440,'#analytics-reject',false],
   ['landing-analytics-heading','/fishing-journal-app/',1440,'#analytics-title',false],
   ['footer-choices','/',1440,'#analytics-choices',true]
  ];
  for(const [name,route,width,selector,saved,text=1] of cases)for(const stage of ['before','after']){
   const {page,context}=await pageFor(route,width,{stage,saved,text});await page.keyboard.press('Tab');const value=await focus(page,page.locator(selector).first());
   value.contrast=ratio(value.outlineColor,value.bg[0].color);
   const filename=stage+'-'+name+'.png';await page.screenshot({path:path.join(output,filename),animations:'disabled'});report.screenshots.push({name,stage,route,width,filename,...value});await context.close();
  }
  // Compare actual unfocused pixels; save the final full-page representative pairs once.
  for(const route of ['/','/fishing-journal-app/'])for(const width of [320,390,768,1440])for(const saved of [false,true]){
   const screenshots=[];
   for(const stage of ['before','after']){
    const {page,context}=await pageFor(route,width,{stage,saved});
    const full=saved&&[390,1440].includes(width);const bytes=await page.screenshot({fullPage:full,animations:'disabled'});screenshots.push(bytes);
    if(stage==='after'&&full)await fs.writeFile(path.join(output,`unfocused-${route==='/'?'home':'journal'}-${width}.png`),bytes);
    await context.close();
   }
   const identical=screenshots[0].equals(screenshots[1]);check(identical,route+' '+width+' '+saved+' unfocused pixels changed');report.unfocused.push({route,width,saved,beforeSha256:hash(screenshots[0]),afterSha256:hash(screenshots[1]),identical});
  }
 }
}catch(e){report.errors.push(e.stack);}finally{
 await fs.writeFile(path.join(output,'focus-'+engine+'.json'),JSON.stringify(report,null,2)+'\n');await browser.close();
 console.log(JSON.stringify({engine,version:report.version,measurements:report.focus.length,minimumContrast:Math.min(...report.focus.map(v=>v.contrast)),failures:report.failures,errors:report.errors,external:report.external,unfocused:report.unfocused.length},null,2));
 if(report.failures.length||report.errors.length||report.external.length)process.exitCode=1;
}
