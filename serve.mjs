// Tiny static server for dist/. Every route is a folder with index.html.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, 'dist'), port = process.env.PORT || 4173;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(root,p); if(!f.startsWith(root)){res.writeHead(403);return res.end();}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
  if(!fs.existsSync(f)){res.writeHead(404,{'content-type':types['.html']});return res.end(fs.readFileSync(path.join(root,'404.html')));}
  res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(res);
}).listen(port,()=>console.log('Taskote site on http://localhost:'+port));
