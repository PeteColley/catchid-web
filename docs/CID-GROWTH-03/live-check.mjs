// Focused public readback. Every external browser request is intercepted.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const out='docs/CID-GROWTH-03/evidence';
const origin='https://catchid.app';
const guide='/guides/how-to-keep-a-fishing-journal/';
const key='catchid.website.analytics';
const report={started:new Date().toISOString(),method:'Public HTTPS readback; Chromium with all external traffic intercepted, inert GA loader and prevented Play navigation. No real acquisition/analytics submissions.',files:[],routes:[],browserCases:[],interactions:[],errors:[],blocked:[],mockedGa:0};
const sha=b=>createHash('sha256').update(b).digest('hex');
const walk=async dir=>(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();
for(const file of await walk('dist')){
  const rel=path.relative('dist',file).replaceAll('\\','/');
  const route=rel.endsWith('index.html')?'/'+rel.slice(0,-10):'/'+rel;
  const response=await fetch(origin+route,{cache:'no-store'});
  const body=Buffer.from(await response.arrayBuffer());
  const expected=await fs.readFile(file);
  const item={route,status:response.status,bytes:body.length,sha256:sha(body),expected:sha(expected),match:body.equals(expected),contentType:response.headers.get('content-type'),robotsHeader:response.headers.get('x-robots-tag')};
  report.files.push(item);
  assert.equal(response.status,200,route);assert(item.match,'Live output mismatch '+route);
  assert(!/noindex/i.test(item.robotsHeader||''),route+' noindex header');
}
const {chromium}=await import(pathToFileURL(process.env.CATCHID_QA_PLAYWRIGHT));
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-networking','--disable-component-update','--disable-sync']});
report.browser=browser.version();
async function contextFor(width){
  const context=await browser.newContext({viewport:{width,height:width<768?844:1000},deviceScaleFactor:1,reducedMotion:'reduce',serviceWorkers:'block'});
  await context.route('**/*',async route=>{
    const url=route.request().url();
    if(new URL(url).origin===origin)return route.continue();
    if(url==='https://www.googletagmanager.com/gtag/js?id=G-LPXGL5VTB1'){
      assert.equal(await route.request().frame().evaluate(k=>localStorage.getItem(k),key),'granted');
      report.mockedGa++;
      return route.fulfill({contentType:'application/javascript',body:'/* inert QA loader; no collection or cookies */'});
    }
    report.blocked.push(url);return route.abort('blockedbyclient');
  });
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  return {context,page};
}
async function ready(page,url){
  const response=await page.goto(url,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
}
try{
  for(const [name,route,badges,campaign,medium] of [['home','/',2,'website_launch','referral'],['journal','/fishing-journal-app/',2,'fishing_journal_app','organic'],['guide',guide,1,'fishing_journal_guide','organic']]){
    for(const width of [390,1440]){
      const {context,page}=await contextFor(width);
      await ready(page,origin+route);
      const state=await page.evaluate(()=>({title:document.title,canonical:document.querySelector('link[rel="canonical"]').href,noindex:[...document.querySelectorAll('meta[name="robots"]')].some(e=>/noindex/i.test(e.content)),badges:document.querySelectorAll('.play-badge').length,badImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),overflow:document.documentElement.scrollWidth>innerWidth,consentVisible:!document.querySelector('#analytics-consent').hidden,loaders:document.querySelectorAll('script[src]').length,badAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)}));
      assert.equal(state.canonical,origin+route);assert.equal(state.badges,badges);assert(!state.noindex&&!state.overflow&&state.consentVisible&&!state.loaders&&!state.badImages.length&&!state.badAnchors.length);
      assert.equal(await page.locator('.site-footer a[href="'+guide+'"]').count(),1);
      if(name==='journal')assert.equal(await page.locator('main a[href="'+guide+'"]').count(),1);
      for(const href of await page.locator('a.play-link').evaluateAll(links=>links.map(a=>a.href))){
        const url=new URL(href);assert.equal(url.origin,'https://play.google.com');assert.equal(url.searchParams.get('id'),'com.catchid.app');
        const expected={utm_source:'catchid_website',utm_medium:medium,utm_campaign:campaign};
        assert.deepEqual(Object.fromEntries(new URLSearchParams(url.searchParams.get('referrer'))),expected);
        for(const [k,v] of Object.entries(expected))assert.equal(url.searchParams.get(k),v);
      }
      if(name==='guide')await page.screenshot({path:path.join(out,`live-guide-${width}-first.png`),fullPage:true});
      await page.locator('#analytics-reject').click();await ready(page,origin+route);
      assert(await page.locator('#analytics-consent').isHidden());
      if(name==='guide'){
        assert(await page.locator('.play-badge img').evaluate(i=>i.complete&&i.naturalWidth>0));
        await page.screenshot({path:path.join(out,`live-guide-${width}.png`),fullPage:true});
        await page.locator('#worksheet').screenshot({path:path.join(out,`live-worksheet-${width}.png`)});
        await page.locator('#download').screenshot({path:path.join(out,`live-download-${width}.png`)});
      }
      if(width===390){
        await page.locator('#analytics-choices').focus();await page.keyboard.press('Enter');
        assert(await page.locator('#analytics-title').evaluate(e=>e===document.activeElement));
        await page.locator('#analytics-accept').click();
        await page.waitForFunction(()=>[...(window.dataLayer||[])].some(a=>a[0]==='config'));
        await page.reload({waitUntil:'networkidle'});
        assert.equal(await page.evaluate(()=>[...window.dataLayer].filter(a=>a[0]==='config').length),1);
        await page.evaluate(()=>window.addEventListener('click',e=>{if(e.target.closest('a.play-link'))e.preventDefault();}));
        for(let i=0;i<badges;i++){await page.locator('a.play-link').nth(i).focus();await page.keyboard.press('Enter');}
        assert.equal(await page.evaluate(()=>[...window.dataLayer].filter(a=>a[0]==='event'&&a[1]==='play_store_click').length),badges);
        await context.addCookies([{name:'_ga',value:'controlled-qa',url:origin},{name:'_ga_LPXGL5VTB1',value:'controlled-qa',url:origin}]);
        await page.locator('#analytics-choices').click();await page.locator('#analytics-reject').click();
        assert.equal((await context.cookies()).length,0);assert(await page.evaluate(()=>window['ga-disable-G-LPXGL5VTB1']));
        await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('script[src]').count(),0);
        const footer=page.locator('.site-footer a[href="'+guide+'"]');await footer.click();await page.waitForURL(origin+guide);
        if(name==='journal'){await ready(page,origin+route);await page.locator('main a[href="'+guide+'"]').click();await page.waitForURL(origin+guide);}
        report.interactions.push(name+': consent default-off, deny/accept persistence, keyboard focus, inert loader, all Play clicks locally captured, withdrawal/cookie cleanup and crawlable guide links passed');
      }
      report.browserCases.push({name,width,...state});await context.close();
    }
    report.routes.push({name,route,badges,campaign,medium});
  }
  const {context,page}=await contextFor(390);await ready(page,origin+guide);
  await page.evaluate(()=>{window.qaPrintCalls=0;window.print=()=>window.qaPrintCalls++;});
  await page.locator('#print-worksheet').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>window.qaPrintCalls),1);
  await page.pdf({path:path.join(out,'live-catch-log-a4-landscape.pdf'),preferCSSPageSize:true,printBackground:false,displayHeaderFooter:false});
  await page.emulateMedia({media:'print'});
  report.print=await page.evaluate(()=>({visibleRows:[...document.querySelectorAll('.catch-log tbody tr')].filter(e=>e.getClientRects().length).length,consentVisible:document.querySelector('#analytics-consent').getClientRects().length>0,footerVisible:document.querySelector('.site-footer').getClientRects().length>0,badgeVisible:document.querySelector('.play-link').getClientRects().length>0}));
  assert.deepEqual(report.print,{visibleRows:5,consentVisible:false,footerVisible:false,badgeVisible:false});await context.close();
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.blocked,[]);
  report.completed=new Date().toISOString();report.result='PASS';
}catch(error){report.result='FAIL';report.failure=error.stack;throw error;}
finally{await browser.close();await fs.writeFile(path.join(out,'live-verification.json'),JSON.stringify(report,null,2)+'\n');}
console.log('PASS: all 34 live files match clean build; 6 public desktop/mobile cases; consent, 2/2/1 badges, nested referrers, links, assets and live print.');
