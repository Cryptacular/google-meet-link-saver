if (import.meta.env.DEV) {
  const { addListener } = await import("../mocks/chromePubSubMock");

  addListener(async (request, _sender, sendResponse) => {
    console.log("Received request:", request);
    const { type, loggedUrl } = request;

    if (type !== "LOGGED_URL" || !loggedUrl || typeof loggedUrl !== "string") {
      sendResponse("NO_CHANGE");
      return;
    }

    const state: string[] = JSON.parse(
      localStorage.getItem("googleMeetStoredUrls-test") || "[]"
    );

    if (state.some((s) => s === request.loggedUrl)) {
      sendResponse("NO_CHANGE");
      return;
    }

    localStorage.setItem(
      "googleMeetStoredUrls-test",
      JSON.stringify([...state, request.loggedUrl])
    );

    sendResponse("STATE_UPDATED");
    return true;
  });
} else {
  chrome.runtime.onMessage.addListener(
    async (request, _sender, sendResponse) => {
      console.log("Received request:", request);

      const { type, loggedUrl } = request;

      if (
        type !== "LOGGED_URL" ||
        !loggedUrl ||
        typeof loggedUrl !== "string"
      ) {
        sendResponse("NO_CHANGE");
        return;
      }

      const STORAGE_KEY = "googleMeetStoredUrls";
      const currentStorage = await chrome.storage.sync.get(STORAGE_KEY);
      const loggedUrls: string[] = currentStorage[STORAGE_KEY] || [];

      if (loggedUrls.some((l) => l === loggedUrl)) {
        sendResponse("NO_CHANGE");
        return;
      }

      await chrome.storage.sync.set({
        [STORAGE_KEY]: [...loggedUrls, loggedUrl],
      });

      sendResponse("STATE_UPDATED");
      return true;
    }
  );
}
