import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "",
    rollupOptions: {
      input: "src/index.tsx",
    },
  },
  server: {
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
    cors: true,
    host: "0.0.0.0",
  },
});
