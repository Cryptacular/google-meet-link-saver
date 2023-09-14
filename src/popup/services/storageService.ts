export const getLinks = async (): Promise<string[]> => {
  if (import.meta.env.DEV) {
    return JSON.parse(
      localStorage.getItem("googleMeetStoredUrls-test") || "[]"
    );
  } else {
    const STORAGE_KEY = "googleMeetStoredUrls";
    const currentStorage = await chrome.storage.sync.get(STORAGE_KEY);
    return currentStorage[STORAGE_KEY] || [];
  }
};

export const removeLink = async (link: string): Promise<string[]> => {
  if (import.meta.env.DEV) {
    const linkList: string[] = JSON.parse(
      localStorage.getItem("googleMeetStoredUrls-test") || "[]"
    );

    const updatedLinkList = linkList.filter((x) => x !== link);
    localStorage.setItem(
      "googleMeetStoredUrls-test",
      JSON.stringify(updatedLinkList)
    );

    return updatedLinkList;
  } else {
    const STORAGE_KEY = "googleMeetStoredUrls";
    const currentStorage = await chrome.storage.sync.get(STORAGE_KEY);
    const linkList: string[] = currentStorage[STORAGE_KEY] || [];
    const updatedLinkList = linkList.filter((x) => x !== link);

    await chrome.storage.sync.set({ [STORAGE_KEY]: updatedLinkList });

    return updatedLinkList;
  }
};
