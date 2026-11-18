import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const origin='http://127.0.0.1:4178';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const chrome=spawn(process.env.CATCHID_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-sync','--disable-extensions','--hide-scrollbars','--remote-debugging-port=9337','--remote-debugging-address=127.0.0.1',`--user-data-dir=${path.resolve(docs,'../../.npm-cache/cro02-browser')}`],{windowsHide:true,stdio:'ignore'});
let version;for(let i=0;i<100;i++){try{version=await(await fetch('http://127.0.0.1:9337/json/version')).json();break;}catch{await pause(100);}}if(!version)throw Error('No browser');
const target=await(await fetch('http://127.0.0.1:9337/json/new?about:blank',{method:'PUT'})).json();
const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise(resolve=>socket.onopen=resolve);
let counter=0;const pending=new Map();const external=[];const exceptions=[];
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++counter;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});}
socket.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id){const item=pending.get(msg.id);pending.delete(msg.id);msg.error?item.reject(Error(JSON.stringify(msg.error))):item.resolve(msg.result);}else if(msg.method==='Fetch.requestPaused'){const r=msg.params;const allowed=r.request.url.startsWith(origin)||r.request.url.startsWith(pathToFileURL(docs).href)||r.request.url.startsWith('data:');if(allowed)send('Fetch.continueRequest',{requestId:r.requestId});else{external.push(r.request.url);send('Fetch.failRequest',{requestId:r.requestId,errorReason:'BlockedByClient'});}}else if(msg.method==='Runtime.exceptionThrown')exceptions.push(msg.params.exceptionDetails.text);};
async function evaluate(expression){const v=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(v.exceptionDetails)throw Error(v.exceptionDetails.exception?.description||v.exceptionDetails.text);return v.result.value;}
async function screenshot(name,clip){const data=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:Boolean(clip),...(clip?{clip}:{} )});await fs.writeFile(path.join(docs,'evidence',name),Buffer.from(data.data,'base64'));}
await send('Page.enable');await send('Runtime.enable');await send('Fetch.enable');
const results=[];
try{
  for(const entry of [{file:'index.html',width:1440,height:1440,mode:'http'},{file:'index.html',width:390,height:844,mode:'http'},{file:'responsive.html',width:1440,height:1000,mode:'http'},{file:'index.html',width:1440,height:1000,mode:'file'},{file:'concept-a.html?consent=saved',width:390,height:844,mode:'file'},{file:'concept-b.html?consent=first',width:390,height:844,mode:'file'}]){
    await send('Emulation.setDeviceMetricsOverride',{width:entry.width,height:entry.height,deviceScaleFactor:1,mobile:false});
    const url=entry.mode==='file'?pathToFileURL(path.join(docs,entry.file.split('?')[0])).href+(entry.file.includes('?')?'?'+entry.file.split('?')[1]:''):origin+'/'+entry.file;
    await send('Page.navigate',{url});
    for(let i=0;i<100;i++){if(await evaluate(`document.readyState==='complete' && !!document.querySelector('h1')`))break;await pause(50);}
    await evaluate(`Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));`);
    const result=await evaluate(`({url:location.protocol+'//'+(location.host||'local-file')+'/'+location.pathname.split('/').pop(),width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,allImagesLoaded:[...document.images].every(i=>i.complete&&i.naturalWidth>0),title:document.title,bodyFont:getComputedStyle(document.body).fontFamily,consentHidden:document.querySelector('[data-consent]')?.hidden})`);
    if(entry.mode==='file'&&entry.file.startsWith('concept-b')){await evaluate(`document.querySelector('[data-consent-choice="accepted"]').click()`);result.fileInteractionWorks=await evaluate(`document.querySelector('[data-consent]').hidden`);}
    results.push({...entry,...result});
    if(entry.mode==='http'&&entry.file==='index.html')await screenshot(`gallery-${entry.width}.png`);
    if(entry.file==='responsive.html'){
      await evaluate(`document.querySelectorAll('.matrix-section').forEach(s=>{const p=document.createElement('p');p.textContent='DESIGN CONCEPT — NOT LIVE';p.style.cssText='color:#006a75;font-size:14px;font-weight:bold;padding-bottom:12px';s.prepend(p);});`);
      for(const id of ['mobile','intermediate','large','baseline']){
        const clip=await evaluate(`(()=>{const r=document.getElementById('${id}').getBoundingClientRect();return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height,scale:1};})()`);
        await screenshot(`contact-${id}.png`,clip);
      }
    }
  }
  const report={label:'DESIGN CONCEPT — NOT LIVE',browser:version.Browser,results,externalRequests:external,pageExceptions:exceptions};
  await fs.writeFile(path.join(docs,'evidence/review-verification.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  if(results.some(r=>r.overflow||!r.allImagesLoaded||r.fileInteractionWorks===false)||external.length||exceptions.length)process.exitCode=1;
}finally{await send('Browser.close').catch(()=>{});socket.close();chrome.kill();}
