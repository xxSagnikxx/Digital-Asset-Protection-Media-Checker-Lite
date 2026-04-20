// import axios from "axios";
// import * as cheerio from "cheerio";

// const SUPPORTED_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg|avif|ico)(\?.*)?$/i;

// function resolveUrl(src, base) {
//   if (!src || src.startsWith("data:")) return null;

//   try {
//     return new URL(src, base).href;
//   } catch {
//     return null;
//   }
// }

// async function scrapeImages(targetUrl) {
//   const { data: html } = await axios.get(targetUrl, {
//     headers: { "User-Agent": "Mozilla/5.0 (compatible; ImageScraper/1.0)" },
//     timeout: 10_000,
//   });

//   const $ = cheerio.load(html);
//   const imageUrls = new Set();

//   $("img").each((_, el) => {
//     const candidates = [
//       $(el).attr("src"),
//       $(el).attr("data-src"),
//       $(el).attr("data-lazy-src"),
//     ];

//     for (const src of candidates) {
//       const resolved = resolveUrl(src, targetUrl);
//       if (resolved && SUPPORTED_EXTENSIONS.test(resolved)) {
//         imageUrls.add(resolved);
//       }
//     }
//   });

//   return [...imageUrls];
// }

// export { scrapeImages };

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
      const src = $(el).attr("src");
      if (src) images.push(new URL(src, targetUrl).href);
    });
    return [...new Set(images)];
  } catch (err) {
    return [];
  }
}