import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: "googleMeetLinkSaver",
      entry: resolve(__dirname, "src/main.ts"),
      fileName: "googleMeetLinkSaver",
    },
  },
});
