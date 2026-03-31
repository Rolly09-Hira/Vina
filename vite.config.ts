import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement selon le mode (development / production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: '/',                     // ← ESSENTIEL pour Vercel (SPA)
    css: {
      postcss: './postcss.config.js',
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5005',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',              // ← dossier par défaut, mais on le précise
      sourcemap: false,
    },
  }
})