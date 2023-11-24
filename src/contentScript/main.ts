import { listenForMessagesFromSidePanel } from "./listeners/sidePanel";

let attempts = 0;
let delayMs = 1000;

const interval = setInterval(() => {
  try {
    const isListening = listenForMessagesFromSidePanel();
    if (isListening) clearInterval(interval);
  } catch (err) {
    console.error(err);
  } finally {
    attempts++;

    if (attempts > 30) {
      clearInterval(interval);
      console.log(`Interval cleared`);
    }
  }
}, delayMs);
