import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project site on GitHub Pages: https://<user>.github.io/world-cup-2026/
export default defineConfig({
  base: '/world-cup-2026/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
