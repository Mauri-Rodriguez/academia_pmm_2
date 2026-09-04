/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 🚩 PALETA OFICIAL PMM INTERACTIVO
        'pmm-blue': '#0A3D62',         // Azul institucional (Botones, Títulos, Sidebar)
        'pmm-gold': '#FBE000',         // Amarillo corporativo (Detalles, bordes, logros)
        'pmm-blue-light': '#2E5AAC',   // Azul claro (Acentos y enlaces)
      },
      fontFamily: {
        'scholar': ['"Cinzel"', 'serif'],      // Para títulos con peso (opcional, ya usamos font-extrabold)
        'modern': ['"Inter"', 'sans-serif'],   // Para texto legible y datos
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}