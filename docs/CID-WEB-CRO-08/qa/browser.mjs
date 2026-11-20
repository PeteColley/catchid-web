// Actual built Astro pages, isolated installed Chromium via native CDP.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(docs,'../..'),output=path.join(docs,'evidence',process.env.CATCHID_BROWSER_LABEL||'');
const origin=process.env.CATCHID_ORIGIN||'http://127.0.0.1:4188';
const mode=process.argv[2]||'matrix';
const label=process.env.CATCHID_BROWSER_LABEL||'chrome';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await fs.mkdir(output,{recursive:true});
const chrome=spawn(process.env.CATCHID_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync','--disable-extensions','--disable-default-apps','--hide-scrollbars','--remote-debugging-port=9348','--remote-debugging-address=127.0.0.1', '--user-data-dir='+path.join(repo,'.npm-cache/cro08-browser-'+label)],{windowsHide:true,stdio:'ignore'});
let version;for(let i=0;i<100;i++){try{version=await(await fetch('http://127.0.0.1:9348/json/version')).json();break}catch{await pause(100)}}if(!version)throw Error('Chrome failed to start');
async function connect(url){const ws=new WebSocket(url);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let sequence=0;const pending=new Map(),listeners=new Map();ws.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id){const p=pending.get(msg.id);if(!p)return;pending.delete(msg.id);msg.error?p.j(Error(JSON.stringify(msg.error))):p.r(msg.result)}else for(const fn of listeners.get(msg.method)||[])fn(msg.params)};return {send(method,params={}){return new Promise((r,j)=>{const id=++sequence;pending.set(id,{r,j});ws.send(JSON.stringify({id,method,params}))})},on(method,fn){if(!listeners.has(method))listeners.set(method,[]);listeners.get(method).push(fn)},close(){ws.close()}}}
const browser=await connect(version.webSocketDebuggerUrl);
const report={label:'IMPLEMENTATION CANDIDATE — NOT LIVE',mode,browser:version.Browser,method:'Desktop Chromium responsive CSS-pixel emulation, DPR 1; not a physical device',cases:[],interactions:[],analyticsLoads:[],externalRequests:[],exceptions:[],failures:[]};
const geometry=`(()=>{const rect=e=>{if(!e||e.hidden||getComputedStyle(e).display==='none')return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}};const all=[...document.querySelectorAll('body *')];const targets=[...document.querySelectorAll('a,button,summary')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('dialog:not([open])'));return {title:document.title,width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth,primary:rect(document.querySelector('[data-primary]')),proof:rect(document.querySelector('.hero-proof .journal-screen,.landing-proof .journal-screen')),consentButtons:[...document.querySelectorAll('.analytics-actions button')].map(rect),consent:rect(document.querySelector('#analytics-consent')),images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,alt:i.getAttribute('alt')})),svgImages:[...document.querySelectorAll('svg[role="img"]')].map(e=>({alt:e.getAttribute('aria-label'),rect:rect(e)})),smallTargets:targets.filter(e=>rect(e).height<44&&!e.closest('p')).map(e=>({text:e.textContent,rect:rect(e)})),clippedText:all.filter(e=>e.children.length===0&&e.textContent.trim()&&['hidden','clip'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2&&!e.classList.contains('sr-only')).map(e=>e.className),badAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),playLinks:[...document.querySelectorAll('a.play-link')].map(a=>a.href),storage:location.protocol==='file:'?[]:Object.keys(localStorage),cookies:document.cookie};})()`;
async function newPage(w,h,clear=true){const target=await(await fetch('http://127.0.0.1:9348/json/new?about:blank',{method:'PUT'})).json();const c=await connect(target.webSocketDebuggerUrl);const requests=[],loaded=new Set();c.on('Page.lifecycleEvent',event=>{if(event.name==='load')loaded.add(event.loaderId)});c.on('Network.requestWillBeSent',e=>requests.push(e.request.url));c.on('Runtime.exceptionThrown',e=>report.exceptions.push(e.exceptionDetails.text));c.on('Runtime.consoleAPICalled',e=>{if(e.type==='error')report.exceptions.push('console.error: '+e.args.map(a=>a.value||a.description).join(' '))});c.on('Log.entryAdded',e=>{if(e.entry.level==='error')report.exceptions.push('browser log: '+e.entry.text+' '+(e.entry.url||''))});c.on('Fetch.requestPaused',async e=>{if(e.request.url.startsWith(origin+'/')||e.request.url.startsWith('data:'))await c.send('Fetch.continueRequest',{requestId:e.requestId});else if(e.request.url==='https://www.googletagmanager.com/gtag/js?id=G-LPXGL5VTB1'){const saved=(await c.send('Runtime.evaluate',{expression:"localStorage.getItem('catchid.website.analytics')",returnByValue:true})).result.value;report.analyticsLoads.push({url:e.request.url,saved});if(saved!=='granted')report.failures.push('Unconsented GA loader');await c.send('Fetch.fulfillRequest',{requestId:e.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/javascript'}],body:Buffer.from('/* inert loader: no production measurement during QA */').toString('base64')})}else{report.externalRequests.push(e.request.url);await c.send('Fetch.failRequest',{requestId:e.requestId,errorReason:'BlockedByClient'})}});await c.send('Page.enable');await c.send('Page.setLifecycleEventsEnabled',{enabled:true});await c.send('Runtime.enable');await c.send('Network.enable');await c.send('Log.enable');await c.send('Fetch.enable');if(clear)await c.send('Storage.clearDataForOrigin',{origin,storageTypes:'all'});await c.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});return {c,target,requests,loaded,async eval(expression){const r=await c.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value},async close(){await browser.send('Target.closeTarget',{targetId:target.id});c.close()}}}
async function navigate(p,url){const navigation=await p.c.send('Page.navigate',{url});let ready=false;for(let i=0;i<300;i++){if((!navigation.loaderId||p.loaded.has(navigation.loaderId))&&await p.eval(`location.href===${JSON.stringify(url)}&&document.readyState==='complete'&&!!document.querySelector('h1')`)){ready=true;break;}await pause(50)}if(!ready)throw Error('Navigation did not complete: '+url);await p.eval(`Promise.all([...document.images].map(i=>{i.dataset.qaInitialLoading=i.loading;i.loading='eager';return i.decode().catch(()=>{});}));`);await pause(150)}
async function shot(p,name,full=false){const params={format:'png',captureBeyondViewport:full};if(full){const m=await p.c.send('Page.getLayoutMetrics');params.clip={x:0,y:0,width:m.cssContentSize.width,height:m.cssContentSize.height,scale:1}}const r=await p.c.send('Page.captureScreenshot',params);await fs.writeFile(path.join(output,name),Buffer.from(r.data,'base64'))}
const routes=[['home','/'],['fishing-journal-app','/fishing-journal-app/']];
const key=async(p,name,code)=>{await p.c.send('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,windowsVirtualKeyCode:code,...(name==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});await p.c.send('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name,windowsVirtualKeyCode:code});};
const scaleText=p=>p.eval(`(()=>{const nodes=[...document.querySelectorAll('body,body *')].filter(e=>e.tagName!=='svg'&&!e.closest('svg'));const sizes=nodes.map(e=>parseFloat(getComputedStyle(e).fontSize));nodes.forEach((e,i)=>e.style.fontSize=(sizes[i]*1.6)+'px')})()`);
const offState=p=>p.eval(`({choice:localStorage.getItem('catchid.website.analytics'),disabled:window['ga-disable-G-LPXGL5VTB1'],hidden:document.querySelector('#analytics-consent').hidden,cookies:document.cookie,loaders:document.querySelectorAll('script[src*="googletagmanager"]').length})`);
const check=(value,label)=>{if(!value)report.failures.push(label);};
try{
 if(mode==='matrix'||mode==='initial'){
 const sizes=mode==='initial'?[[390,844],[1440,1000]]:[[320,720],[360,800],[390,844],[430,932],[768,1024],[1024,900],[1440,1000]];
 for(const [route,url] of routes)for(const [w,h] of sizes)for(const state of ['first','saved'])for(const scale of(mode==='matrix'?[1,1.6]:[1])){
  const p=await newPage(w,h);
  if(state==='saved')await p.c.send('Page.addScriptToEvaluateOnNewDocument',{source:`localStorage.setItem('catchid.website.analytics','denied');`});
  await p.c.send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaCLS=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.qaCLS+=e.value}).observe({type:'layout-shift',buffered:true});`});
  await navigate(p,origin+url);if(scale!==1)await scaleText(p);await pause(120);
  const stem=`${mode}-${route}-${w}x${h}-${state}${scale===1.6?'-text160':''}`;
  const data=await p.eval(geometry);const extra=await p.eval(`({cls:window.qaCLS,resources:performance.getEntriesByType('resource').map(e=>({url:e.name,bytes:e.encodedBodySize,duration:e.duration})),headerCta:!!document.querySelector('.site-header .play-link'),brandWrap:(()=>{const e=document.querySelector('.site-header .brand>span');return e.getBoundingClientRect().height>parseFloat(getComputedStyle(e).lineHeight)+2})(),headerOverlap:(()=>{const b=document.querySelector('.site-header .brand').getBoundingClientRect(),n=document.querySelector('.site-header>nav'),r=n.getBoundingClientRect();return getComputedStyle(n).display!=='none'&&b.right+16>r.left})(),badges:document.querySelectorAll('a.play-badge img[src="/assets/google-play-badge.svg"]').length})`);
  await shot(p,stem+'.png');const full=[390,1440].includes(w)&&scale===1;if(full)await shot(p,stem+'-full.png',true);
  check(!data.overflow&&!data.clippedText.length&&!data.smallTargets.length&&!data.badAnchors.length&&!data.images.some(i=>!i.loaded),stem+' layout/assets');
  check(!extra.headerCta&&!extra.headerOverlap&&!extra.brandWrap&&extra.badges===2,stem+' badge contract');
  const choices=data.consentButtons.filter(Boolean);if(state==='first')check(choices.length===2&&Math.abs(choices[0].width-choices[1].width)<1&&Math.abs(choices[0].height-choices[1].height)<1,stem+' consent parity');
  if(w<=430&&scale===1&&state==='first')check(data.primary.bottom<=data.consent.y,stem+' first-view CTA');
  report.cases.push({route,state,scale,screenshot:stem+'.png',full:full?stem+'-full.png':null,...data,...extra,requests:p.requests});await p.close();
 }
 }

 if(mode==='sections'||mode==='sections-text160'){
 for(const [w,h] of [[320,720],[390,844],[768,1024],[1024,900],[1440,1000]]){
  const p=await newPage(w,h);await p.c.send('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('catchid.website.analytics','denied');"});
  await navigate(p,origin+'/');if(mode==='sections-text160')await scaleText(p);
  for(const id of ['record','journal']){
   const info=await p.eval(`(()=>{const s=document.getElementById('${id}'),r=s.getBoundingClientRect(),img=s.querySelector('img');return {x:0,y:Math.ceil(r.top+scrollY),width:innerWidth,height:Math.ceil(r.height),scale:1,image:img?{currentSrc:img.currentSrc,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height,alt:img.alt}:null,caption:s.querySelector('figcaption').textContent}})()`);
   const {image,caption,...clip}=info;
   const capture=await p.c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});
   const file=id+'-'+w+(mode==='sections-text160'?'-text160':'')+'.png';await fs.writeFile(path.join(output,file),Buffer.from(capture.data,'base64'));
   report.cases.push({section:id,width:w,file,image,caption});
  }await p.close();
 }
 }
 if(mode==='interactions'){
 for(const [route,url] of routes){
  const p=await newPage(390,844);await p.c.send('Emulation.setScriptExecutionDisabled',{value:true});await navigate(p,origin+url);
  const fallback=await p.eval("({badges:document.querySelectorAll('a.play-link[href*=\"play.google.com\"]').length,panelHidden:document.querySelector('#analytics-consent').hidden,loaders:document.querySelectorAll('script[src]').length,menu:!!document.querySelector('.mobile-menu summary')})");
  check(fallback.badges===2&&fallback.panelHidden&&!fallback.loaders&&fallback.menu,route+' no-JS fallback');report.interactions.push({route,kind:'no-js',...fallback});await p.close();
 }

 for(const [route,url] of routes)for(const width of [320,390,768,1024,1440]){
  const p=await newPage(width,width===320?720:width===390?844:1000);await navigate(p,origin+url);await p.c.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const result={route,width,kind:'navigation',focus:[],navigation:[]};
  for(let i=0;i<(width<=760?3:5);i++){await key(p,'Tab',9);result.focus.push(await p.eval(`({label:document.activeElement.getAttribute('aria-label')||document.activeElement.textContent.trim(),outline:getComputedStyle(document.activeElement).outlineStyle})`));}
  check(result.focus.every(f=>f.outline==='solid'),route+' '+width+' header focus');
  if(width<=760){await key(p,'Enter',13);check(await p.eval(`document.querySelector('.mobile-menu').open`),route+' menu keyboard');await key(p,'Tab',9);check(await p.eval(`document.activeElement.textContent==='How it works'`),route+' first menu link');}
  await shot(p,route+'-navigation-'+width+'.png');
  const nav=width<=760?'.mobile-menu nav a':'.site-header>nav a';const count=await p.eval(`document.querySelectorAll('${nav}').length`);
  for(let i=0;i<count;i++){
   await navigate(p,origin+url);if(width<=760)await p.eval(`document.querySelector('.mobile-menu').open=true`);
   const expected=await p.eval(`(()=>{const a=document.querySelectorAll('${nav}')[${i}];a.focus();return a.href})()`);await key(p,'Enter',13);await pause(150);
   const actual=await p.eval(`({url:location.href,target:!location.hash||!!document.getElementById(location.hash.slice(1)),menuClosed:!document.querySelector('.mobile-menu').open})`);
   result.navigation.push({expected,...actual});check(actual.url===expected&&actual.target&&actual.menuClosed,route+' '+width+' navigation '+i);
  }
  await navigate(p,origin+url);await p.eval(`document.querySelectorAll('.questions details').forEach(d=>d.open=true)`);
  check(await p.eval(`[...document.querySelectorAll('.questions details p')].every(e=>e.getBoundingClientRect().height>0&&e.scrollWidth<=e.clientWidth)`),route+' readable FAQs');
  check(await p.eval(`getComputedStyle(document.documentElement).scrollBehavior==='auto'`),route+' reduced motion');
  const imageLink=await p.eval(`document.querySelector('.mobile-insights-link').href`);await p.eval(`document.querySelector('.mobile-insights-link').click()`);await pause(150);check((await p.eval('location.href'))===imageLink,route+' original image link');
  report.interactions.push(result);await p.close();
 }
 for(const [route,url] of routes)for(const width of [320,390]){
  const p=await newPage(width,width===320?720:844);await navigate(p,origin+url);await scaleText(p);await pause(100);const focus=[];
  for(let i=0;i<24;i++){await key(p,'Tab',9);await pause(30);focus.push(await p.eval(`(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),panel=document.querySelector('#analytics-consent'),limit=panel.hidden?innerHeight:panel.getBoundingClientRect().top;return {label:e.getAttribute('aria-label')||e.textContent.trim().slice(0,55),visible:e===document.body?true:panel.contains(e)?r.top>=limit&&r.bottom<=innerHeight:r.top>=-1&&r.bottom<=limit,top:r.top,bottom:r.bottom,outline:getComputedStyle(e).outlineStyle}})()`));}
  check(focus.every(f=>f.visible),route+' '+width+' enlarged keyboard obstruction');report.interactions.push({route,width,kind:'text160-focus',focus});await shot(p,route+'-text160-focus-'+width+'.png');await p.close();
 }
 for(const [route,url] of routes){
  const p=await newPage(390,844);await navigate(p,origin+url+'?utm_source=qa&utm_medium=review&utm_campaign=fixture&gclid=fixture-id');const result={route,kind:'consent'};
  result.initial=await offState(p);check(result.initial.choice===null&&result.initial.disabled&&!result.initial.loaders,route+' first visit analytics off');
  await p.eval(`document.addEventListener('click',event=>{if(event.target.closest('a.play-link'))event.preventDefault()},{capture:true})`);
  const originals=await p.eval(`[...document.querySelectorAll('a.play-link')].map(a=>a.href)`);
  await p.eval(`document.querySelectorAll('a.play-link').forEach(a=>a.click())`);check(JSON.stringify(await p.eval(`[...document.querySelectorAll('a.play-link')].map(a=>a.href)`))===JSON.stringify(originals),route+' unconsented attribution unchanged');
  await p.eval(`document.querySelector('#analytics-reject').click()`);result.rejected=await offState(p);check(result.rejected.choice==='denied'&&result.rejected.hidden&&result.rejected.disabled,route+' reject');
  const other=url==='/'?'/fishing-journal-app/':'/';await navigate(p,origin+other);result.navigation=await offState(p);check(result.navigation.choice==='denied'&&!result.navigation.loaders&&result.navigation.hidden,route+' rejection across navigation');
  await p.eval('history.back()');await pause(250);result.back=await offState(p);check(result.back.choice==='denied'&&!result.back.loaders,route+' back restoration');
  await p.eval('history.forward()');await pause(250);check((await offState(p)).choice==='denied',route+' forward restoration');
  await navigate(p,origin+url+'?utm_source=qa&utm_medium=review&utm_campaign=fixture&gclid=fixture-id');
  await p.eval(`document.querySelector('#analytics-choices').click()`);check(await p.eval(`document.activeElement.id==='analytics-title'`),route+' reopen focus');
  await p.eval(`document.querySelector('#analytics-accept').click()`);await pause(100);result.accepted=await offState(p);check(result.accepted.choice==='granted'&&!result.accepted.disabled&&result.accepted.loaders===1,route+' accept');
  check(await p.eval(`document.activeElement.id==='analytics-choices'`),route+' return focus');
  await p.eval(`document.addEventListener('click',event=>{if(event.target.closest('a.play-link'))event.preventDefault()},{capture:true});document.querySelectorAll('a.play-link').forEach(a=>a.click())`);
  result.play=await p.eval(`({links:[...document.querySelectorAll('a.play-link')].map(a=>a.href),events:window.dataLayer.map(args=>[...args]).filter(args=>args[0]==='event')})`);
  check(result.play.events.length===2&&result.play.events.every(e=>e[1]==='play_store_click'&&e[2].handoff_attribution==='inbound_campaign'),route+' consent-gated click events');
  check(result.play.links.every(link=>new URLSearchParams(new URL(link).searchParams.get('referrer')).get('utm_source')==='qa'),route+' inbound install referrer');
  await p.c.send('Page.reload');await pause(250);result.reload=await offState(p);check(result.reload.choice==='granted'&&result.reload.loaders===1,route+' saved acceptance reload');
  const peer=await newPage(390,844,false);await navigate(peer,origin+other);await p.eval(`document.cookie='_ga=fixture; Path=/';document.querySelector('#analytics-choices').click();document.querySelector('#analytics-reject').click()`);await pause(150);
  result.withdrawn=await offState(p);result.peer=await offState(peer);check(result.withdrawn.choice==='denied'&&result.withdrawn.disabled&&!result.withdrawn.cookies.includes('_ga='),route+' withdrawal cookies');check(result.peer.choice==='denied'&&result.peer.disabled,route+' cross-tab withdrawal');await peer.close();
  await p.c.send('Page.reload');await pause(200);check(!(await offState(p)).loaders,route+' withdrawn reload off');report.interactions.push(result);await p.close();
  const blocked=await newPage(390,844);await blocked.c.send('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(window,'localStorage',{value:{getItem(){throw Error('QA blocked')},setItem(){throw Error('QA blocked')},removeItem(){throw Error('QA blocked')}}})`});await navigate(blocked,origin+url);await blocked.eval(`document.querySelector('#analytics-accept').click()`);
  const failed=await blocked.eval(`({disabled:window['ga-disable-G-LPXGL5VTB1'],loaders:document.querySelectorAll('script[src*="googletagmanager"]').length,visible:!document.querySelector('#analytics-consent').hidden,status:document.querySelector('#analytics-status').textContent})`);
  check(failed.disabled&&!failed.loaders&&failed.visible&&failed.status.includes('could not save'),route+' storage fails closed');report.interactions.push({route,kind:'storage-blocked',...failed});await shot(blocked,route+'-storage-blocked.png');await blocked.close();
 }
 }
 if(mode==='gallery'){
  const p=await newPage(1280,900);await navigate(p,origin+'/');
  const data=await p.eval(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),scripts:document.scripts.length})`);
  check(data.width===data.scrollWidth&&data.images.every(i=>i.loaded)&&data.scripts===0,'Offline gallery images/layout/no scripts');
  await shot(p,'gallery-1280.png');report.cases.push(data);await p.close();
 }
 if(mode==='console'){
 for(const [route,url] of routes)for(const [w,h] of [[390,844],[1440,1000]])for(const state of ['first','saved']){
  const p=await newPage(w,h);if(state==='saved')await p.c.send('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('catchid.website.analytics','denied');"});
  await navigate(p,origin+url);await pause(150);report.cases.push({route,width:w,state});await p.close();
 }
 }
 if(mode==='images'){
 for(const [w,h] of [[390,844],[1440,1000]])for(const dpr of [1,2,3]){
  const p=await newPage(w,h);await p.c.send('Network.setCacheDisabled',{cacheDisabled:true});
  await p.c.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:dpr,mobile:false});
  await p.c.send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaCLS=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.qaCLS+=e.value}).observe({type:'layout-shift',buffered:true});`});
  await navigate(p,origin+'/');
  const result=await p.eval(`(()=>{const i=document.querySelector('.hero-photograph');return {width:innerWidth,dpr:devicePixelRatio,currentSrc:i.currentSrc,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,position:getComputedStyle(i).objectPosition,fit:getComputedStyle(i).objectFit,loading:i.loading,priority:i.fetchPriority,photoElements:document.querySelectorAll('.river-photo img').length,cls:window.qaCLS,resources:performance.getEntriesByType('resource').filter(r=>r.name.includes('photo-1-')).map(r=>({url:r.name,bytes:r.encodedBodySize,transfer:r.transferSize,duration:r.duration}))}})()`);
  const requests=p.requests.filter(url=>url.includes('photo-1-'));
  check(requests.length===1&&result.resources.length===1,`image ${w}/${dpr} exactly one photo request`);
  check(result.currentSrc.endsWith('.webp')&&result.photoElements===1&&result.loading==='eager'&&result.priority==='high',`image ${w}/${dpr} responsive WebP/priority`);
  check(result.position===(w===390?'30% 50%':'35% 50%')&&result.fit==='cover',`image ${w}/${dpr} approved treatment`);
  check(result.resources[0].bytes<400000&&result.cls<.05,`image ${w}/${dpr} bounded transfer/CLS`);
  const captures=await p.eval(`([...document.querySelectorAll('.captured-screen img')].map(i=>({src:i.currentSrc,width:i.getBoundingClientRect().width,loading:i.dataset.qaInitialLoading||i.loading,decoded:i.complete&&i.naturalWidth>0,resources:performance.getEntriesByType('resource').filter(r=>r.name.includes(i.currentSrc.split('/').pop())).map(r=>({url:r.name,bytes:r.encodedBodySize}))})))`);
  check(captures.length===2&&captures.every(i=>i.decoded&&i.loading==='lazy'&&i.src.endsWith('.webp')&&i.resources.length===1),`two genuine responsive screenshot requests ${w}/${dpr}`);
  for(const name of ['save-catch-no-photo-upper','catch-details-no-photo'])check(p.requests.filter(url=>url.includes(name)).length===1,`one request for ${name} ${w}/${dpr}`);
  report.cases.push({...result,requests,captures});await p.close();
 }
 for(const [w,h] of [[390,844],[1440,1000]]){
  const p=await newPage(w,h);
  // Simulate a browser that does not support the offered WebP source: retain the
  // exact generated fallback markup, changing only the source's type hint.
  const html=(await fs.readFile(path.join(repo,'dist/index.html'),'utf8')).replaceAll('type="image/webp"','type="image/x-cro08-unsupported"');
  await p.c.send('Page.navigate',{url:origin+'/'});await pause(250);
  await p.c.send('Network.setCacheDisabled',{cacheDisabled:true});
  p.requests.length=0;
  await p.c.send('Page.setDocumentContent',{frameId:(await p.c.send('Page.getFrameTree')).frameTree.frame.id,html});await pause(250);
  const result=await p.eval(`(async()=>{const i=document.querySelector('.hero-photograph');await i.decode();return {width:innerWidth,currentSrc:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,alt:i.alt}})()`);
  check(result.currentSrc.endsWith('.jpg')&&result.loaded,'JPEG fallback '+w);
  const captures=await p.eval(`(async()=>{const result=[];for(const i of document.querySelectorAll('.captured-screen img')){i.loading='eager';await i.decode();result.push({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0});}return result;})()`);
  check(captures.length===2&&captures.every(i=>i.loaded&&i.src.endsWith('.png')),'PNG screenshot fallback '+w);
  result.captures=captures;
  report.cases.push({kind:'simulated-unsupported-WebP',...result});await p.close();
 }
 }
 await fs.writeFile(path.join(output,mode+'-verification.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({mode,browser:report.browser,cases:report.cases.length,interactions:report.interactions.length,analyticsLoads:report.analyticsLoads.length,failures:report.failures,externalRequests:report.externalRequests,exceptions:report.exceptions},null,2));
 if(report.failures.length||report.externalRequests.length||report.exceptions.length)process.exitCode=1;
}finally{await browser.send('Browser.close').catch(()=>{});browser.close();chrome.kill();}
