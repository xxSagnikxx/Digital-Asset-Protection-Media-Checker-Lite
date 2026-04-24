import axios from "axios";
import * as cheerio from "cheerio";
export async function scrapeImages(targetUrl) {
  try {
    const { data: html } = await axios.get(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AssetScanner/1.0)" },
      timeout: 10000,
    });
    const $ = cheerio.load(html);
    const images = [];
    $("img").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy-src");
      if (src) {
        try {
          images.push(new URL(src, targetUrl).href);
        } catch (e) { /* skip broken urls */ }
      }
    });
    return [...new Set(images)];
  } catch (err) {
    console.error("Scrape Error:", err.message);
    return [];
  }
}