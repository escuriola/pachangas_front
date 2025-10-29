// vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Usa rutas absolutas por defecto (/) para que los assets carguen en deep-links.
// Si algún día sirves bajo subcarpeta, exporta VITE_PUBLIC_BASE='/subcarpeta/' en el build.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: process.env.VITE_PUBLIC_BASE?.trim() || '/',  // <-- ANTES: './'
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost/api',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
}))