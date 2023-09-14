declare global {
  interface Window {
    addListener: typeof addListener;
    sendMessage: typeof sendMessage;
    listeners: ((
      message: any,
      sender: any,
      sendResponse: (response?: any) => void
    ) => void)[];
  }
}

window.listeners = window.listeners || [];

export const addListener: typeof chrome.runtime.onMessage.addListener = (
  callback
) => {
  window.listeners.push(callback);
};

export const sendMessage = <M = any, R = any>(
  message: M,
  responseCallback: (response: R) => void = () => {}
) => {
  window.listeners.forEach((l) => l(message, {}, responseCallback));
};

window.addListener = addListener;
window.sendMessage = sendMessage;
