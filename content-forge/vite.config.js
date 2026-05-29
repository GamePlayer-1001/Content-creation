import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'client',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3210',
        changeOrigin: true,
        timeout: 300000,       // 5分钟超时，SSE长连接需要
        proxyTimeout: 300000,
      },
    },
  },
});
