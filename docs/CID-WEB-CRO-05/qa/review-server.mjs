// Loopback-only photo comparison. Reads the baseline build; never writes production files.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const docs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(docs,'../..');
const source=await fs.readFile(path.join(repo,'dist/index.html'),'utf8');
const photoBlock=/<div class="river-photo\s*">[\s\S]*?<\/div>/;
if(!photoBlock.test(source))throw Error('Baseline hero photograph not found');
const photos={
  a:{file:'photo-1-patagonia-savage-37096316.jpg',position:'35% 50%',mobile:'30% 50%',scale:1,alt:'Brown trout held at the river waterline. Photograph by Patagonia Savage on Pexels.'},
  b:{file:'photo-3-giant-asparagus-35437559.jpg',position:'54% 50%',mobile:'50% 50%',scale:1.25,alt:'An angler holding a brown trout above a net in a river. Photograph by Giant Asparagus on Pexels.'}
};
export function variant(key){
  const p=photos[key];if(!p)throw Error('Unknown photo');
  const style=`<style id="cro05-photo-treatment">.hero-proof .river-photo>img{display:block;width:100%;height:100%;max-width:none;object-fit:cover;object-position:${p.position};transform:scale(${p.scale});transform-origin:60% 38%}@media(max-width:760px){.hero-proof .river-photo>img{object-position:${p.mobile}}}</style>`;
  return source.replace(photoBlock,`<div class="river-photo"><img src="/review/assets/${p.file}" alt="${p.alt}" decoding="async" fetchpriority="high"></div>`)
    .replace('Concept art — not publication approved','Photo candidate — review only')
    .replace('</head>',style+'</head>');
}
export const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1:4185');
    if(!['127.0.0.1:4185','localhost:4185'].includes(req.headers.host)){res.writeHead(403);res.end();return;}
    const key=url.searchParams.get('photo');
    let file,body;
    if(url.pathname==='/'&&key){body=variant(key);file='index.html';}
    else{
      const isReview=url.pathname.startsWith('/review/');
      const root=isReview?docs:path.join(repo,'dist');
      let relative=decodeURIComponent(isReview?url.pathname.slice(8):url.pathname.slice(1));
      if(!relative||relative.endsWith('/'))relative+='index.html';
      file=path.resolve(root,relative);
      if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
      body=await fs.readFile(file);
    }
    const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.mjs':'application/javascript','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.md':'text/plain; charset=utf-8'};
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'none'; frame-ancestors 'self'"});
    res.end(body);
  }catch(error){res.writeHead(404);res.end('Review resource unavailable');}
});
if(process.argv[1]===fileURLToPath(import.meta.url)){
  server.listen(4185,'127.0.0.1',()=>console.log('DESIGN ONLY: http://127.0.0.1:4185/review/ — A /?photo=a · B /?photo=b'));
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
}
// Removing only the explicitly authorised image/metadata changes must recover the baseline.
for(const key of Object.keys(photos)){
  const normalised=variant(key).replace(/<style id="cro05-photo-treatment">[\s\S]*?<\/style>/,'').replace(photoBlock,source.match(photoBlock)[0]).replace('Photo candidate — review only','Concept art — not publication approved');
  if(normalised!==source)throw Error('Unintended non-photo change');
}
export const baselineHash=createHash('sha256').update(source).digest('hex');
