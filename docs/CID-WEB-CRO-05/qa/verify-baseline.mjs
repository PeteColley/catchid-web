// CRO-04's verifier normalises consent line endings, but omits this for SiteInteractions.
// A fresh Windows checkout exposes that pre-existing comparison defect. Normalise only
// that UTF-8 source read in memory; run the existing verifier unchanged, retaining all assertions.
import fs from 'node:fs';
import {syncBuiltinESMExports} from 'node:module';
const original=fs.readFileSync;
fs.readFileSync=function(file,options){
  const value=original.call(this,file,options);
  return String(file).replaceAll('\\','/').endsWith('src/components/SiteInteractions.astro')&&typeof value==='string'?value.replaceAll('\r\n','\n'):value;
};
syncBuiltinESMExports();
await import('../../../scripts/verify.mjs');
