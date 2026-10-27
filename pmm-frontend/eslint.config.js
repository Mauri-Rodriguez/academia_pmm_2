import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Configs Node/CJS no son código de app; `module` en tailwind no es un defecto de producto.
  globalIgnores(['dist', '*.config.js', '*.config.cjs']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // `^[A-Z_]` = imports PascalCase usados en JSX (sin eslint-plugin-react, ESLint no los ve).
      // `motion` = framer-motion en <motion.div>; mismo falso positivo JSX.
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]|^(motion)$',
        caughtErrorsIgnorePattern: '^_',
      }],
      // Utilidad + componente en el mismo módulo (KaTeX); no es defecto de producto.
      'react-refresh/only-export-components': ['error', {
        allowConstantExport: true,
        allowExportNames: ['renderizarConMatematicas'],
      }],
    },
  },
])
