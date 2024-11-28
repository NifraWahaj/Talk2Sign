import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr"; // Import svgr plugin
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    svgr(), // Use svgr plugin here
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: 'Talk2Sign',
        short_name: 'Talk2Sign',
        description: 'Talk2Sign',
        theme_color: '#ffffff',
        icons: [
          {
            "src": "/pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/pwa-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/pwa-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }

        ]
      }
    })
  ],

  server: {
    host: "0.0.0.0", // Allow connections from any network interface
    open: true, // Automatically open the app in the browser
    port: 3000, // Development server port
  },
});
