import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://sky-tech.cloud', // Địa chỉ HTTP backend
                changeOrigin: true, // Thay đổi origin để phù hợp với backend
                secure: false, // Bỏ qua lỗi SSL nếu có
                rewrite: (path) => path.replace(/^\/api/, ''), // Xóa prefix '/api' nếu cần
            },
        },
    },
});
