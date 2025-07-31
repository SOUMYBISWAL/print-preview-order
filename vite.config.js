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
  },
});