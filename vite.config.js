import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://sky-tech.cloud', // URL của backend server
                changeOrigin: true, // Đổi origin của request thành backend server
                rewrite: (path) => path.replace(/^\/api/, '/api'), // Giữ nguyên đường dẫn
            },
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});
