#!/bin/bash

# Kill any existing node processes
pkill -f "node start-server.cjs" 2>/dev/null || true

# Start the server
echo "Starting PrintLite server..."
NODE_ENV=development node start-server.cjs