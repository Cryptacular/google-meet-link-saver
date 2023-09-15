import { Link } from "../../models/Link";

export const storeUrl = async (link: Link) => {
  if (import.meta.env.DEV) {
    const { sendMessage } = await import("../../mocks/chromePubSubMock");
    sendMessage({ type: "LOGGED_URL", link }, (response) => {
      if (response === "STATE_UPDATED") {
        sendMessage({ type: "STATE_UPDATED" });
      }
    });
  } else {
    chrome.runtime.sendMessage(
      {
        type: "LOGGED_URL",
        link,
      },
      async (response) => {
        if (response === "STATE_UPDATED") {
          await chrome.runtime.sendMessage({ type: "STATE_UPDATED" });
        }
      }
    );
  }
};
