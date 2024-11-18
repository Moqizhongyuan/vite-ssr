import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createPlugins } from "./plugins";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createPlugins()],
  build: {
    sourcemap: true, // 启用源映射
  },
});
