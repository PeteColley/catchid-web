// Review-only harness. Uses externally supplied Playwright; adds no site dependency.
// All non-loopback requests are intercepted before any navigation or measurement.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const repo = process.cwd();
const out = path.join(repo, 'docs/CID-GROWTH-02/evidence');
await fs.mkdir(out, {recursive: true});
const { chromium } = await import(pathToFileURL(process.env.CATCHID_QA_PLAYWRIGHT));
const report = { browser: '', method: 'Isolated desktop Chromium; CSS viewport and effective text scaling; mocked GA, no production traffic', cases: [], interactions: [], blocked: [], loaderMocks: 0, failures: [], pageErrors: [] };
const servers = [];
async function serve(root) {
  const mime = {'.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.xml':'application/xml', '.txt':'text/plain'};
  const server = http.createServer(async (req,res) => {
    try {
      const filePath = path.resolve(root, '.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
      if (path.relative(root,filePath).startsWith('..')) throw Error('Outside root');
      const file = (await fs.stat(filePath)).isDirectory() ? path.join(filePath,'index.html') : filePath;
      res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
      res.end(await fs.readFile(file));
    } catch { res.statusCode=404; res.end('Not found'); }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
}
const origin = await serve(path.join(repo,'dist'));
const baseline = await serve(path.join(repo,'.npm-cache/baseline-dist'));
const browser = await chromium.launch({executablePath:process.env.CATCHID_QA_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--disable-sync']});
report.browser = browser.version();
const key = 'catchid.website.analytics';
const guide = '/guides/how-to-keep-a-fishing-journal/';
const routes = [['home','/',2],['journal','/fishing-journal-app/',2],['guide',guide,1]];
const check = (pass,message)=>{if(!pass)report.failures.push(message);};
async function pageFor(width, state='first', javaScriptEnabled=true) {
  const context = await browser.newContext({viewport:{width,height:width<768?844:1000},deviceScaleFactor:1,javaScriptEnabled,reducedMotion:'reduce'});
  const requests=[];
  await context.route('**/*',async route=>{
    const url=route.request().url();
    if ([origin,baseline].includes(new URL(url).origin)) return route.continue();
    if (url==='https://www.googletagmanager.com/gtag/js?id=G-LPXGL5VTB1') {
      report.loaderMocks++;
      const choice=await route.request().frame().evaluate(k=>localStorage.getItem(k),key);
      check(choice==='granted','GA loader must require saved consent');
      return route.fulfill({contentType:'application/javascript',body:'/* inert QA library: no network, no cookies */'});
    }
    report.blocked.push(url);
    return route.abort('blockedbyclient');
  });
  if(state!=='first')await context.addInitScript(({key,state})=>localStorage.setItem(key,state),{key,state});
  const page=await context.newPage();
  page.on('pageerror',err=>report.pageErrors.push(err.message));
  page.on('request',r=>requests.push(r.url()));
  return {page,context,requests};
}
async function ready(page,url) {
  await page.goto(url,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));
  });
}
async function scaleText(page,factor) {
  await page.evaluate(factor=>{
    const nodes=[...document.querySelectorAll('body,body *')].filter(e=>!e.closest('svg'));
    const values=nodes.map(e=>({font:parseFloat(getComputedStyle(e).fontSize),line:getComputedStyle(e).lineHeight}));
    nodes.forEach((e,i)=>{e.style.fontSize=values[i].font*factor+'px';if(values[i].line!=='normal')e.style.lineHeight=parseFloat(values[i].line)*factor+'px';});
  },factor);
}
async function shot(page,name,selector=null) {
  if(selector)await page.locator(selector).screenshot({path:path.join(out,name),animations:'disabled'});
  else await page.screenshot({path:path.join(out,name),fullPage:true,animations:'disabled'});
}
try {
  // The before/after review uses the exact built baseline retained before edits.
  for(const [label,url] of [['before',baseline],['after',origin]]) for(const width of [390,1440]) {
    const {page,context}=await pageFor(width,'denied');
    await ready(page,url+'/fishing-journal-app/');
    await shot(page,`${label}-journal-link-${width}.png`,'.guide-note');
    await shot(page,`${label}-journal-section-${width}.png`,'.journal-guide');
    for(const [route,urlPath] of [['home','/'],['journal','/fishing-journal-app/']]){
      await ready(page,url+urlPath);
      await shot(page,`${label}-${route}-footer-${width}.png`,'.site-footer');
    }
    await context.close();
  }
  for(const [name,urlPath,badges] of routes) for(const width of [320,360,390,430,768,900,1024,1440]) for(const state of ['first','denied','granted']) for(const scale of [1,1.6]) {
    const {page,context,requests}=await pageFor(width,state);
    await ready(page,origin+urlPath);
    if(scale!==1)await scaleText(page,scale);
    const result=await page.evaluate(()=>{
      const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
      const panel=document.querySelector('#analytics-consent');
      const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
      return {
        viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,
        h1:document.querySelector('h1').textContent,consentHidden:panel.hidden,
        consentButtons:[...panel.querySelectorAll('button')].map(rect),
        badges:document.querySelectorAll('a.play-badge').length,
        badImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
        badAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),
        clipped:[...document.querySelectorAll('body *')].filter(e=>visible(e)&&e.children.length===0&&e.textContent.trim()&&['hidden','clip'].includes(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2&&!e.closest('thead')).map(e=>e.className),
        headerOverlap:(()=>{const b=rect(document.querySelector('.site-header .brand')),n=document.querySelector('.site-header>nav');return getComputedStyle(n).display!=='none'&&b.right+12>rect(n).x;})(),
        cookies:document.cookie,loaders:document.querySelectorAll('script[src]').length,
        storedKeys:Object.keys(localStorage),printVisible:!!document.querySelector('#print-worksheet:not([hidden])')
      };
    });
    const label=`${name} ${width} ${state} text${scale}`;
    check(result.scrollWidth<=width,`${label}: horizontal overflow ${result.scrollWidth}`);
    check(!result.badImages.length&&!result.badAnchors.length&&!result.clipped.length&&!result.headerOverlap,`${label}: assets/anchors/clipping/header`);
    check(result.badges===badges,`${label}: badge count`);
    check(result.consentHidden===(state!=='first'),`${label}: consent state`);
    check(result.loaders===(state==='granted'?1:0),`${label}: loader gating`);
    check(result.cookies==='',`${label}: no QA cookies`);
    if(state==='first'){
      const [a,b]=result.consentButtons;
      check(Math.abs(a.width-b.width)<1&&Math.abs(a.height-b.height)<1,`${label}: equal consent choices`);
    }
    check(requests.every(url=>url.startsWith(origin)||state==='granted'&&url.startsWith('https://www.googletagmanager.com/gtag/js?')),`${label}: unexpected resource`);
    if(name==='guide')check(result.printVisible,`${label}: enabled print button`);
    report.cases.push({name,width,state,scale,...result});
    if(name==='guide'&&scale===1&&state==='denied'&&[390,768,1440].includes(width)){
      await shot(page,`guide-${width}-complete.png`);
      await shot(page,`worksheet-${width}.png`,'#worksheet');
      if(width===390||width===1440)for(const id of ['example-record','read-your-records','download'])await shot(page,`${id}-${width}.png`,'#'+id);
    }
    if(name==='guide'&&width===320&&state==='first')await page.screenshot({path:path.join(out,`guide-320-first-text${scale}.png`)});
    await context.close();
    if(report.cases.length%24===0)console.log(`Checked ${report.cases.length}/144 responsive cases`);
  }
  // Actual browser keyboard interaction, navigation, consent withdrawal and attribution.
  for(const [name,urlPath,badgeCount] of routes) {
    const {page,context}=await pageFor(390);
    await ready(page,origin+urlPath);
    await page.keyboard.press('Tab');
    check(await page.locator('.skip').evaluate(e=>e===document.activeElement),`${name}: skip link first`);
    await page.keyboard.press('Enter');
    check(await page.locator('#main').evaluate(e=>e===document.activeElement),`${name}: skip destination`);
    await page.locator('.mobile-menu summary').focus();
    await page.keyboard.press('Enter');
    check(await page.locator('.mobile-menu').evaluate(e=>e.open),`${name}: keyboard menu opens`);
    for(const link of await page.locator('.mobile-menu a').all()){
      const dest=new URL(await link.getAttribute('href'),origin+urlPath);
      const response=await context.request.get(dest.href.split('#')[0]);
      check(response.ok(),`${name}: nav route ${dest.href}`);
      if(dest.hash)check((await response.text()).includes(`id="${dest.hash.slice(1)}"`),`${name}: nav anchor ${dest.hash}`);
    }
    await page.locator('.mobile-menu a').first().click();
    await page.waitForURL(origin+'/#record');
    check(await page.locator('#record').count()===1,`${name}: mobile destination works`);
    await ready(page,origin+urlPath);
    await page.locator('#analytics-reject').focus();
    await page.keyboard.press('Enter');
    await page.reload();
    check(await page.locator('#analytics-consent').isHidden(),`${name}: rejection persists`);
    await page.locator('#analytics-choices').focus();await page.keyboard.press('Enter');
    check(await page.locator('#analytics-title').evaluate(e=>e===document.activeElement),`${name}: reopen focuses title`);
    await page.locator('#analytics-accept').focus();await page.keyboard.press('Enter');
    await page.waitForFunction(()=>[...(window.dataLayer||[])].some(a=>a[0]==='config'));
    check(await page.locator('#analytics-choices').evaluate(e=>e===document.activeElement),`${name}: focus returns after consent`);
    await page.reload({waitUntil:'networkidle'});
    check(await page.evaluate(()=>[...window.dataLayer].filter(a=>a[0]==='config').length)===1,`${name}: saved acceptance starts once`);
    await context.addCookies([{name:'_ga',value:'controlled-qa',url:origin},{name:'_ga_LPXGL5VTB1',value:'controlled-qa',url:origin}]);
    await page.locator('#analytics-choices').click();await page.locator('#analytics-reject').click();
    check((await context.cookies()).length===0,`${name}: withdrawal clears GA cookies`);
    check(await page.evaluate(()=>window['ga-disable-G-LPXGL5VTB1'])===true,`${name}: withdrawal disables analytics`);
    // Complete inbound UTM fixture is artificial and never sent to Google.
    const incoming={utm_source:'qa_fixture',utm_medium:'test',utm_campaign:'journal & guide',utm_content:'reader',gclid:'controlled-test',gbraid:'controlled-test-braid'};
    for(const choice of ['denied','granted']){
      await page.evaluate(({key,choice})=>localStorage.setItem(key,choice),{key,choice});
      await ready(page,origin+urlPath+'?'+new URLSearchParams(incoming));
      await page.evaluate(()=>window.addEventListener('click',e=>{if(e.target.closest('a.play-link'))e.preventDefault();}));
      for(let i=0;i<badgeCount;i++){
        const link=page.locator('a.play-link').nth(i);
        const before=await link.getAttribute('href');
        await link.focus();await page.keyboard.press('Enter');
        const after=await link.getAttribute('href');
        const ref=Object.fromEntries(new URLSearchParams(new URL(after).searchParams.get('referrer')));
        check(choice==='denied'?before===after:JSON.stringify(ref)===JSON.stringify(incoming),`${name}: ${choice} nested referrer ${i}`);
        check(new URL(after).searchParams.get('id')==='com.catchid.app',`${name}: exact Play package`);
        const count=await page.evaluate(()=>[...(window.dataLayer||[])].filter(a=>a[0]==='event'&&a[1]==='play_store_click').length);
        check(count===(choice==='granted'?i+1:0),`${name}: consent-gated click ${i}`);
      }
    }
    report.interactions.push(`${name}: keyboard, menu, consent persistence/withdrawal/focus, all badges/referrers passed`);
    await context.close();
  }
  const {page,context}=await pageFor(390);
  await ready(page,origin+guide);
  await page.evaluate(()=>{window.qaPrintCalls=0;window.print=()=>window.qaPrintCalls++;});
  await page.locator('#print-worksheet').focus();await page.keyboard.press('Enter');
  check(await page.evaluate(()=>window.qaPrintCalls)===1,'Print button keyboard activation uses native print');
  // This PDF is rendered by the browser print engine, not a screenshot of print CSS.
  await page.pdf({path:path.join(out,'catch-log-a4-landscape.pdf'),preferCSSPageSize:true,printBackground:false,displayHeaderFooter:false});
  await page.emulateMedia({media:'print'});
  const print=await page.evaluate(()=>({rows:[...document.querySelectorAll('.catch-log tbody tr')].filter(e=>e.getClientRects().length).length,consentVisible:document.querySelector('#analytics-consent').getClientRects().length>0,footerVisible:document.querySelector('.site-footer').getClientRects().length>0,badgeVisible:document.querySelector('.play-link').getClientRects().length>0}));
  check(print.rows===5&&!print.consentVisible&&!print.footerVisible&&!print.badgeVisible,'Print from first-visit mobile includes five rows and no consent/navigation/promotion');
  report.print=print;
  await context.close();
  const nojs=await pageFor(390,'first',false);
  await nojs.page.goto(origin+guide);
  check(await nojs.page.locator('#print-worksheet').isHidden(),'No-JS hides inactive print control');
  check(await nojs.page.locator('noscript').innerText().then(t=>t.includes('Print menu')),'No-JS print-menu explanation');
  check(await nojs.page.locator('#analytics-consent').isHidden(),'No-JS analytics remains off');
  await nojs.page.pdf({path:path.join(out,'catch-log-no-js.pdf'),preferCSSPageSize:true,printBackground:false,displayHeaderFooter:false});
  await nojs.context.close();
  // Shared-content regression: existing-page content is identical outside the requested link.
  for(const route of ['/','/fishing-journal-app/']){
    const {page,context}=await pageFor(1440,'denied');
    const parts=[];
    for(const host of [baseline,origin]){
      await ready(page,host+route);
      parts.push(await page.locator('main').evaluate(main=>{const clone=main.cloneNode(true);clone.querySelectorAll('a[href="/guides/how-to-keep-a-fishing-journal/"]').forEach(a=>a.closest('p')?.remove());return clone.outerHTML;}));
    }
    check(parts[0]===parts[1],`${route}: main content unchanged outside restrained link`);
    await context.close();
  }
  check(report.pageErrors.length===0,'No runtime exceptions');
  check(report.blocked.length===0,'No unexpected outbound requests');
} finally {
  await fs.writeFile(path.join(out,'browser-report.json'),JSON.stringify(report,null,2)+'\n');
  await browser.close();
  await Promise.all(servers.map(s=>new Promise(r=>s.close(r))));
}
console.log(JSON.stringify({browser:report.browser,cases:report.cases.length,interactions:report.interactions,failures:report.failures,pageErrors:report.pageErrors,blocked:report.blocked},null,2));
assert.equal(report.failures.length,0,'Browser review failures');
