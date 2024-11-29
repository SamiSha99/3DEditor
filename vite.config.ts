import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: 'esnext'
    },
    plugins: [
        {
            name: "configure-response-headers",
            configureServer: (server) => {
                server.middlewares.use((_req, res, next) => {
                    res.setHeader("Access-Control-Allow-Origin", "https://storage.googleapis.com/arplatform-99ab9.appspot.com/");
                    next();
                });
            },
        },
        react(),
        tsconfigPaths(),
        basicSsl(), // for development with vite, remove when done
    ],
})
