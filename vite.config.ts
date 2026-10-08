import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from the root of a custom domain (jayambadkar.com) on GitHub Pages.
export default defineConfig({
  base: '/',
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
