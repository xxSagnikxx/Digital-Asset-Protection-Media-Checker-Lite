// // // import 'dotenv/config';
// // // import express from 'express';
// // // import cors from 'cors';
// // // import multer from 'multer';
// // // import { createClient } from '@supabase/supabase-js';
// // // import { generatePerceptualHash, calculateSimilarity } from './utils/hashing.js';
// // // import { scrapeImages } from './utils/scraper.js'; // Changed to match your filename

// // // // ─── Supabase (Fixed Variable Names) ───────────────────────────────────────────
// // // const supabase = createClient(
// // //   process.env.SUPABASE_URL,
// // //   process.env.SUPABASE_SERVICE_ROLE_KEY // Matched to your .env
// // // );

// // // const app = express();
// // // const upload = multer({ storage: multer.memoryStorage() });

// // // app.use(express.json());
// // // app.use(cors({
// // //   origin: '*', // Allows your frontend to connect without "Failed to Fetch"
// // //   methods: ['GET', 'POST'],
// // // }));

// // // // ─── Health Check ───────────────────────────────────────────────────────────
// // // app.get('/', (req, res) => res.send('IP-Fortress Engine is Online'));

// // // // ─── POST /api/verify-official ────────────────────────────────────────────────
// // // app.post('/api/verify-official', upload.single('image'), async (req, res) => {
// // //   try {
// // //     if (!req.file) return res.status(400).json({ error: 'No image provided.' });
    
// // //     const filename = `${Date.now()}-${req.file.originalname}`;
// // //     await supabase.storage.from('official-library').upload(filename, req.file.buffer, { contentType: req.file.mimetype });
// // //     const { data } = supabase.storage.from('official-library').getPublicUrl(filename);
    
// // //     const phash = await generatePerceptualHash(req.file.buffer);
// // //     await supabase.from('official_assets').insert({ 
// // //       name: req.body.name || filename, 
// // //       phash: phash, 
// // //       public_url: data.publicUrl 
// // //     });

// // //     res.status(201).json({ message: 'Asset Registered' });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // });

// // // // ─── POST /api/auto-scan-url ──────────────────────────────────────────────────
// // // app.post('/api/auto-scan-url', async (req, res) => {
// // //   const { url } = req.body;
// // //   if (!url) return res.status(400).json({ error: 'URL is required' });

// // //   try {
// // //     const imageUrls = await scrapeImages(url);
// // //     res.json({ message: 'Scan Initiated', imagesFound: imageUrls.length });
// // //   } catch (err) {
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // });

// // // const PORT = 8080;
// // // app.listen(PORT, '0.0.0.0', () => {
// // //   console.log(`ENGINE LIVE: http://localhost:${PORT}`);
// // // });

// // // import 'dotenv/config';
// // // import express from 'express';
// // // import cors from 'cors';
// // // import multer from 'multer';
// // // import { createClient } from '@supabase/supabase-js';
// // // import { generatePerceptualHash, calculateSimilarity } from './utils/hashing.js';
// // // import { scrapeImages } from './utils/scraper.js';

// // // const app = express();
// // // const upload = multer({ storage: multer.memoryStorage() });

// // // app.use(express.json());
// // // app.use(cors({ origin: '*' }));

// // // const supabase = createClient(
// // //   process.env.SUPABASE_URL,
// // //   process.env.SUPABASE_SERVICE_ROLE_KEY
// // // );

// // // // 1. Register Official Asset
// // // app.post('/api/verify-official', upload.single('image'), async (req, res) => {
// // //   try {
// // //     if (!req.file) return res.status(400).json({ error: 'No image provided.' });
// // //     const filename = `${Date.now()}-${req.file.originalname}`;
// // //     await supabase.storage.from('official-library').upload(filename, req.file.buffer, { contentType: req.file.mimetype });
// // //     const { data } = supabase.storage.from('official-library').getPublicUrl(filename);
// // //     const phash = await generatePerceptualHash(req.file.buffer);
// // //     await supabase.from('official_assets').insert({ name: req.body.name || filename, phash, public_url: data.publicUrl });
// // //     res.status(201).json({ message: 'Official asset registered' });
// // //   } catch (err) { res.status(500).json({ error: err.message }); }
// // // });

// // // // 2. Scan Suspect Image (RESTORED)
// // // app.post('/api/scan-suspect', upload.single('image'), async (req, res) => {
// // //   try {
// // //     if (!req.file) return res.status(400).json({ error: 'No image provided.' });
// // //     const suspectHash = await generatePerceptualHash(req.file.buffer);
// // //     const { data: officials } = await supabase.from('official_assets').select('*');
    
// // //     let matches = officials.map(asset => ({
// // //       asset,
// // //       similarity: calculateSimilarity(suspectHash, asset.phash)
// // //     })).filter(m => m.similarity > 85);

// // //     res.json({ matches_found: matches.length, matches });
// // //   } catch (err) { res.status(500).json({ error: err.message }); }
// // // });

// // // // 3. Get All Reports (RESTORED)
// // // app.get('/api/reports', async (req, res) => {
// // //   try {
// // //     const { data, error } = await supabase.from('asset_matches').select('*, official_assets(*)').order('created_at', { ascending: false });
// // //     if (error) throw error;
// // //     res.json({ reports: data });
// // //   } catch (err) { res.status(500).json({ error: err.message }); }
// // // });

// // // // 4. URL Scraper
// // // app.post('/api/auto-scan-url', async (req, res) => {
// // //   try {
// // //     const { url } = req.body;
// // //     const imageUrls = await scrapeImages(url);
// // //     res.json({ message: 'Scrape successful', found: imageUrls.length, urls: imageUrls });
// // //   } catch (err) { res.status(500).json({ error: err.message }); }
// // // });

// // // app.listen(8080, '0.0.0.0', () => console.log('SYSTEM FULLY ONLINE: http://localhost:8080'));

// // import 'dotenv/config';
// // import express from 'express';
// // import cors from 'cors';
// // import multer from 'multer';
// // import { createClient } from '@supabase/supabase-js';
// // import { generatePerceptualHash, calculateSimilarity } from './utils/hashing.js';
// // import { scrapeImages } from './utils/scraper.js';

// // const app = express();
// // const upload = multer({ storage: multer.memoryStorage() });

// // app.use(express.json());
// // app.use(cors({ origin: '*' }));

// // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// // // 1. Register Official
// // app.post('/api/verify-official', upload.single('image'), async (req, res) => {
// //     try {
// //         const fileName = `${Date.now()}-${req.file.originalname}`;
// //         await supabase.storage.from('official-library').upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
// //         const { data: { publicUrl } } = supabase.storage.from('official-library').getPublicUrl(fileName);
// //         const hash = await generatePerceptualHash(req.file.buffer);
// //         await supabase.from('official_assets').insert([{ name: req.body.name || req.file.originalname, phash: hash, public_url: publicUrl }]);
// //         res.json({ message: 'Success' });
// //     } catch (err) { res.status(500).json({ error: err.message }); }
// // });

// // // 2. Scan Suspect & SAVE TO DB
// // app.post('/api/scan-suspect', upload.single('image'), async (req, res) => {
// //     try {
// //         const suspectHash = await generatePerceptualHash(req.file.buffer);
// //         const { data: officials } = await supabase.from('official_assets').select('*');
        
// //         for (const asset of officials) {
// //             const score = calculateSimilarity(suspectHash, asset.phash);
// //             if (score > 85) {
// //                 await supabase.from('asset_matches').insert([{
// //                     official_asset_id: asset.id,
// //                     suspect_url: 'Manual Upload',
// //                     similarity_score: parseFloat(score.toFixed(2)),
// //                     status: 'detected'
// //                 }]);
// //             }
// //         }
// //         res.json({ message: 'Scan complete. Check reports.' });
// //     } catch (err) { res.status(500).json({ error: err.message }); }
// // });

// // // 3. Get Reports (AMBIGUITY FIXED)
// // app.get('/api/reports', async (req, res) => {
// //     try {
// //         const { data, error } = await supabase
// //             .from('asset_matches')
// //             // The "!" tells Supabase exactly which relationship to use
// //             .select(`
// //                 *,
// //                 official_assets!official_asset_id (
// //                     name,
// //                     public_url
// //                 )
// //             `)
// //             .order('created_at', { ascending: false });

// //         if (error) {
// //             console.error("Supabase Error:", error);
// //             throw error;
// //         }
        
// //         res.json({ reports: data });
// //     } catch (err) { 
// //         res.status(500).json({ error: err.message }); 
// //     }
// // });

// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import multer from 'multer';
// import { createClient } from '@supabase/supabase-js';
// import { generatePerceptualHash, calculateSimilarity } from './utils/hashing.js';
// import { scrapeImages } from './utils/scraper.js';

// const app = express();
// const upload = multer({ storage: multer.memoryStorage() });

// app.use(express.json());
// app.use(cors({ origin: '*' }));

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// // 1. REGISTER OFFICIAL ASSET
// app.post('/api/verify-official', upload.single('image'), async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ error: 'No image provided.' });

//         const fileName = `${Date.now()}-${req.file.originalname}`;
//         const { error: uploadError } = await supabase.storage
//             .from('official-library')
//             .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

//         if (uploadError) throw uploadError;

//         const { data: { publicUrl } } = supabase.storage.from('official-library').getPublicUrl(fileName);
//         const hash = await generatePerceptualHash(req.file.buffer);

//         await supabase.from('official_assets').insert([{ 
//             name: req.body.name || req.file.originalname, 
//             phash: hash, 
//             public_url: publicUrl 
//         }]);

//         res.json({ message: 'Success' });
//     } catch (err) { 
//         console.error(err);
//         res.status(500).json({ error: err.message }); 
//     }
// });

// // 2. SCAN SUSPECT & SAVE MATCHES (THIS IS STEP 3)
// app.post('/api/scan-suspect', upload.single('image'), async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ error: 'No image provided.' });

//         const suspectHash = await generatePerceptualHash(req.file.buffer);
//         const { data: officials, error: fetchError } = await supabase.from('official_assets').select('*');
        
//         if (fetchError) throw fetchError;

//         let matchesCreated = 0;

//         for (const asset of officials) {
//             const score = calculateSimilarity(suspectHash, asset.phash);
            
//             // If the image is a match (>85%)
//             if (score > 85) {
//                 const { error: insertError } = await supabase.from('asset_matches').insert([{
//                     official_asset_id: asset.id, // Explicit ID link
//                     suspect_url: 'Manual Upload',
//                     similarity_score: parseFloat(score.toFixed(2)),
//                     status: 'detected'
//                 }]);
                
//                 if (insertError) console.error("Insert Error:", insertError);
//                 else matchesCreated++;
//             }
//         }
        
//         res.json({ message: `Scan complete. Found and saved ${matchesCreated} matches.` });
//     } catch (err) { 
//         console.error(err);
//         res.status(500).json({ error: err.message }); 
//     }
// });

// // 3. GET REPORTS (FINAL FIX FOR ALIAS ERROR)
// app.get('/api/reports', async (req, res) => {
//     try {
//         const { data, error } = await supabase
//             .from('asset_matches')
//             .select(`
//                 id,
//                 similarity_score,
//                 created_at,
//                 status,
//                 suspect_url,
//                 official_assets (
//                     name,
//                     public_url
//                 )
//             `)
//             .order('created_at', { ascending: false });

//         if (error) {
//             // If it still complains about the join, we do a "Two-Step" fetch as a fallback
//             console.error("Join Error, attempting fallback...", error);
//             const { data: simpleData } = await supabase.from('asset_matches').select('*').order('created_at', { ascending: false });
//             return res.json({ reports: simpleData });
//         }
        
//         res.json({ reports: data });
//     } catch (err) { 
//         res.status(500).json({ error: err.message }); 
//     }
// });

// const PORT = 8080;
// app.listen(PORT, '127.0.0.1', () => {
//     console.log(`ENGINE FULLY OPERATIONAL: http://127.0.0.1:${PORT}`);
// });

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { generatePerceptualHash, calculateSimilarity } from './utils/hashing.js';
import axios from 'axios';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
app.use(cors({ origin: '*' }));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 1. UPLOAD OFFICIAL (MUST DO THIS FIRST)
app.post('/api/verify-official', upload.single('image'), async (req, res) => {
    try {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        await supabase.storage.from('official-library').upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
        const { data: { publicUrl } } = supabase.storage.from('official-library').getPublicUrl(fileName);
        const hash = await generatePerceptualHash(req.file.buffer);

        await supabase.from('official_assets').insert([{ 
            name: req.body.name || req.file.originalname, 
            phash: hash, 
            public_url: publicUrl 
        }]);
        res.json({ message: 'Official asset registered successfully!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. SCAN SUSPECT
app.post('/api/scan-suspect', upload.single('image'), async (req, res) => {
    try {
        const suspectHash = await generatePerceptualHash(req.file.buffer);
        const { data: officials } = await supabase.from('official_assets').select('*');
        
        if (!officials || officials.length === 0) {
            return res.status(400).json({ error: "No official assets found. Upload to Asset Library first!" });
        }

        let matchCount = 0;
        for (const asset of officials) {
            const score = calculateSimilarity(suspectHash, asset.phash);
            if (score > 85) {
                await supabase.from('asset_matches').insert([{
                    official_asset_id: asset.id,
                    suspect_url: 'Manual Upload Scan',
                    similarity_score: parseFloat(score.toFixed(2))
                }]);
                matchCount++;
            }
        }
        res.json({ message: `Scan finished. Found ${matchCount} matches.` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. GET REPORTS
app.get('/api/reports', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('asset_matches')
            .select('*, official_assets(name, public_url)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ reports: data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. ACTIVE URL HUNT (Scrape and Compare)
app.post('/api/auto-scan-url', async (req, res) => {
    const { url: targetUrl } = req.body;
    if (!targetUrl) return res.status(400).json({ error: 'URL is required' });

    try {
        // 1. Scrape all image URLs from the site
        const foundImageUrls = await scrapeImages(targetUrl);
        const { data: officials } = await supabase.from('official_assets').select('*');
        
        let matchesFound = 0;

        // 2. Process each image found on the website
        for (const imageUrl of foundImageUrls) {
            try {
                // Download image and hash it
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data);
                const suspectHash = await generatePerceptualHash(buffer);

                // 3. Compare against every official asset
                for (const asset of officials) {
                    const score = calculateSimilarity(suspectHash, asset.phash);
                    
                    if (score > 85) {
                        await supabase.from('asset_matches').insert([{
                            official_asset_id: asset.id,
                            suspect_url: imageUrl, // Records the exact URL where it was found
                            source_page_url: targetUrl, // Records the website it was found on
                            similarity_score: parseFloat(score.toFixed(2)),
                            status: 'detected'
                        }]);
                        matchesFound++;
                    }
                }
            } catch (imgErr) {
                console.error(`Skipping ${imageUrl}: ${imgErr.message}`);
            }
        }

        res.json({ 
            message: `Hunt complete. Scanned ${foundImageUrls.length} images and found ${matchesFound} matches.`,
            images_scanned: foundImageUrls.length,
            matches_found: matchesFound 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8080, '127.0.0.1', () => console.log('SYSTEM ONLINE: http://127.0.0.1:8080'));