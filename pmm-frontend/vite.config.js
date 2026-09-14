import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  chunkSizeWarningLimit: 1000,

  // 🚩 FIX para Vite 8 (usa Oxc, no esbuild)
  build: {
    minify: 'esbuild',        
    target: 'es2020',
    sourcemap: true,
  },
 // oxc: {
    // Preserva nombres de funciones/clases al minificar
    //keepNames: true,
  //},
})