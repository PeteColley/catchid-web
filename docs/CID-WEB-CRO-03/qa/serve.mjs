import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.resolve(docs,'../../dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.md':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://127.0.0.1');
  const baseline=url.pathname.startsWith('/baseline/')||url.pathname.startsWith('/_astro/')||url.pathname.startsWith('/assets/')&&req.headers.referer?.includes('/baseline/');
  const base=baseline?dist:docs;
  let name=decodeURIComponent(url.pathname.replace(/^\/baseline\//,'/'));
  if(name.endsWith('/'))name+='index.html';
  const file=path.resolve(base,'.'+name);
  if(!file.startsWith(base+path.sep))throw Error('Outside review');
  const data=await fs.readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'"});res.end(data);
}catch{res.writeHead(404);res.end('Not found')}}).listen(4178,'127.0.0.1',()=>console.log('Local only http://127.0.0.1:4178/'));
