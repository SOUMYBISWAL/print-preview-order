import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const CLIENT_DIR = path.join(__dirname, 'client');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(CLIENT_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Handle node_modules requests
  if (req.url.startsWith('/node_modules/')) {
    filePath = path.join(__dirname, req.url);
  }
  
  // Handle src requests
  if (req.url.startsWith('/src/')) {
    filePath = path.join(CLIENT_DIR, req.url);
  }
  
  // Handle assets requests
  if (req.url.startsWith('/assets/')) {
    filePath = path.join(__dirname, 'attached_assets', req.url.replace('/assets/', ''));
  }
  
  // SPA fallback - serve index.html for routes that don't exist as files
  if (!fs.existsSync(filePath) && !req.url.includes('.')) {
    filePath = path.join(CLIENT_DIR, 'index.html');
  }
  
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PrintLite development server running on http://0.0.0.0:${PORT}`);
  console.log('✅ Frontend-only application ready!');
});