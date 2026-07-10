import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Neuer Build-Ordner
    outDir: "dist_cs",

    // Warnung erst ab 700 kB anzeigen
    chunkSizeWarningLimit: 700,

    rollupOptions: {
      output: {
        codeSplitting: true,
      },
    },

    minify: true,
    sourcemap: false,
  },

  server: {
    open: true,
    port: 5173,
  },

  preview: {
    port: 4173,
  },
});
