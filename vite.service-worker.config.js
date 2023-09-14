import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      name: "googleMeetLinkSaverServiceWorker",
      entry: [resolve(__dirname, "src/serviceWorker/index.ts")],
      fileName: "googleMeetLinkSaverServiceWorker",
    },
  },
});
