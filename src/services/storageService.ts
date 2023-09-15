import { Link } from "../models/Link";

const STORAGE_KEY = "googleMeetStoredUrls";

export const getState = async (): Promise<Link[]> => {
  if (import.meta.env.DEV) {
    return JSON.parse(
      localStorage.getItem("googleMeetStoredUrls-test") || "[]"
    );
  } else {
    const currentStorage = await chrome.storage.sync.get(STORAGE_KEY);
    return currentStorage[STORAGE_KEY] || [];
  }
};

export const setState = async (state: Link[]): Promise<void> => {
  if (import.meta.env.DEV) {
    localStorage.setItem("googleMeetStoredUrls-test", JSON.stringify(state));
  } else {
    await chrome.storage.sync.set({
      [STORAGE_KEY]: state,
    });
  }
};
