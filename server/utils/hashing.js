// import sharp from 'sharp';
// import { bmvbhash } from 'blockhash-core';
 
// const HASH_SIZE = 8;
// const HASH_BITS = HASH_SIZE * HASH_SIZE;
// const IMAGE_DIM = 16;
 
// export async function generatePerceptualHash(imageBuffer) {
//   const { data, info } = await sharp(imageBuffer)
//     .resize(IMAGE_DIM, IMAGE_DIM, { fit: 'fill' })
//     .grayscale()
//     .ensureAlpha()
//     .raw()
//     .toBuffer({ resolveWithObject: true });
 
//   const imageData = {
//     data,
//     width: info.width,
//     height: info.height,
//   };
 
//   return bmvbhash(imageData, HASH_SIZE);
// }
 
// export function calculateSimilarity(hash1, hash2) {
//   if (hash1.length !== hash2.length) {
//     throw new Error('Hashes must be of equal length to compare.');
//   }
 
//   const bits1 = BigInt(`0x${hash1}`);
//   const bits2 = BigInt(`0x${hash2}`);
//   const xor = bits1 ^ bits2;
//   const hammingDistance = xor.toString(2).split('').filter(b => b === '1').length;
 
//   return (1 - hammingDistance / HASH_BITS) * 100;
// }
  

// 2nd


// import sharp from 'sharp';
// import blockhash from 'blockhash-core';

// export async function generatePerceptualHash(imageBuffer) {
//     const { data, info } = await sharp(imageBuffer)
//         .resize(16, 16, { fit: 'fill' })
//         .grayscale()
//         .raw()
//         .toBuffer({ resolveWithObject: true });

//     return blockhash.bmsh({ data, width: info.width, height: info.height }, 4);
// }

// export function calculateSimilarity(hash1, hash2) {
//     let distance = 0;
//     for (let i = 0; i < hash1.length; i++) {
//         if (hash1[i] !== hash2[i]) distance++;
//     }
//     return (1 - distance / hash1.length) * 100;
// }

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

  // Using bmvbhash (the standard for this library)
  return bmvbhash(imageData, 8); 
}

export function calculateSimilarity(hash1, hash2) {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return (1 - distance / hash1.length) * 100;
}