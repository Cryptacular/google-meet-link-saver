import { listenForMessagesFromSidePanel } from "./listeners/sidePanel";

const interval = setInterval(() => {
  try {
    const isListening = listenForMessagesFromSidePanel();
    if (isListening) clearInterval(interval);
  } catch (err) {
    console.error(err);
  }
}, 200);
