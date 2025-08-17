// Simple development server to start Vite
import { exec } from 'child_process'

console.log('🚀 Starting PrintLite with Amplify backend...')

// Start Vite development server
const vite = exec('npx vite --host 0.0.0.0 --port 5000', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`)
    return
  }
  console.log(stdout)
  if (stderr) {
    console.error(stderr)
  }
})

vite.stdout.on('data', (data) => {
  console.log(data)
})

vite.stderr.on('data', (data) => {
  console.error(data)
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down PrintLite...')
  vite.kill()
  process.exit()
})