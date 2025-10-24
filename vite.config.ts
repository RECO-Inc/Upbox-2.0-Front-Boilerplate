import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 배포 시 레포지토리 이름이 base path가 됨
  // 조직 레포: https://reco-inc.github.io/Upbox-2.0-Front-Boilerplate/
  // 로컬 개발 시에는 '/'로 유지
  base: process.env.NODE_ENV === 'production' ? '/Upbox-2.0-Front-Boilerplate/' : '/',
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
