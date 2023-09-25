import fetch from "node-fetch";
import { load } from "cheerio";

export default async function handler(request, response) {
  const { url } = request.query;

  if (!url) {
    return response
      .status(400)
      .json({ message: "Query parameter 'url' is required" });
  }

  try {
    const pageResponse = await fetch(new URL(url));

    if (!pageResponse.ok) {
      return response.status(404).json({ url, title: null }).end();
    }

    const body = await pageResponse.text();
    const $ = load(body);
    const title = $("title").text();

    response.status(200).json({
      body: { url, title },
    });
  } catch {
    return response.status(404).json({ url, title: null }).end();
  }
}
