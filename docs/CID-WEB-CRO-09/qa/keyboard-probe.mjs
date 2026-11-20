import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const runtime=path.resolve('../cro09-runtime');process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(runtime,'browsers');
const {webkit}=await import(pathToFileURL(path.join(runtime,'tools/node_modules/playwright/index.mjs')));
const browser=await webkit.launch();const result={engine:browser.version(),sequences:[]};
for(const key of ['Tab','Alt+Tab']){
 const context=await browser.newContext({viewport:{width:320,height:720}});const p=await context.newPage();await p.goto('http://127.0.0.1:4191/');const steps=[];
 for(let n=0;n<16;n++){await p.keyboard.press(key);steps.push(await p.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.getAttribute('aria-label')||document.activeElement.textContent.trim().slice(0,80),id:document.activeElement.id,outline:getComputedStyle(document.activeElement).outlineStyle})));}
 result.sequences.push({key,steps});await context.close();
}
await fs.writeFile('docs/CID-WEB-CRO-09/evidence/webkit/keyboard-probe.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));await browser.close();
