import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/WEBSec-browser/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});