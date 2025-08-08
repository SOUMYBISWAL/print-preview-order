import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files from client directory
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));
app.use('/src', express.static(path.join(clientPath, 'src')));
app.use('/public', express.static(path.join(clientPath, 'public')));

// Serve assets
app.use('/assets', express.static(path.join(__dirname, '..', 'attached_assets')));

// Serve node_modules for dependencies
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));

// Basic TypeScript/JSX transform middleware for development
app.get('/src/*', (req, res, next) => {
  const filePath = req.path;
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    // For now, just serve the files as-is
    // In a real scenario, you'd want to transform TypeScript
    next();
  } else {
    next();
  }
});

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PrintLite frontend server running on http://0.0.0.0:${PORT}`);
  console.log('✅ This is a frontend-only application served via Express!');
});