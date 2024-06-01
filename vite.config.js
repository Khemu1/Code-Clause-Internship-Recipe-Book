import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  // build: {
  //   outDir: "dist",
  // },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
