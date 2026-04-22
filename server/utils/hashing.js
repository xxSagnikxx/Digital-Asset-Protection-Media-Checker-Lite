import sharp from 'sharp';
import { bmvbhash } from 'blockhash-core';
export async function generatePerceptualHash(imageBuffer) {
  const { data, info } = await sharp(imageBuffer)
    .resize(16, 16, { fit: 'fill' })
    .grayscale()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const imageData = {
    data: Uint8Array.from(data),
    width: info.width,
    height: info.height,
  };
  return bmvbhash(imageData, 8); 
}
export function calculateSimilarity(hash1, hash2) {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return (1 - distance / hash1.length) * 100;
}