import { defineConfig } from 'vite';

export default defineConfig({
  base: './',            // 앱(Capacitor) 안에서도 경로가 깨지지 않도록 상대 경로
  server: {
    host: true,          // 같은 와이파이의 폰에서도 접속 가능
  },
  build: {
    outDir: 'dist',
  },
});
