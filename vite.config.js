import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  server: {
    host: "0.0.0.0", 
    port: 5400, 
    proxy: {
      "/api": {
        target: "http://ec2-13-38-230-173.eu-west-3.compute.amazonaws.com:3000", // Backend server address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Adjust path if needed
      },
    },
  },
});
