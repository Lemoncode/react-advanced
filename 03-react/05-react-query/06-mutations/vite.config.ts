import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@home": fileURLToPath(new URL("./src/modules/home", import.meta.url)),
      "@teams": fileURLToPath(new URL("./src/modules/teams", import.meta.url)),
      "@tasks": fileURLToPath(new URL("./src/modules/tasks", import.meta.url)),
    },
  },
});
