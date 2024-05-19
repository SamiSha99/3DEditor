import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tsconfigPaths from 'vite-tsconfig-paths'
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        wasm(),
        {
            name: "configure-response-headers",
            configureServer: (server) => {
              server.middlewares.use((_req, res, next) => {
                res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                next();
              });
            },
        },  
        react(),
        tsconfigPaths(),
        basicSsl(), // for development with vite, remove when done
    ],
})
