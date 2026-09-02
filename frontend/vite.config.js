import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The API is on 4000 (see backend/.env PORT). Vite on 5173 forwards
      // /api so the browser never talks to whatever else is using 3000.
      //"/api": "http://127.0.0.1:4000",
    },
  },
});
