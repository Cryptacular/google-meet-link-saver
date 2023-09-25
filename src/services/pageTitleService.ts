export const getPageTitle = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://google-meet-link-saver-api.vercel.app/api/page-title?url=${encodeURIComponent(
        url
      )}`,
      {
        mode: "cors",
      }
    );

    if (!response.ok) return null;

    const json = await response.json();

    return json.body.title ?? null;
  } catch {
    console.log(`Couldn't fetch title for url: '${url}'`);
    return null;
  }
};
