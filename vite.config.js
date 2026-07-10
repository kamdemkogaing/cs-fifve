import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Warnung erst ab 700 kB anzeigen
    chunkSizeWarningLimit: 700,

    // Rolldown Build-Optionen
    rolldownOptions: {
      output: {
        codeSplitting: true,
      },
    },

    // Minifizierung aktivieren
    minify: true,

    // Source Maps im Production-Build deaktivieren
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
