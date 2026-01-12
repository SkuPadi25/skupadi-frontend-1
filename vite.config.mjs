import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import path from "path";

// ---------------------------------------
// DEVELOPMENT CONFIG
// ---------------------------------------
export default defineConfig({
  plugins: [tsconfigPaths(), react(), tagger()],

  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
      services: path.resolve(__dirname, "src/services"),
      utils: path.resolve(__dirname, "src/utils"),
    }
  },

  server: {
    port: 4028,
    proxy: {
      "/api": {
        target: "http://localhost:4000", // or your new Express backend URL
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
