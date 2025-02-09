import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // First try to load from .env.local
  const localEnvPath = path.resolve(process.cwd(), '.env.local');
  const localEnv = fs.existsSync(localEnvPath) 
    ? Object.fromEntries(
        fs.readFileSync(localEnvPath, 'utf-8')
          .split('\n')
          .filter(line => line && !line.startsWith('#'))
          .map(line => line.split('='))
      )
    : {};

  // Then load the rest using Vite's loadEnv
  const env = {
    ...loadEnv(mode, process.cwd(), 'VITE_'),
    ...localEnv // .env.local takes precedence
  };

  console.log('Environment Configuration:', {
    mode,
    envSource: fs.existsSync(localEnvPath) ? '.env.local exists' : 'using .env.development',
    supabaseUrl: env.VITE_SUPABASE_URL || 'not found',
    envKeys: Object.keys(env)
  });

  return {
    envDir: process.cwd(),
    envPrefix: 'VITE_',
    define: {
      'process.env': env
    },
  server: {
    host: "::",
    port: 8080,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }
  },
  plugins: [
    react(),
    componentTagger()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }
  };
});
