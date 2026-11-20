// Loopback-only static build/evidence review; no deployment facility.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'dist'),port=Number(process.argv[3]||4188);
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain'};
http.createServer(async(req,res)=>{
  try {
    const requestPath=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    // Chromium requests /favicon.ico on the standalone existing Insights PNG.
    // Use the build's actual icon for this local review server's implicit probe.
    const icon=requestPath==='/favicon.ico'?(await fs.readdir(path.join(root,'_astro'))).find(n=>n.startsWith('catchid-icon.')&&n.endsWith('.png')):null;
    let file=icon?path.join(root,'_astro',icon):path.resolve(root,'.'+requestPath);
    if(path.relative(root,file).startsWith('..'))throw Error('Outside review root');
    if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');
    res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
    res.end(await fs.readFile(file));
  }catch{res.statusCode=404;res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log('Local review on 127.0.0.1:'+port));
