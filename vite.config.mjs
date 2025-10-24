// vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // relativo para servir desde Nginx o subcarpeta
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8844/web',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}))