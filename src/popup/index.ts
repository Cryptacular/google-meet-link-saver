const render = async () => {
  let loggedUrls: string[];

  if (import.meta.env.DEV) {
    loggedUrls = JSON.parse(
      localStorage.getItem("googleMeetStoredUrls-test") || "[]"
    );
  } else {
    const STORAGE_KEY = "googleMeetStoredUrls";
    const currentStorage = await chrome.storage.sync.get(STORAGE_KEY);
    loggedUrls = currentStorage[STORAGE_KEY] || [];
  }

  const ul = document.getElementById("listOfUrls");
  ul?.replaceChildren(
    ...loggedUrls.map((l) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = l;
      a.innerText = l;
      li.append(a);
      return li;
    })
  );
};

render();

if (import.meta.env.DEV) {
  const { addListener } = await import("../mocks/chromePubSubMock");
  addListener((message) => {
    if (message.type === "STATE_UPDATED") {
      render();
    }

    return true;
  });
} else {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "STATE_UPDATED") {
      render();
    }
    return true;
  });
}
