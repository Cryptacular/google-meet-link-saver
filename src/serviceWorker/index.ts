import { getPageTitle } from "../services/pageTitleService";
import { getState, setState } from "../services/storageService";

const handleRequest = async (
  request: any,
  sendResponse: (response?: any) => void
): Promise<void> => {
  const { type, link } = request;

  if (
    type !== "LOGGED_URL" ||
    !link ||
    !link.url ||
    !link.sender ||
    !link.date
  ) {
    sendResponse("NO_CHANGE");
    return;
  }

  const title = await getPageTitle(link.url);
  const state = await getState();

  if (state.some((s) => s.url === link.url)) {
    sendResponse("NO_CHANGE");
    return;
  }

  await setState([...state, { ...link, title }]);

  sendResponse("STATE_UPDATED");
};

const processExistingLinks = async () => {
  const state = await getState();

  const titles = new Map<string, string>();

  for (const link of state) {
    if (link.title) continue;

    const title = await getPageTitle(link.url);

    if (!title) continue;

    titles.set(link.url, title);
  }

  const newState = state.map((link) => ({
    ...link,
    title: titles.get(link.url) ?? link.title,
  }));

  await setState(newState);
};

if (import.meta.env.DEV) {
  const { addListener } = await import("../mocks/chromePubSubMock");

  addListener(async (request, _sender, sendResponse) => {
    await handleRequest(request, sendResponse);
  });
} else {
  chrome.runtime.onMessage.addListener(
    async (request, _sender, sendResponse) => {
      await handleRequest(request, sendResponse);
      return true;
    }
  );

  chrome.runtime.onInstalled.addListener(async () => {
    await processExistingLinks();
    return true;
  });
}
