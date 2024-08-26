import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  server: {
    host: "0.0.0.0",
    port: 5400,
    proxy: {
      "/api": {
        target: "ec2-13-38-230-173.eu-west-3.compute.amazonaws.com:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
