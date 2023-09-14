import { listenForMessagesFromSidePanel } from "./listeners/sidePanel";

const interval = setInterval(() => {
  try {
    listenForMessagesFromSidePanel();
    clearInterval(interval);
  } catch {}
}, 200);
