import { observeDom } from "../../utilities/observeDom";
import { storeUrl } from "../../utilities/storeUrl";

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

  const sidePanelChat = document.querySelector(
    'div[data-panel-container-id="sidePanel2subPanel0"]'
  );

  const chatContainer = sidePanelChat?.querySelector('div[aria-live="polite"]');

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

      const addedNode = mutation.addedNodes[0] as HTMLElement;
      const messageNode = addedNode.getAttribute("data-message-text")
        ? addedNode
        : addedNode.querySelector("div[data-message-text]");

      if (!messageNode) throw new Error("Could not find message");

      messageNode.childNodes.forEach((n) => {
        const href = (n as HTMLAnchorElement).href;
        if (href) {
          storeUrl(href);
        }
      });
    } catch (err) {
      // console.log("Error:", err);
    }
  });
};
