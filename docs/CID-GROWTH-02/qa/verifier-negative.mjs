// Mutate only disposable generated output, restore it after every expected failure.
// Do not run concurrently with browser review/builds.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const guide='dist/guides/how-to-keep-a-fishing-journal/index.html';
const original=fs.readFileSync(guide,'utf8');
const probes=[
  ['Missing catch row',s=>s.replace(/<tr role="row" aria-label="Catch 5">[\s\S]*?<\/tr>/,''),'Five usable blank catch rows'],
  ['Wrong guide campaign',s=>s.replaceAll('fishing_journal_guide','wrong_campaign'),'exact Play attribution'],
  ['Broken nested navigation',s=>s.replace('href="/#insights"','href="#missing-insights"'),'Anchor exists'],
  ['Changed consent runtime',s=>s.replace("const measurementId = 'G-LPXGL5VTB1'","const measurementId = 'G-XXXXXXXXXX'"),'exact shared implementation'],
  ['Extra guide badge',s=>s.replace('</main>',s.match(/<a class="play-link play-badge"[\s\S]*?<\/a>/)[0]+'</main>'),'intended official badges'],
  ['Rejected no-photo artwork',s=>s.replace('</main>','<p>save-catch-no-photo</p></main>'),'No rejected no-photo'],
];
const results=[];
try {
  for(const [name,mutate,expected] of probes){
    const changed=mutate(original);assert.notEqual(changed,original,name+' applied');
    fs.writeFileSync(guide,changed);
    const run=spawnSync(process.execPath,['scripts/verify.mjs'],{encoding:'utf8'});
    assert.notEqual(run.status,0,name+' must fail');
    assert.ok(run.stderr.includes(expected),name+' rejected for the expected reason: '+run.stderr);
    results.push({name,result:'correctly rejected',assertion:expected});
    fs.writeFileSync(guide,original);
  }
} finally { fs.writeFileSync(guide,original); }
fs.writeFileSync('docs/CID-GROWTH-02/evidence/verifier-negative.json',JSON.stringify(results,null,2)+'\n');
console.log('PASS: six deliberate regressions rejected; generated output restored byte-for-byte.');
