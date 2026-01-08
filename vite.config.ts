import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 手动声明 process 防止 TS 报错 (因为缺少 @types/node)
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative base path for flexible deployment
  define: {
    // Safely expose environment variables to the browser
    'process.env': {
      API_KEY: process.env.API_KEY || '',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  },
  build: {
    chunkSizeWarningLimit: 1024000
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
