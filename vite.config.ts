import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    
    proxy: {
      '/api/osv': {
        target: 'https://api.osv.dev/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/osv/, ''),
      },
    },
  },
})
