import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsDir: "",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        googleMeetSavedLinksPopup: resolve(
          __dirname,
          "./googleMeetSavedLinksPopup.html"
        ),
      },
    },
  },
});
