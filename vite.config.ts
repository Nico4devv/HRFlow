import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  resolve: {
    alias: {
      // allow imports like `import X from '@components/...'
      '@components': path.resolve(__dirname, 'components')
    }
  },
  server: {
    fs: {
      // allow Vite to serve files from the project root (parent of frontend)
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
