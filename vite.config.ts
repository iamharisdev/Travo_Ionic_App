/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      legacy()
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
    define: {
      'process.env': env
    },
    optimizeDeps: { exclude: ['node_modules/.cache'] },
    server: {
      // host: true,
      // port: 5173,
     
      cors: {
        origin: ['http://localhost', 'capacitor://localhost','http://192.168.18.29:5173'],
        methods: ['GET', 'POST', 'PUT', 'PATH', 'DELETE'],
        allowedHeaders: ['Content-Type']
      },
      // allowedHosts: ['https:/qaid.trovahealth.app']
    }
  }
})
