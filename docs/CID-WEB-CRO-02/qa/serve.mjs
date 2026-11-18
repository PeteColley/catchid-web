import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(docs, '../..');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.md':'text/plain; charset=utf-8'};
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    const isBaseline = url.pathname.startsWith('/baseline/') || url.pathname.startsWith('/_astro/');
    const base = isBaseline ? path.join(repo,'dist') : docs;
    let name = decodeURIComponent(url.pathname.replace(/^\/baseline\//,'/'));
    if (name.endsWith('/')) name += 'index.html';
    const file = path.resolve(base, '.' + name);
    if (!file.startsWith(base + path.sep)) throw new Error('outside served directory');
    let data = await fs.readFile(file);
    // Label the baseline only in the QA HTTP response. Its source and build files stay untouched.
    if (isBaseline && file.endsWith('.html')) {
      data = Buffer.from(data.toString().replace(/<body[^>]*>/, match => `${match}<style>.qa-review-label{box-sizing:border-box;padding:8px 32px;background:#eaf2f3;color:#234c53;font:700 12px/20px Arial}@media(max-width:699px){.qa-review-label{padding:7px 20px;font-size:11px}}</style><div class="qa-review-label">DESIGN CONCEPT — NOT LIVE</div>`));
    }
    response.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'"});
    response.end(data);
  } catch {response.writeHead(404);response.end('Not found');}
});
server.listen(4178,'127.0.0.1',()=>console.log('Local review: http://127.0.0.1:4178/'));
