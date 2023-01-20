import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://water-calendar-website.herokuapp.com/",
  server: {
    port: 8080
  },
  css: {
    preprocessorOptions: {
        scss: {
            quietDeps: true
        },
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
