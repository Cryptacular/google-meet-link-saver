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
    'div[data-panel-container-id="sidePanel2"]'
  );

  return sidePanelChat?.querySelector('div[aria-live="polite"]');
};

const openAndCloseMessagesPanel = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const button = getMessagesIcon();
    if (!button) reject("Button not found");

    button.click();

    setTimeout(() => {
      button.click();
      resolve();
    }, 300);
  });
};

export const listenForMessagesFromSidePanel = async (): Promise<boolean> => {
  await openAndCloseMessagesPanel();

  const chatContainer = getChatContainer();

  if (!chatContainer) {
    return false;
  }

  observeDom(chatContainer, handleSidePanelDomChange);
  return true;
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

      if (!chatContainer || chatContainer.childElementCount === 0) return;

      const messageBlock =
        chatContainer.children[chatContainer.children.length - 1];
      const anchorTags = messageBlock.querySelectorAll("a");
      if (anchorTags.length === 0) return;

      const senderContainer = messageBlock.children[0];
      const sender = senderContainer.children[0].textContent;
      const a = anchorTags[anchorTags.length - 1];

      if (a.href) {
        if (!sender || sender === "You") {
          throw new Error("Could not find sender");
        }

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
