import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import scrollbar from "tailwind-scrollbar";
import path from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), scrollbar()],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@main_pages": path.resolve(__dirname, "./src/main_pages"),
      "@pages": path.resolve(__dirname, "./src/main_pages/pages"),
    },
  },
});
