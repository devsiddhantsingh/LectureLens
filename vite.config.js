import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true,
        proxy: {
            '/api/groq': {
                target: 'https://api.groq.com/openai/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/groq/, ''),
            },
        },
    },
});
