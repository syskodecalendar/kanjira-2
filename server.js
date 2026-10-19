// Dependency-free production server for Render or local use.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.pdf':'application/pdf', '.txt':'text/plain' };
http.createServer((req,res) => {
  try {
    const requested = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (requested !== root && !requested.startsWith(root + path.sep)) { res.writeHead(403);res.end('Forbidden');return; }
    const file = fs.existsSync(requested) && fs.statSync(requested).isFile() ? requested : path.join(root,'index.html');
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff' });
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(400);res.end('Bad request'); }
}).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Luxeves demo is ready.'));
