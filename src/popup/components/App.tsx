import { useEffect, useState } from "react";
import { MdDeleteForever, MdLink } from "react-icons/md";
import { getState, setState } from "../../services/storageService";
import { Link } from "../../models/Link";

const App = () => {
  const [links, setLinks] = useState<Link[]>([]);

  const updateLinks = async () => {
    setLinks(await getState());
  };

  useEffect(() => {
    updateLinks();

    (async () => {
      if (import.meta.env.DEV) {
        const { addListener } = await import("../../mocks/chromePubSubMock");
        addListener(async (message) => {
          if (message.type === "STATE_UPDATED") {
            await updateLinks();
          }

          return true;
        });
      } else {
        chrome.runtime.onMessage.addListener(async (message) => {
          if (message.type === "STATE_UPDATED") {
            await updateLinks();
          }
          return true;
        });
      }
    })();
  }, []);

  const handleDelete = async (link: string) => {
    const newLinkList = await removeUrl(link);
    setLinks(newLinkList);
  };

  const groupLinksBySender = (
    links: Link[]
  ): { sender: string; links: string[] }[] => {
    const senders = links
      .map((l) => l.sender)
      .filter((val, i, arr) => arr.indexOf(val) === i);

    return senders.map((s) => ({
      sender: s,
      links: links.filter((l) => l.sender === s).map((l) => l.url),
    }));
  };

  const senderLinks = groupLinksBySender(links);

  return (
    <div className="gmls-container">
      <h1 className="gmls-heading">Saved links from Google Meet</h1>
      {senderLinks.length > 0 ? (
        senderLinks.reverse().map((senderLink) => (
          <div key={senderLink.sender}>
            <div className="gmls-list-item-sender">{senderLink.sender}</div>

            <ul className="gmls-list">
              {senderLink.links.map((link) => (
                <li key={link} className="gmls-list-item">
                  <span className="gmls-list-item-link">
                    <MdLink title="Delete link" size={24} color="white" />
                    <a
                      href={link}
                      target="_blank"
                      className="gmls-list-item-anchor"
                    >
                      {link}
                    </a>
                    <button
                      className="gmls-link-delete"
                      onClick={() => handleDelete(link)}
                    >
                      <MdDeleteForever
                        title="Delete link"
                        size={24}
                        color="white"
                      />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>
          <em>
            When links are sent in a Google Meet chat, they will show up here.
          </em>
        </p>
      )}
    </div>
  );
};

const removeUrl = async (url: string): Promise<Link[]> => {
  const linkList = await getState();
  const updatedLinkList = linkList.filter((l) => l.url !== url);
  await setState(updatedLinkList);
  return updatedLinkList;
};

export default <App />;
