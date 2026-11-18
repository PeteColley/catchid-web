// Dependency-free QA against an isolated installed Chrome. Not loaded by any prototype.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(docs,'../..');
const output = path.join(docs,'evidence');
const origin = 'http://127.0.0.1:4178';
const chromePath = process.env.CATCHID_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const delay = ms=>new Promise(resolve=>setTimeout(resolve,ms));
await fs.mkdir(path.join(repo,'.npm-cache/cro02-browser'),{recursive:true});
const chrome=spawn(chromePath,['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync','--disable-extensions','--disable-default-apps','--hide-scrollbars','--remote-debugging-port=9337','--remote-debugging-address=127.0.0.1',`--user-data-dir=${path.join(repo,'.npm-cache/cro02-browser')}`],{windowsHide:true,stdio:'ignore'});
let browserVersion;
for(let i=0;i<100;i++){try{browserVersion=await (await fetch('http://127.0.0.1:9337/json/version')).json();break;}catch{await delay(100);}}
if(!browserVersion)throw new Error('Chrome did not start');
async function connect(url){
  const socket=new WebSocket(url);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  let seq=0;const pending=new Map();const listeners=new Map();
  socket.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id){const item=pending.get(msg.id);if(!item)return;pending.delete(msg.id);msg.error?item.reject(Error(JSON.stringify(msg.error))):item.resolve(msg.result);}else{for(const listener of listeners.get(msg.method)||[])listener(msg.params);}};
  return {send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});},on(method,fn){if(!listeners.has(method))listeners.set(method,[]);listeners.get(method).push(fn);},close(){socket.close();}};
}
const browser=await connect(browserVersion.webSocketDebuggerUrl);
const baselineOnly=process.argv.includes('--baseline');
const interactionsOnly=process.argv.includes('--interactions');
const report=baselineOnly||interactionsOnly?JSON.parse(await fs.readFile(path.join(output,'browser-verification.json'),'utf8')):{label:'DESIGN CONCEPT — NOT LIVE',date:'2026-11-18',browser:browserVersion.Browser,viewportMethod:'CSS pixels / desktop Chromium responsive emulation, DPR 1; not physical Android',cases:[],interactions:[],externalRequests:[],errors:[]};
if(baselineOnly)report.cases=report.cases.filter(c=>c.concept!=='baseline');
if(interactionsOnly)report.interactions=[];
async function pageFor(width,height){
  const target=await(await fetch('http://127.0.0.1:9337/json/new?about:blank',{method:'PUT'})).json();
  const cdp=await connect(target.webSocketDebuggerUrl);
  const requests=[],exceptions=[];
  cdp.on('Network.requestWillBeSent',r=>requests.push(r.request.url));
  cdp.on('Runtime.exceptionThrown',r=>exceptions.push(r.exceptionDetails.text));
  cdp.on('Fetch.requestPaused',async r=>{if(r.request.url.startsWith(origin)||r.request.url.startsWith('data:'))await cdp.send('Fetch.continueRequest',{requestId:r.requestId});else{report.externalRequests.push(r.request.url);await cdp.send('Fetch.failRequest',{requestId:r.requestId,errorReason:'BlockedByClient'});}});
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');await cdp.send('Network.enable');await cdp.send('Fetch.enable');
  await cdp.send('Storage.clearDataForOrigin',{origin,storageTypes:'all'});
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  const evaluate=async expression=>{const value=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(value.exceptionDetails)throw Error(value.exceptionDetails.exception?.description||value.exceptionDetails.text);return value.result.value;};
  return {cdp,evaluate,requests,exceptions,targetId:target.id};
}
async function ready(p){
  for(let i=0;i<100;i++){if(await p.evaluate(`location.origin==='${origin}' && document.readyState==='complete' && document.querySelector('h1') && [...document.images].filter(i=>i.loading!=='lazy').every(i=>i.complete && i.naturalWidth>0)`))return;await delay(50);}
  throw Error('Page/images did not finish loading');
}
async function capture(p,name,full=false){
  const options={format:'png',captureBeyondViewport:full};
  if(full){const m=await p.cdp.send('Page.getLayoutMetrics');options.clip={x:0,y:0,width:m.cssContentSize.width,height:m.cssContentSize.height,scale:1};}
  const shot=await p.cdp.send('Page.captureScreenshot',options);await fs.writeFile(path.join(output,name),Buffer.from(shot.data,'base64'));
}
async function captureHero(p,name){
  const height=await p.evaluate(`Math.ceil(document.querySelector('.hero').getBoundingClientRect().bottom+scrollY)`);
  const width=await p.evaluate('innerWidth');
  const shot=await p.cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height,scale:1}});
  await fs.writeFile(path.join(output,name),Buffer.from(shot.data,'base64'));
}
const geometry=`(()=>{const rect=el=>{if(!el||getComputedStyle(el).display==='none')return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};const elements=[...document.querySelectorAll('body *')];return {viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth,primary:rect(document.querySelector('[data-primary]')||document.querySelector('.hero .play-badge')),headerCTA:rect(document.querySelector('.header-play')||document.querySelector('.compact')),consent:rect(document.querySelector('[data-consent]')||document.querySelector('#analytics-consent')),consentButtons:[...document.querySelectorAll('.consent-actions button,.analytics-actions button')].map(rect),images:[...document.images].map(i=>({src:i.getAttribute('src'),complete:i.complete,naturalWidth:i.naturalWidth,rect:rect(i)})),horizontalOutliers:elements.filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)&&!e.classList.contains('skip-link')}).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,rect:rect(e)})),clippedText:elements.filter(e=>e.textContent.trim()&&['hidden','clip'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2).map(e=>({tag:e.tagName,cls:e.className})),cookies:document.cookie,storage:Object.keys(localStorage)};})()`;
const sizes=[[320,720],[360,800],[390,844],[430,932],[768,1024],[1024,900],[1440,1000]];
try{
  const quick=process.argv.includes('--quick');
  const allSizes=baselineOnly||interactionsOnly?[]:quick?[[390,844],[1440,1000]]:sizes;
  for(const concept of ['a','b'])for(const [width,height] of allSizes)for(const state of ['first','saved'])for(const scale of (quick?[1]:[1,1.6])){
    const p=await pageFor(width,height);const query=`consent=${state}${scale===1.6?'&text=large':''}`;
    await p.cdp.send('Page.navigate',{url:`${origin}/concept-${concept}.html?${query}`});await ready(p);
    const result=await p.evaluate(geometry);const stem=`${concept}-${width}x${height}-${state}${scale===1.6?'-text160':''}`;
    const screenshot=scale===1||width===360||width===768?stem+'.png':null;
    if(screenshot)await capture(p,screenshot);
    if((width===390&&scale===1)||(width===360&&scale===1.6))await captureHero(p,`${stem}-hero.png`);
    if(width===390&&state==='saved'&&scale===1){await p.evaluate(`Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));`);await capture(p,`${stem}-full.png`,true);}
    if(result.overflow||result.horizontalOutliers.length||result.clippedText.length||p.exceptions.length)report.errors.push(stem);
    report.cases.push({concept,width,height,state,scale,screenshot,...result,requests:p.requests,exceptions:p.exceptions});
    await browser.send('Target.closeTarget',{targetId:p.targetId});p.cdp.close();
  }
  if(!quick){
    // Consent controls, keyboard focus and long-copy stress: both prototypes, actual browser events.
    for(const concept of baselineOnly?[]:['a','b']){
      const p=await pageFor(360,800);await p.cdp.send('Page.navigate',{url:`${origin}/concept-${concept}.html?consent=first`});await ready(p);
      const checks={concept};
      await p.cdp.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await p.cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
      checks.firstKeyboardFocus=await p.evaluate(`({label:document.activeElement.textContent,outline:getComputedStyle(document.activeElement).outlineStyle})`);
      for(let i=0;i<3;i++){await p.cdp.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await p.cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});}
      checks.headerKeyboardFocus=await p.evaluate(`({label:document.activeElement.textContent,outline:getComputedStyle(document.activeElement).outlineStyle,outlineWidth:getComputedStyle(document.activeElement).outlineWidth})`);
      await capture(p,`${concept}-360-keyboard-focus.png`);
      await p.cdp.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await p.cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
      checks.primaryKeyboardFocus=await p.evaluate(`({primary:document.activeElement.hasAttribute('data-primary'),outline:getComputedStyle(document.activeElement).outlineStyle,offset:getComputedStyle(document.activeElement).outlineOffset})`);
      await capture(p,`${concept}-360-primary-focus.png`);
      for(const choice of ['accepted','rejected']){
        await p.evaluate(`document.querySelector('[data-consent]').hidden=false;document.querySelector('[data-consent-choice="${choice}"]').click()`);
        checks[choice]=await p.evaluate(`({hidden:document.querySelector('[data-consent]').hidden,focus:document.activeElement.hasAttribute('data-primary'),cookies:document.cookie,storage:Object.keys(localStorage)})`);
      }
      await p.evaluate(`document.querySelector('[data-reopen]').click()`);checks.reopened=await p.evaluate(`!document.querySelector('[data-consent]').hidden && document.activeElement.hasAttribute('data-consent-choice')`);
      await p.evaluate(`document.querySelector('.hero-description').textContent += ' Record the details you remember, even when a photograph is unavailable. '+ 'AnUnusuallyLongUnbrokenExampleOfSupportingTextForWrappingChecks';`);
      checks.longText=await p.evaluate(geometry);await p.evaluate('window.scrollTo(0,0)');await capture(p,`${concept}-360-long-text.png`);
      checks.requests=p.requests;checks.exceptions=p.exceptions;report.interactions.push(checks);
      if(checks.longText.overflow||checks.longText.horizontalOutliers.length||checks.longText.clippedText.length||!checks.reopened||checks.headerKeyboardFocus.label!=='Get CatchID free'||checks.headerKeyboardFocus.outline!=='solid'||!checks.primaryKeyboardFocus.primary||checks.primaryKeyboardFocus.outline!=='solid'||checks.accepted.storage.length||checks.rejected.storage.length||checks.accepted.cookies||checks.rejected.cookies||p.exceptions.length)report.errors.push(`${concept}-interactions`);
      await browser.send('Target.closeTarget',{targetId:p.targetId});p.cdp.close();
    }
    for(const [width,height] of interactionsOnly?[]:[[390,844],[1440,1000]])for(const state of ['first','saved']){
      const p=await pageFor(width,height);
      await p.cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:state==='saved'?`localStorage.setItem('catchid.website.analytics','denied')`:`localStorage.removeItem('catchid.website.analytics')`});
      await p.cdp.send('Page.navigate',{url:`${origin}/baseline/`});await ready(p);const result=await p.evaluate(geometry);
      const screenshot=`baseline-${width}x${height}-${state}.png`;await capture(p,screenshot);report.cases.push({concept:'baseline',width,height,state,scale:1,screenshot,...result,requests:p.requests,exceptions:p.exceptions});
      await browser.send('Target.closeTarget',{targetId:p.targetId});p.cdp.close();
    }
  }
  await fs.writeFile(path.join(output,quick?'layout-first-pass.json':'browser-verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({browser:report.browser,cases:report.cases.length,errors:report.errors,externalRequests:report.externalRequests,cta:report.cases.filter(x=>x.width<=430&&x.scale===1).map(x=>({concept:x.concept,width:x.width,state:x.state,badgeBottom:x.primary?.bottom,consentBottom:x.consent?.bottom}))},null,2));
  if(report.errors.length||report.externalRequests.length)process.exitCode=1;
} finally {await browser.send('Browser.close').catch(()=>{});browser.close();chrome.kill();}
