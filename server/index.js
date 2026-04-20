// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import multer from 'multer';
// import { createClient } from '@supabase/supabase-js';
// import { generatePerceptualHash, calculateSimilarity } from './utils/hashing.js';
// import { scrapeImages } from './utils/scraper.js'; // Changed to match your filename

// // ─── Supabase (Fixed Variable Names) ───────────────────────────────────────────
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY // Matched to your .env
// );

// const app = express();
// const upload = multer({ storage: multer.memoryStorage() });

// app.use(express.json());
// app.use(cors({
//   origin: '*', // Allows your frontend to connect without "Failed to Fetch"
//   methods: ['GET', 'POST'],
// }));

// // ─── Health Check ───────────────────────────────────────────────────────────
// app.get('/', (req, res) => res.send('IP-Fortress Engine is Online'));

// // ─── POST /api/verify-official ────────────────────────────────────────────────
// app.post('/api/verify-official', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No image provided.' });
    
//     const filename = `${Date.now()}-${req.file.originalname}`;
//     await supabase.storage.from('official-library').upload(filename, req.file.buffer, { contentType: req.file.mimetype });
//     const { data } = supabase.storage.from('official-library').getPublicUrl(filename);
    
//     const phash = await generatePerceptualHash(req.file.buffer);
//     await supabase.from('official_assets').insert({ 
//       name: req.body.name || filename, 
//       phash: phash, 
//       public_url: data.publicUrl 
//     });

//     res.status(201).json({ message: 'Asset Registered' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─── POST /api/auto-scan-url ──────────────────────────────────────────────────
// app.post('/api/auto-scan-url', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'URL is required' });

//   try {
//     const imageUrls = await scrapeImages(url);
//     res.json({ message: 'Scan Initiated', imagesFound: imageUrls.length });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = 8080;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`ENGINE LIVE: http://localhost:${PORT}`);
// });

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

// // 1. Register Official Asset
// app.post('/api/verify-official', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No image provided.' });
//     const filename = `${Date.now()}-${req.file.originalname}`;
//     await supabase.storage.from('official-library').upload(filename, req.file.buffer, { contentType: req.file.mimetype });
//     const { data } = supabase.storage.from('official-library').getPublicUrl(filename);
//     const phash = await generatePerceptualHash(req.file.buffer);
//     await supabase.from('official_assets').insert({ name: req.body.name || filename, phash, public_url: data.publicUrl });
//     res.status(201).json({ message: 'Official asset registered' });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // 2. Scan Suspect Image (RESTORED)
// app.post('/api/scan-suspect', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No image provided.' });
//     const suspectHash = await generatePerceptualHash(req.file.buffer);
//     const { data: officials } = await supabase.from('official_assets').select('*');
    
//     let matches = officials.map(asset => ({
//       asset,
//       similarity: calculateSimilarity(suspectHash, asset.phash)
//     })).filter(m => m.similarity > 85);

//     res.json({ matches_found: matches.length, matches });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // 3. Get All Reports (RESTORED)
// app.get('/api/reports', async (req, res) => {
//   try {
//     const { data, error } = await supabase.from('asset_matches').select('*, official_assets(*)').order('created_at', { ascending: false });
//     if (error) throw error;
//     res.json({ reports: data });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// // 4. URL Scraper
// app.post('/api/auto-scan-url', async (req, res) => {
//   try {
//     const { url } = req.body;
//     const imageUrls = await scrapeImages(url);
//     res.json({ message: 'Scrape successful', found: imageUrls.length, urls: imageUrls });
//   } catch (err) { res.status(500).json({ error: err.message }); }
// });

// app.listen(8080, '0.0.0.0', () => console.log('SYSTEM FULLY ONLINE: http://localhost:8080'));

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { generatePerceptualHash, calculateSimilarity } from './utils/hashing.js';
import { scrapeImages } from './utils/scraper.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(cors({ origin: '*' }));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// 1. Register Official
app.post('/api/verify-official', upload.single('image'), async (req, res) => {
    try {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        await supabase.storage.from('official-library').upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
        const { data: { publicUrl } } = supabase.storage.from('official-library').getPublicUrl(fileName);
        const hash = await generatePerceptualHash(req.file.buffer);
        await supabase.from('official_assets').insert([{ name: req.body.name || req.file.originalname, phash: hash, public_url: publicUrl }]);
        res.json({ message: 'Success' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Scan Suspect & SAVE TO DB
app.post('/api/scan-suspect', upload.single('image'), async (req, res) => {
    try {
        const suspectHash = await generatePerceptualHash(req.file.buffer);
        const { data: officials } = await supabase.from('official_assets').select('*');
        
        for (const asset of officials) {
            const score = calculateSimilarity(suspectHash, asset.phash);
            if (score > 85) {
                await supabase.from('asset_matches').insert([{
                    official_asset_id: asset.id,
                    suspect_url: 'Manual Upload',
                    similarity_score: parseFloat(score.toFixed(2)),
                    status: 'detected'
                }]);
            }
        }
        res.json({ message: 'Scan complete. Check reports.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Get Reports (Fixed column issue)
app.get('/api/reports', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('asset_matches')
            .select('*, official_assets(name, public_url)')
            .order('created_at', { ascending: false }); // This is what was failing
        if (error) throw error;
        res.json({ reports: data });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(8080, '127.0.0.1', () => console.log('SYSTEM LIVE: http://127.0.0.1:8080'));