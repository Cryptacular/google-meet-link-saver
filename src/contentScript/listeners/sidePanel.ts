import { Link } from "../../models/Link";
import { observeDom } from "../utilities/observeDom";
import { storeUrl } from "../utilities/storeUrl";

const getMessagesIcon = () =>
  document
    .evaluate(
      "//i[contains(., 'chat_bubble')]",
      document,
      null,
      XPathResult.ANY_TYPE,
      null
    )
    .iterateNext() as HTMLElement;

const getChatContainer = () => {
  const sidePanelChat = document.querySelector(
    'div[data-panel-container-id="sidePanel2subPanel0"]'
  );

  return sidePanelChat?.querySelector('div[aria-live="polite"]');
};

const openAndCloseMessagesPanel = () => {
  const button = getMessagesIcon();

  if (!button) return;

  button.click();

  setTimeout(() => {
    button.click();
  }, 200);
};

export const listenForMessagesFromSidePanel = () => {
  openAndCloseMessagesPanel();

  const chatContainer = getChatContainer();

  if (!chatContainer) {
    throw new Error("Chat panel could not be found");
  }

  return observeDom(chatContainer, handleSidePanelDomChange);
};

const handleSidePanelDomChange: MutationCallback = (
  mutations: MutationRecord[],
  _observer: MutationObserver
) => {
  if (mutations.length === 0) {
    return;
  }

  mutations.forEach((mutation) => {
    try {
      if (mutation.addedNodes.length === 0) return;

      const chatContainer = getChatContainer();

      if (!chatContainer) return;

      const anchorTags = chatContainer.querySelectorAll("a");

      if (anchorTags.length === 0) return;

      const a = anchorTags[anchorTags.length - 1];
      if (a.href) {
        const sender =
          a.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute(
            "data-sender-name"
          );

        if (!sender || sender === "You") return;

        const link: Link = {
          url: a.href,
          sender,
          date: new Date().toUTCString(),
        };
        storeUrl(link);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  });
};
