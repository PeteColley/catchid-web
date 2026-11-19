import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(docs,'../..'),dist=path.join(repo,'dist');
const baseline='651ae58f39a8c2530fb600b35e91455c644351e8';
const approved='e5ccb55f338cd954d38c11b992f0bc48ac0d8a39';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const git=(...args)=>execFileSync('git',args,{cwd:repo,maxBuffer:20*1024*1024});
const source='src/assets/hero/photo-1-patagonia-savage-37096316.jpg';
const sourceBytes=await fs.readFile(path.join(repo,source));
assert.equal(hash(sourceBytes),'460e037b2ba3d9454d5ee668872bf7227c95599e928a49e299e4ef92533685b8');
assert.deepEqual(sourceBytes,git('show',approved+':docs/CID-WEB-CRO-05/assets/photo-1-patagonia-savage-37096316.jpg'));
const changed=['src/pages/index.astro','src/product-assets.ts'];
const protectedFiles=git('ls-tree','-r','--name-only',baseline).toString().trim().split('\n').filter(p=>!changed.includes(p));
for(const file of protectedFiles){
  // hash-object applies the existing checkout's text attributes, without rewriting it.
  const actual=git('hash-object','--path='+file,file).toString().trim();
  const expected=git('rev-parse',baseline+':'+file).toString().trim();
  assert.equal(actual,expected,'Protected baseline file changed: '+file);
}
const consentFile='src/components/WebAnalyticsConsent.astro';
const rawConsent=await fs.readFile(path.join(repo,consentFile));
// Compare fresh Windows checkouts; the older CRO-04 worktree uses LF locally.
// The protected Git blob check above is independent of checkout line endings.
const baselineConsent=await fs.readFile(path.resolve(repo,'../cid-web-cro-05',consentFile));
assert.deepEqual(rawConsent,baselineConsent,'Consent component checkout bytes unchanged');
const home=await fs.readFile(path.join(dist,'index.html'),'utf8');
const consentMarkup=html=>html.match(/<script id="catchid-web-analytics">([\s\S]*?)<\/script>/)[1];
const baselineHome=await fs.readFile(path.resolve(repo,'../cid-web-cro-05/dist/index.html'),'utf8');
assert.equal(consentMarkup(home),consentMarkup(baselineHome),'Production consent output is byte-identical');
assert.doesNotMatch(home,/AI concept|concept art|trout-concept|Hero_Desktop_Reference/i);
assert.equal((home.match(/class="hero-photograph"/g)||[]).length,1);
assert.match(home,/object-position:35% 50%/);
assert.match(home,/object-position:30% 50%/);
const journal=await fs.readFile(path.join(dist,'fishing-journal-app/index.html'));
assert.deepEqual(journal,await fs.readFile(path.resolve(repo,'../cid-web-cro-05/dist/fishing-journal-app/index.html')),'Landing build is identical to CRO-04');
const assetNames=await fs.readdir(path.join(dist,'_astro'));
assert.ok(!assetNames.some(n=>n.includes('trout-concept')),'No obsolete concept output');
const images=[];
for(const name of assetNames.filter(n=>n.startsWith('photo-1-'))){
  const bytes=await fs.readFile(path.join(dist,'_astro',name)),m=await sharp(bytes).metadata();
  assert.ok(m.width<=2400&&bytes.length<600000);
  images.push({path:'/_astro/'+name,width:m.width,height:m.height,format:m.format,bytes:bytes.length,sha256:hash(bytes)});
}
assert.equal(images.length,10);
for(const format of ['webp','jpeg'])assert.deepEqual(images.filter(i=>i.format===format).map(i=>i.width).sort((a,b)=>a-b),[600,900,1200,1800,2400]);
const comparisons=[];
for(const width of [390,1440])for(const state of ['first','saved']){
  const refName=`variant-a-${width}-${state}.png`,outName=`matrix-home-${width}x${width===390?844:1000}-${state}.png`;
  const reference=await fs.readFile(path.join(docs,'reference',refName));
  assert.deepEqual(reference,git('show',approved+':docs/CID-WEB-CRO-05/evidence/'+refName));
  const a=await sharp(reference).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const b=await sharp(path.join(docs,'evidence',outName)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.deepEqual(a.info,b.info);
  // Original photo box is unchanged, including the existing credit-label area.
  const box=width===390?{x:158,y:426,right:390,bottom:819}:{x:922,y:0,right:1417,bottom:791};
  let outside=0,inside=0;
  for(let y=0;y<a.info.height;y++)for(let x=0;x<width;x++){
    const n=(y*width+x)*4;
    if([0,1,2].some(c=>Math.abs(a.data[n+c]-b.data[n+c])>2)){
      if(x>=box.x&&x<box.right&&y>=box.y&&y<box.bottom)inside++;else outside++;
    }
  }
  assert.equal(outside,0,'Visual change outside approved photo frame: '+outName);
  comparisons.push({reference:refName,implementation:outName,referenceSha256:hash(reference),photoAndCreditChangedPixels:inside,changedPixelsOutsidePhotoFrame:outside,tolerance:2});
}
const report={baseline,approved,protectedBaselineFiles:protectedFiles.length,source:{path:source,bytes:sourceBytes.length,sha256:hash(sourceBytes)},consentGitBlobUnchanged:true,consentRenderedBytesUnchanged:true,consentRenderedSha256:hash(consentMarkup(home)),consentFreshCheckoutSha256:hash(rawConsent),journalBuiltHtmlIdentical:true,conceptAbsentFromBuild:true,images:images.sort((a,b)=>a.width-b.width||a.format.localeCompare(b.format)),comparisons};
await fs.writeFile(path.join(docs,'evidence/source-image-visual-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({protectedBaselineFiles:protectedFiles.length,images:images.length,visualComparisons:comparisons.length,outsidePhotoPixels:comparisons.map(x=>x.changedPixelsOutsidePhotoFrame),consentByteIdentical:true,journalBuiltHtmlIdentical:true,conceptAbsentFromBuild:true},null,2));
