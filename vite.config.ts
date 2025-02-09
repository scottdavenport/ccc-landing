import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/cloudinary': {
        target: 'https://api.cloudinary.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cloudinary/, '/v1_1'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const apiKey = env.VITE_CLOUDINARY_API_KEY;
            const apiSecret = env.VITE_CLOUDINARY_API_SECRET;
            if (apiKey && apiSecret) {
              const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
              proxyReq.setHeader('Authorization', `Basic ${auth}`);
            }
          });
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
});
