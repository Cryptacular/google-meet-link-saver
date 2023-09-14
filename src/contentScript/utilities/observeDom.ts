export const observeDom = function (
  element: Element,
  callback: MutationCallback
) {
  if (!element || element.nodeType !== 1) return;

  if (MutationObserver) {
    var mutationObserver = new MutationObserver(callback);

    mutationObserver.observe(element, { childList: true, subtree: true });
    return mutationObserver;
  } else {
    console.error("Extension not supported by your current Chrome version.");
  }
};
