// Actual built Astro pages, isolated installed Chromium via native CDP.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(docs,'../..'),output=path.join(docs,'evidence',process.env.CATCHID_BROWSER_LABEL||'');
const origin='http://127.0.0.1:4185';
const mode='photos';
const label=process.env.CATCHID_BROWSER_LABEL||'chrome';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
await fs.mkdir(output,{recursive:true});
const chrome=spawn(process.env.CATCHID_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync','--disable-extensions','--disable-default-apps','--hide-scrollbars','--remote-debugging-port=9345','--remote-debugging-address=127.0.0.1', '--user-data-dir='+path.join(repo,'.npm-cache/cro05-browser-'+label)],{windowsHide:true,stdio:'ignore'});
let version;for(let i=0;i<100;i++){try{version=await(await fetch('http://127.0.0.1:9345/json/version')).json();break}catch{await pause(100)}}if(!version)throw Error('Chrome failed to start');
async function connect(url){const ws=new WebSocket(url);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let sequence=0;const pending=new Map(),listeners=new Map();ws.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id){const p=pending.get(msg.id);if(!p)return;pending.delete(msg.id);msg.error?p.j(Error(JSON.stringify(msg.error))):p.r(msg.result)}else for(const fn of listeners.get(msg.method)||[])fn(msg.params)};return {send(method,params={}){return new Promise((r,j)=>{const id=++sequence;pending.set(id,{r,j});ws.send(JSON.stringify({id,method,params}))})},on(method,fn){if(!listeners.has(method))listeners.set(method,[]);listeners.get(method).push(fn)},close(){ws.close()}}}
const browser=await connect(version.webSocketDebuggerUrl);
const report={label:'IMPLEMENTATION CANDIDATE — NOT LIVE',mode,browser:version.Browser,method:'Desktop Chromium responsive CSS-pixel emulation, DPR 1; not a physical device',cases:[],interactions:[],analyticsLoads:[],externalRequests:[],exceptions:[],failures:[]};
const geometry=`(()=>{const rect=e=>{if(!e||e.hidden||getComputedStyle(e).display==='none')return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}};const all=[...document.querySelectorAll('body *')];const targets=[...document.querySelectorAll('a,button,summary')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('dialog:not([open])'));return {title:document.title,width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth,primary:rect(document.querySelector('[data-primary]')),proof:rect(document.querySelector('.hero-proof .journal-screen,.landing-proof .journal-screen')),consentButtons:[...document.querySelectorAll('.analytics-actions button')].map(rect),consent:rect(document.querySelector('#analytics-consent')),images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,alt:i.getAttribute('alt')})),svgImages:[...document.querySelectorAll('svg[role="img"]')].map(e=>({alt:e.getAttribute('aria-label'),rect:rect(e)})),smallTargets:targets.filter(e=>rect(e).height<44&&!e.closest('p')).map(e=>({text:e.textContent,rect:rect(e)})),clippedText:all.filter(e=>e.children.length===0&&e.textContent.trim()&&['hidden','clip'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2&&!e.classList.contains('sr-only')).map(e=>e.className),badAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),playLinks:[...document.querySelectorAll('a.play-link')].map(a=>a.href),storage:location.protocol==='file:'?[]:Object.keys(localStorage),cookies:document.cookie};})()`;
async function newPage(w,h,clear=true){const target=await(await fetch('http://127.0.0.1:9345/json/new?about:blank',{method:'PUT'})).json();const c=await connect(target.webSocketDebuggerUrl);const requests=[],loaded=new Set();c.on('Page.lifecycleEvent',event=>{if(event.name==='load')loaded.add(event.loaderId)});c.on('Network.requestWillBeSent',e=>requests.push(e.request.url));c.on('Runtime.exceptionThrown',e=>report.exceptions.push(e.exceptionDetails.text));c.on('Fetch.requestPaused',async e=>{if(e.request.url.startsWith(origin+'/')||e.request.url.startsWith('data:'))await c.send('Fetch.continueRequest',{requestId:e.requestId});else if(e.request.url==='https://www.googletagmanager.com/gtag/js?id=G-LPXGL5VTB1'){const saved=(await c.send('Runtime.evaluate',{expression:"localStorage.getItem('catchid.website.analytics')",returnByValue:true})).result.value;report.analyticsLoads.push({url:e.request.url,saved});if(saved!=='granted')report.failures.push('Unconsented GA loader');await c.send('Fetch.fulfillRequest',{requestId:e.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/javascript'}],body:Buffer.from('/* inert loader: no production measurement during QA */').toString('base64')})}else{report.externalRequests.push(e.request.url);await c.send('Fetch.failRequest',{requestId:e.requestId,errorReason:'BlockedByClient'})}});await c.send('Page.enable');await c.send('Page.setLifecycleEventsEnabled',{enabled:true});await c.send('Runtime.enable');await c.send('Network.enable');await c.send('Fetch.enable');if(clear)await c.send('Storage.clearDataForOrigin',{origin,storageTypes:'all'});await c.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});return {c,target,requests,loaded,async eval(expression){const r=await c.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value},async close(){await browser.send('Target.closeTarget',{targetId:target.id});c.close()}}}
async function navigate(p,url){const navigation=await p.c.send('Page.navigate',{url});let ready=false;for(let i=0;i<300;i++){if((!navigation.loaderId||p.loaded.has(navigation.loaderId))&&await p.eval(`location.href===${JSON.stringify(url)}&&document.readyState==='complete'&&!!document.querySelector('h1')`)){ready=true;break;}await pause(50)}if(!ready)throw Error('Navigation did not complete: '+url);await p.eval(`Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));`);await pause(150)}
async function shot(p,name,full=false){const params={format:'png',captureBeyondViewport:full};if(full){const m=await p.c.send('Page.getLayoutMetrics');params.clip={x:0,y:0,width:m.cssContentSize.width,height:m.cssContentSize.height,scale:1}}const r=await p.c.send('Page.captureScreenshot',params);await fs.writeFile(path.join(output,name),Buffer.from(r.data,'base64'))}
const check=(ok,label)=>{if(!ok)report.failures.push(label)};
const controls=new Map();
const stable=`(()=>{const rect=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(n=>Math.round(n*100)/100)};return {text:document.body.innerText.replace(/Concept art — not publication approved|Photo candidate — review only/g,'PHOTO LABEL'),geometry:[...document.querySelectorAll('body *')].filter(e=>!e.closest('.hero-proof .river-photo')&&!e.closest('.art-label')&&e.tagName!=='SCRIPT').map(e=>({tag:e.tagName,class:e.getAttribute('class'),rect:rect(e)})),scripts:[...document.scripts].map(s=>s.textContent),play:[...document.querySelectorAll('a.play-link')].map(e=>e.href),journal:document.querySelector('.hero-proof .journal-screen').innerHTML}})()`;
try{
  for(const key of ['baseline','a','b'])for(const [w,h] of [[1440,1000],[390,844]])for(const state of ['first','saved']){
    const p=await newPage(w,h);
    if(state==='saved')await p.c.send('Page.addScriptToEvaluateOnNewDocument',{source:`localStorage.setItem('catchid.website.analytics','denied');`});
    await navigate(p,origin+(key==='baseline'?'/':'/?photo='+key));
    await p.eval(`Promise.all([...document.querySelectorAll('svg image')].map(e=>new Promise(resolve=>{const i=new Image();i.onload=i.onerror=resolve;i.src=e.getAttribute('href')})))`);
    await pause(100);
    const name=`${key==='baseline'?'baseline':'variant-'+key}-${w}-${state}`;
    const metrics=await p.eval(geometry),unchanged=await p.eval(stable);
    const controlKey=w+'-'+state;
    if(key==='baseline')controls.set(controlKey,unchanged);
    else check(JSON.stringify(unchanged)===JSON.stringify(controls.get(controlKey)),name+' non-photo content, geometry, journal, consent scripts and attribution identical');
    check(!metrics.overflow&&!metrics.clippedText.length&&!metrics.images.some(i=>!i.loaded),name+' layout and images');
    check(metrics.playLinks.length===2,name+' two Play actions');
    check(await p.eval(`window['ga-disable-G-LPXGL5VTB1']&&!document.querySelector('script[src*="googletagmanager"]')`),name+' analytics remains off');
    if(w===390&&state==='first')check(metrics.primary.bottom<metrics.consent.y,name+' primary badge above consent');
    await shot(p,name+'.png');
    if(key!=='baseline'&&w===390&&state==='saved')await shot(p,`variant-${key}-390-full.png`,true);
    if(key!=='baseline'&&state==='saved'){
      const height=await p.eval(`document.querySelector('.story-intro').getBoundingClientRect().top`);
      const r=await p.c.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:w,height,scale:1}});
      await fs.writeFile(path.join(output,`variant-${key}-${w}-hero.png`),Buffer.from(r.data,'base64'));
    }
    const photo=await p.eval(`(()=>{const e=document.querySelector('.hero-proof .river-photo'),r=e.getBoundingClientRect(),i=e.querySelector('img');return {rect:{x:r.x,y:r.y,width:r.width,height:r.height},position:i?getComputedStyle(i).objectPosition:null,source:i?i.getAttribute('src'):null,natural:i?[i.naturalWidth,i.naturalHeight]:null}})()`);
    report.cases.push({key,state,screenshot:name+'.png',unchangedFromBaseline:key==='baseline'?null:JSON.stringify(unchanged)===JSON.stringify(controls.get(controlKey)),...metrics,photo});
    if(key!=='baseline'&&state==='first'){
      await p.eval(`document.querySelector('#analytics-reject').click()`);
      await navigate(p,origin+'/?photo='+key);
      check(await p.eval(`localStorage.getItem('catchid.website.analytics')==='denied'&&document.querySelector('#analytics-consent').hidden`),name+' rejection survives reload');
      if(w===390){await p.eval(`document.querySelector('.mobile-menu summary').click()`);check(await p.eval(`document.querySelector('.mobile-menu').open`),name+' menu opens');await p.eval(`document.querySelector('.mobile-menu a[href="#download"]').click()`);check(await p.eval(`!document.querySelector('.mobile-menu').open&&location.hash==='#download'`),name+' anchor/menu close');}
    }
    await p.close();
  }
  await fs.writeFile(path.join(output,'browser-verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({browser:report.browser,cases:report.cases.length,failures:report.failures,externalRequests:report.externalRequests,exceptions:report.exceptions},null,2));
  if(report.failures.length||report.externalRequests.length||report.exceptions.length)process.exitCode=1;
}finally{await browser.send('Browser.close').catch(()=>{});browser.close();chrome.kill();}
