#!/usr/bin/env node

/**
 * Development server starter for PrintLite
 * Uses the working simple-server.cjs to bypass tsx dependency issues
 */

console.log('🚀 Starting PrintLite development server...');
console.log('📋 Migration: Using CommonJS server to bypass tsx dependency issue');

// Start the working CommonJS server
require('./simple-server.cjs');