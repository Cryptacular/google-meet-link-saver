export const storeUrl = async (url: string) => {
  if (import.meta.env.DEV) {
    const { sendMessage } = await import("../../mocks/chromePubSubMock");
    sendMessage({ type: "LOGGED_URL", loggedUrl: url }, (response) => {
      if (response === "STATE_UPDATED") {
        sendMessage({ type: "STATE_UPDATED" });
      }
    });
  } else {
    chrome.runtime.sendMessage(
      {
        type: "LOGGED_URL",
        loggedUrl: url,
      },
      async (response) => {
        if (response === "STATE_UPDATED") {
          await chrome.runtime.sendMessage({ type: "STATE_UPDATED" });
        }
      }
    );
  }
};
