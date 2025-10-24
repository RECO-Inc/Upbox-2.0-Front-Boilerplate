import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: true,
    // 서버 API 용 프록시 정보를 추가한다.
    proxy: {
      '/api': {
        target: "https://admin2.recobora.com",
        // target: "http://172.16.1.173:9091",
        // target: process.env.VITE_PROXY_HOST,
        changeOrigin: true,
        secure: false,
      },
    }
  },
})
