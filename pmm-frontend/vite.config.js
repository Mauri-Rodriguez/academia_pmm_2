import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  chunkSizeWarningLimit: 1000,

  build: {
    // 🚩 FIX: Oxc (minificador por defecto de rolldown-vite / Vite 8) corrompe
    // secuencias "\c" + letra dentro de strings JS (ej: \cos, \cot, \csc, \cdot).
    // Interpreta "\c" como el comando LaTeX de cedilla y se come la letra
    // siguiente: "\cos(x)" -> "o̧s(x)". Esto rompía todo el LaTeX de los
    // ejercicios de matemáticas en producción.
    // Minificación deshabilitada hasta que el bug se resuelva en Oxc/rolldown-vite.
    // (Nota: minify espera un booleano, no el string 'false')
    minify: false,
    target: 'es2020',
    sourcemap: true,
  },
})