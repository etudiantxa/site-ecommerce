import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: { // <--- AJOUTEZ CETTE SECTION
    proxy: {
      '/api': { // Toutes les requêtes commençant par /api
        target: 'http://localhost:5000', // Seront redirigées vers votre backend
        changeOrigin: true, // Important pour que le backend reçoive la bonne origine
        // Si votre backend a des routes qui ne commencent PAS par /api mais que vous voulez quand même les proxyfier,
        // vous pouvez ajouter d'autres configurations ici ou utiliser 'rewrite'.
        // Par exemple, si votre backend avait /payment/initiate au lieu de /api/payment/initiate,
        // et que vous appeliez fetch('/payment/initiate') depuis le frontend, vous auriez :
        // '/payment': {
        //   target: 'http://localhost:5000',
        //   changeOrigin: true,
        // }
      }
    }
  }
});