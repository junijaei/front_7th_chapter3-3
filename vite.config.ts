import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared/ui': path.resolve(__dirname, './src/shared/ui'),
      '@shared/utils': path.resolve(__dirname, './src/shared/utils'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@features': path.resolve(__dirname, './src/features'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@app': path.resolve(__dirname, './src/app'),
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: 'https://jsonplaceholder.typicode.com',
        target: 'https://dummyjson.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
