// Temporary server to start Vite for migration
import { spawn } from 'child_process'

console.log('🚀 Starting PrintLite with Amplify backend...')

// Start Vite development server
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  stdio: 'inherit',
  shell: true
})

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`)
  process.exit(code || 0)
})

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err)
  process.exit(1)
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down PrintLite...')
  vite.kill()
  process.exit()
})