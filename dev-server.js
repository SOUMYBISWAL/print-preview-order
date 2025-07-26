#!/usr/bin/env node

/**
 * Development server wrapper that runs the working CommonJS server
 * This bypasses the tsx dependency issue by using the proven simple-server.cjs
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🔧 Starting PrintLite development server...');
console.log('📝 Using CommonJS server to bypass tsx dependency issues');

// Import and run the working server
require('./simple-server.cjs');