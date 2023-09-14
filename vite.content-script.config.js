import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      name: "googleMeetLinkSaverContentScript",
      entry: [resolve(__dirname, "src/contentScript/main.ts")],
      fileName: "googleMeetLinkSaverContentScript",
    },
  },
});
