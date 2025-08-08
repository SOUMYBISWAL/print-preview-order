import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: "./client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve("./client/src"),
      "@shared": resolve("./shared"),
      "@assets": resolve("./attached_assets"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    fs: {
      // Allow serving files from outside of the client root
      allow: ['..']
    }
  },
  optimizeDeps: {
    // Include dependencies that should be pre-bundled
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'wouter',
      'lucide-react',
      'sonner'
    ]
  }
});