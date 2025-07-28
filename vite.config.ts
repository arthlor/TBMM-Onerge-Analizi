import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/TBMM-Onerge-Analizi/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  optimizeDeps: {
    exclude: ['fsevents'],
  },
}); 