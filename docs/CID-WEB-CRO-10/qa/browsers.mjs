// CRO-09 regression assertions reused for the CRO-10 focus-only candidate.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),repo=path.resolve(docs,'../..');
const runtime=path.resolve(repo,'../cro09-runtime');
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(runtime,'browsers');
const {chromium,firefox,webkit}=await import(pathToFileURL(path.join(runtime,'tools/node_modules/playwright/index.mjs')));
const axe=await fs.readFile(path.join(runtime,'tools/node_modules/axe-core/axe.min.js'),'utf8');
const origin='http://127.0.0.1:4191',choice='catchid.website.analytics';
const engine=process.argv[2]||'firefox',mode=process.argv[3]||'matrix';
const output=path.join(docs,'evidence',engine);await fs.mkdir(output,{recursive:true});
const launch=engine==='chromium'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}:{headless:true};
const browser=await ({chromium,firefox,webkit}[engine]).launch(launch);
const report={utc:new Date().toISOString(),engine,version:browser.version(),mode,method:'Actual engine on Windows; CSS viewport emulation, not Safari or a physical phone',cases:[],failures:[],exceptions:[],consoleWarnings:[],limitations:[],external:[],analytics:[],axe:[]};
const check=(v,label)=>{if(!v)report.failures.push(label);};
async function pageAt(width,height,{saved=false,js=true,blocked=false}={}){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,javaScriptEnabled:js,reducedMotion:'reduce'});
 const requests=[];
 await context.route('**/*',async r=>{const u=r.request().url();requests.push(u);if(u.startsWith(origin+'/')||u.startsWith('data:'))return r.continue();
  if(u==='https://www.googletagmanager.com/gtag/js?id=G-LPXGL5VTB1'){
   const savedChoice=await r.request().frame().evaluate(key=>localStorage.getItem(key),choice).catch(()=>null);report.analytics.push({url:u,choice:savedChoice});check(savedChoice==='granted','Analytics requested without consent');return r.fulfill({status:200,contentType:'application/javascript',body:'/* inert audit loader */'});
  }report.external.push(u);return r.abort();});
 if(saved)await context.addInitScript(key=>localStorage.setItem(key,'denied'),choice);
 if(blocked)await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{value:{getItem(){throw Error('Audit storage blocked')},setItem(){throw Error('Audit storage blocked')},removeItem(){throw Error('Audit storage blocked')}}}));
 const page=await context.newPage();page.on('pageerror',e=>report.exceptions.push(e.message));page.on('console',m=>{if(m.type()==='error'){if(engine==='firefox'&&m.text().includes('Cookie “_ga” has been rejected for invalid domain.'))report.consoleWarnings.push(m.text());else report.exceptions.push(m.text());}});
 page.on('response',r=>{if(r.status()>=400)report.exceptions.push('HTTP '+r.status()+' '+r.url());});
 return {page,context,requests};
}
async function navigate(p,url){await p.goto(origin+url,{waitUntil:'load'});await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>{i.dataset.auditLoading=i.loading;i.loading='eager';return i.decode().catch(()=>{});}));});}
async function scale(p,factor){await p.evaluate(f=>{const nodes=[...document.querySelectorAll('body,body *')].filter(e=>!e.closest('svg'));const sizes=nodes.map(e=>parseFloat(getComputedStyle(e).fontSize));nodes.forEach((e,i)=>e.style.fontSize=sizes[i]*f+'px');},factor);}
async function geometry(p){return p.evaluate(()=>{
 const rect=e=>{if(!e||!e.getClientRects().length||e.hidden)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
 const controls=[...document.querySelectorAll('a,button,summary')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');
 return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,consent:rect(document.querySelector('#analytics-consent')),choices:[...document.querySelectorAll('.analytics-actions button')].map(rect).filter(Boolean),primary:rect(document.querySelector('[data-primary]')),badges:document.querySelectorAll('a.play-badge img[src="/assets/google-play-badge.svg"]').length,headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>({tag:e.tagName,text:e.textContent.trim()})),landmarks:[...document.querySelectorAll('header,main,nav,footer')].map(e=>({tag:e.tagName,label:e.getAttribute('aria-label')})),images:[...document.images].map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,alt:i.alt})),smallControls:controls.filter(e=>rect(e).height<44&&!e.closest('p')).map(e=>({text:e.textContent.trim(),rect:rect(e)})),clipped:[...document.querySelectorAll('body *')].filter(e=>!e.children.length&&e.textContent.trim()&&['hidden','clip'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2&&!e.classList.contains('sr-only')).map(e=>e.className),proof:[...document.querySelectorAll('.captured-screen')].map(e=>({rect:rect(e),caption:e.parentElement.querySelector('figcaption').textContent})),links:[...document.querySelectorAll('.play-link')].map(a=>a.href)};
 });}
async function screenshot(p,name,fullPage=false){await p.screenshot({path:path.join(output,name+'.png'),fullPage,animations:'disabled'});}
const routes=[['home','/'],['journal','/fishing-journal-app/']];
try{
 if(mode==='matrix'){
 for(const [route,url] of routes)for(const [w,h] of [[320,720],[390,844],[768,1024],[1440,1000]])for(const state of ['first','saved'])for(const text of [1,1.6]){
  const {page:p,context,requests}=await pageAt(w,h,{saved:state==='saved'});await navigate(p,url);if(text!==1)await scale(p,text);
  const id=`${route}-${w}-${state}-text${text}`,data=await geometry(p);
  check(data.scrollWidth<=w&&!data.clipped.length&&!data.smallControls.length&&data.images.every(i=>i.loaded),id+' layout/assets/targets');check(data.badges===2,id+' badge count');
  if(state==='first'){check(data.choices.length===2&&Math.abs(data.choices[0].width-data.choices[1].width)<1&&Math.abs(data.choices[0].height-data.choices[1].height)<1,id+' consent parity');if(w<=430&&text===1)check(data.primary.bottom<=data.consent.y+1,id+' primary badge above consent');}
  let shot=null;if((text===1&&state==='first'&&[320,390,768,1024,1440].includes(w))||(text===1.6&&state==='saved'&&[320,390,768].includes(w))){shot=id+'.png';await screenshot(p,id);}
  if(text===1&&state==='saved'&&[390,1440].includes(w)){await screenshot(p,id+'-full',true);if(route==='home')for(const section of ['record','journal'])await p.locator('#'+section).screenshot({path:path.join(output,section+'-'+w+'.png')});}
  if(text===1&&state==='first'&&[320,768,1440].includes(w)){
   await p.addScriptTag({content:axe});const a=await p.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}}));
   report.axe.push({id,passes:a.passes.map(v=>v.id),violations:a.violations,incomplete:a.incomplete});
  }
  report.cases.push({id,route,state,text,screenshot:shot,...data,requests});await context.close();
 }
 }
 if(mode==='interactions'){
 for(const [route,url] of routes)for(const w of [320,390,768,1024,1440]){
  const {page:p,context}=await pageAt(w,w===320?720:1000);await navigate(p,url);const id=route+'-'+w,focus=[];
  for(let i=0;i<(w<=760?(engine==='webkit'?1:3):5);i++){await p.keyboard.press('Tab');focus.push(await p.evaluate(()=>({label:document.activeElement.getAttribute('aria-label')||document.activeElement.textContent.trim(),outline:getComputedStyle(document.activeElement).outlineStyle})));}
  check(focus.every(e=>e.outline==='solid'),id+' visible keyboard focus');
  if(w<=760){await p.keyboard.press('Enter');check(await p.locator('.mobile-menu').getAttribute('open')!==null,id+' menu keyboard open');await p.keyboard.press('Tab');if(engine==='webkit'){report.limitations.push(id+': default Windows WebKit Tab/Alt+Tab skips anchors; programmatic link focus used to check Enter activation, not sequential link navigation');await p.locator('.mobile-menu a').first().focus();}check(await p.evaluate(()=>document.activeElement.textContent.trim()==='How it works'),id+' menu link focus');await p.keyboard.press('Enter');check(await p.locator('.mobile-menu').getAttribute('open')===null,id+' menu closes on navigation');}
  await p.locator('.questions details').first().locator('summary').focus();await p.keyboard.press('Enter');check(await p.locator('.questions details').first().getAttribute('open')!==null,id+' FAQ keyboard');
  check(await p.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'),id+' reduced motion');
  await p.locator('#analytics-reject').click();check(await p.evaluate(key=>localStorage.getItem(key)==='denied',choice),id+' rejection');
  await p.locator('#analytics-choices').click();check(await p.evaluate(()=>document.activeElement.id==='analytics-title'),id+' consent reopen focus');await p.locator('#analytics-reject').click();check(await p.evaluate(()=>document.activeElement.id==='analytics-choices'),id+' consent focus restored');
  report.cases.push({id,kind:'keyboard-navigation',focus});await context.close();
 }
 for(const [route,url] of routes){
  const {page:p,context}=await pageAt(390,844);await navigate(p,url+'?utm_source=qa&utm_medium=review&utm_campaign=fixture&gclid=fixture-id');
  const state=()=>p.evaluate(key=>({choice:localStorage.getItem(key),disabled:window['ga-disable-G-LPXGL5VTB1'],loaders:document.querySelectorAll('script[src*="googletagmanager"]').length,hidden:document.querySelector('#analytics-consent').hidden,cookies:document.cookie}),choice);
  const before=await state();check(before.choice===null&&before.disabled&&!before.loaders,route+' default no analytics');
  await p.evaluate(()=>document.addEventListener('click',e=>{if(e.target.closest('a.play-link'))e.preventDefault()},{capture:true}));
  await p.evaluate(()=>document.querySelectorAll('a.play-link').forEach(a=>a.click()));check((await state()).loaders===0,route+' unconsented clicks no loader');
  await p.locator('#analytics-accept').click();await p.waitForFunction(()=>document.querySelectorAll('script[src*="googletagmanager"]').length===1);await p.evaluate(()=>document.querySelectorAll('a.play-link').forEach(a=>a.click()));
  const clicks=await p.evaluate(()=>({events:window.dataLayer.map(x=>[...x]).filter(x=>x[0]==='event'),links:[...document.querySelectorAll('a.play-link')].map(a=>a.href)}));
  check(clicks.events.length===2&&clicks.events.every(e=>e[1]==='play_store_click'),route+' exactly one measured event per badge');
  check(clicks.links.every(u=>new URLSearchParams(new URL(u).searchParams.get('referrer')).get('utm_source')==='qa'),route+' install attribution');
  const accepted=await state();await p.reload();check((await state()).choice==='granted',route+' accept persistence');
  const peer=await context.newPage();await peer.goto(origin+(url==='/'?'/fishing-journal-app/':'/'));await p.evaluate(()=>document.cookie='_ga=audit; Path=/');await p.locator('#analytics-choices').click();await p.locator('#analytics-reject').click();
  await peer.waitForFunction(()=>window['ga-disable-G-LPXGL5VTB1']===true);check(!(await state()).cookies.includes('_ga='),route+' withdrawal cookie removal');
  await p.goto(origin+(url==='/'?'/fishing-journal-app/':'/'));check((await state()).choice==='denied'&&!(await state()).loaders,route+' reject across route');await p.goBack();check((await state()).choice==='denied',route+' reject across history');
  report.cases.push({route,kind:'consent',before,accepted,clicks,withdrawn:await state()});await context.close();
  const blocked=await pageAt(320,720,{blocked:true});await navigate(blocked.page,url);await blocked.page.locator('#analytics-accept').click();const failure=await blocked.page.evaluate(()=>({disabled:window['ga-disable-G-LPXGL5VTB1'],loaders:document.querySelectorAll('script[src*="googletagmanager"]').length,status:document.querySelector('#analytics-status').textContent,visible:!document.querySelector('#analytics-consent').hidden}));check(failure.disabled&&!failure.loaders&&failure.visible&&failure.status.includes('could not save'),route+' storage failure closed');report.cases.push({route,kind:'storage-blocked',...failure});await blocked.context.close();
  const nojs=await pageAt(390,844,{js:false});await nojs.page.goto(origin+url);const fallback=await nojs.page.evaluate(()=>({badges:document.querySelectorAll('.play-link').length,hidden:document.querySelector('#analytics-consent').hidden,loaders:document.querySelectorAll('script[src]').length}));check(fallback.badges===2&&fallback.hidden&&fallback.loaders===0,route+' no JS');await nojs.page.locator('.mobile-menu summary').click();check(await nojs.page.locator('.mobile-menu').getAttribute('open')!==null,route+' native no-JS menu');report.cases.push({route,kind:'no-js',...fallback});await nojs.context.close();
 }
 for(const [route,url] of routes)for(const w of [320,390]){
  const {page:p,context}=await pageAt(w,w===320?720:844);await navigate(p,url);await scale(p,1.6);const focus=[];
  for(let n=0;n<24;n++){await p.keyboard.press('Tab');focus.push(await p.evaluate(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),panel=document.querySelector('#analytics-consent'),limit=panel.hidden?innerHeight:panel.getBoundingClientRect().top;return {label:e.getAttribute('aria-label')||e.textContent.trim().slice(0,70),visible:e===document.body?true:panel.contains(e)?r.top>=limit&&r.bottom<=innerHeight:r.top>=-1&&r.bottom<=limit,top:r.top,bottom:r.bottom,limit};}));}
  check(focus.every(f=>f.visible),route+' '+w+' enlarged focus unobscured');report.cases.push({route,width:w,kind:'text160-keyboard',focus});await context.close();
 }
 }
}catch(error){report.exceptions.push(error.stack);process.exitCode=1;}finally{
 await fs.writeFile(path.join(output,mode+'.json'),JSON.stringify(report,null,2)+'\n');await browser.close();
 console.log(JSON.stringify({engine,version:report.version,mode,cases:report.cases.length,axeScans:report.axe.length,violations:report.axe.map(a=>({id:a.id,rules:a.violations.map(v=>v.id)})),failures:report.failures,exceptions:report.exceptions,external:report.external,analytics:report.analytics.length},null,2));
 if(report.failures.length||report.exceptions.length||report.external.length)process.exitCode=1;
}
