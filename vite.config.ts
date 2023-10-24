import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      CUSTOMERS_URL: 'http://localhost:8080/api/customers',
      PRODUCTS_URL: 'http://localhost:8080/api/products',
      SALES_URL: 'http://localhost:8080/api/sales',
      AUTH_URL: 'http://localhost:8080/api/auth'
    }
  },
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
