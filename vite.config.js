import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_URL = env.VITE_API_URL || 'http://localhost:5000'

  console.log('API_URL =', API_URL)

  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: ['.ngrok-free.app'],
      proxy: {
        '/posts': {
            target: API_URL,
            changeOrigin: true,
          },
        '/products': {
            target: API_URL,
            changeOrigin: true,
          },
        '/users': {
            target: API_URL,
            changeOrigin: true,
          },
        '/categories': {
            target: API_URL,
            changeOrigin: true,
          },
        '/productCategories': {
            target: API_URL,
            changeOrigin: true,
          },
        '/albums': {
            target: API_URL,
            changeOrigin: true,
          },
        '/shop': {
            target: API_URL,
            changeOrigin: true,
          },
        '/uploads': {
            target: API_URL,
            changeOrigin: true,
          },
      },
    },
  }
})
