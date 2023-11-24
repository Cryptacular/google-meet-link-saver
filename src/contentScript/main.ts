import { listenForMessagesFromSidePanel } from "./listeners/sidePanel";
import { executeWithExponentialBackoff } from "./utilities/exponentialBackoff";

executeWithExponentialBackoff(
  () => {
    const isListening = listenForMessagesFromSidePanel();
    if (!isListening) {
      throw new Error("Couldn't find side panel");
    }
  },
  1000,
  [
    {
      attempt: 10,
      timeoutMs: 2000,
    },
    {
      attempt: 20,
      timeoutMs: 5000,
    },
    {
      attempt: 50,
      timeoutMs: 10000,
    },
    {
      attempt: 100,
      shouldStop: true,
    },
  ]
);
