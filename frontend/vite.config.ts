import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
