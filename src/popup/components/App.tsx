import { useEffect, useState } from "react";
import { MdDeleteForever, MdLink } from "react-icons/md";
import { getLinks, removeLink } from "../services/storageService";

const App = () => {
  const [links, setLinks] = useState<string[]>([]);

  const updateLinks = async () => {
    setLinks(await getLinks());
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
    const newLinkList = await removeLink(link);
    setLinks(newLinkList);
  };

  return (
    <div className="gmls-container">
      <h1 className="gmls-heading">Saved links from Google Meet</h1>
      {links.length > 0 ? (
        <ul className="gmls-list">
          {links.reverse().map((link) => (
            <li key={link} className="gmls-list-item">
              <MdLink title="Delete link" size={24} color="white" />
              <a href={link} className="gmls-list-item-link">
                {link}
              </a>
              <button
                className="gmls-link-delete"
                onClick={() => handleDelete(link)}
              >
                <MdDeleteForever title="Delete link" size={24} color="white" />
              </button>
            </li>
          ))}
        </ul>
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

export default <App />;
