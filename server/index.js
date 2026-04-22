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
app.post('/api/auto-scan-url', async (req, res) => {
    const { url: targetUrl } = req.body;
    if (!targetUrl) return res.status(400).json({ error: 'URL is required' });

    try {
        const foundImageUrls = await scrapeImages(targetUrl);
        const { data: officials } = await supabase.from('official_assets').select('*');
        let matchesFound = 0;
        for (const imageUrl of foundImageUrls) {
            try {
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data);
                const suspectHash = await generatePerceptualHash(buffer);
                for (const asset of officials) {
                    const score = calculateSimilarity(suspectHash, asset.phash);
                    if (score > 85) {
                        await supabase.from('asset_matches').insert([{
                            official_asset_id: asset.id,
                            suspect_url: imageUrl, 
                            source_page_url: targetUrl, 
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