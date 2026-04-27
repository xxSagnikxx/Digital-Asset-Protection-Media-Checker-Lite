import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { generatePerceptualHash, calculateSimilarity } from './utils/hashing.js';
import { scrapeImages } from './utils/scraper.js';
import cron from 'node-cron';
import AdmZip from 'adm-zip';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(cors({ origin: '*' }));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.post('/api/import-zip', upload.single('zip'), async (req, res) => {
    try {
        const zip = new AdmZip(req.file.buffer);
        const zipEntries = zip.getEntries();
        let uploadCount = 0;

        for (const entry of zipEntries) {
            if (entry.isDirectory || !entry.entryName.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

            const imageBuffer = entry.getData();
            const hash = await generatePerceptualHash(imageBuffer);
            const fileName = `official/${Date.now()}-${entry.entryName.split('/').pop()}`;
            
            await supabase.storage.from('official-library').upload(fileName, imageBuffer, { 
                contentType: 'image/jpeg' 
            });

            const { data: { publicUrl } } = supabase.storage.from('official-library').getPublicUrl(fileName);

            await supabase.from('official_assets').insert([{ 
                name: entry.entryName.split('/').pop(), 
                phash: hash, 
                public_url: publicUrl 
            }]);

            uploadCount++;
        }

        res.json({ message: `Success! ${uploadCount} images extracted and indexed.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/verify-official', upload.single('image'), async (req, res) => {
    try {
        const fileName = `official/${Date.now()}-${req.file.originalname}`;
        await supabase.storage.from('official-library').upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
        
        const { data: { publicUrl } } = supabase.storage.from('official-library').getPublicUrl(fileName);
        const hash = await generatePerceptualHash(req.file.buffer);
        
        await supabase.from('official_assets').insert([{ 
            name: req.body.name || req.file.originalname, 
            phash: hash, 
            public_url: publicUrl 
        }]);
        
        res.json({ message: 'Official asset registered successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/scan-suspect', upload.single('image'), async (req, res) => {
    try {
        const suspectHash = await generatePerceptualHash(req.file.buffer);
        const { data: officials } = await supabase.from('official_assets').select('*');
        
        if (!officials || officials.length === 0) return res.status(400).json({ error: "Asset Library empty" });

        let bestMatch = null;
        let highestScore = 0;

        for (const asset of officials) {
            const score = calculateSimilarity(suspectHash, asset.phash);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = asset;
            }
        }

        if (highestScore > 80) {
            await supabase.from('asset_matches').insert([{ 
                official_asset_id: bestMatch.id, 
                suspect_url: 'Global Network Scan', 
                similarity_score: parseFloat(highestScore.toFixed(2)), 
                status: 'pending_review' 
            }]);
            
            return res.json({ 
                match_found: true, 
                score: highestScore.toFixed(2), 
                asset_name: bestMatch.name 
            });
        }

        res.json({ match_found: false, message: 'No unauthorized copies found' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auto-scan-url', async (req, res) => {
    const { url: targetUrl } = req.body;
    try {
        const foundImageUrls = await scrapeImages(targetUrl);
        const { data: officials } = await supabase.from('official_assets').select('*');
        let matchesFound = 0;

        for (const imageUrl of foundImageUrls) {
            try {
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 5000 });
                const suspectHash = await generatePerceptualHash(Buffer.from(response.data));

                for (const asset of officials) {
                    const score = calculateSimilarity(suspectHash, asset.phash);
                    if (score > 85) {
                        await supabase.from('asset_matches').insert([{ 
                            official_asset_id: asset.id, 
                            suspect_url: imageUrl, 
                            source_page_url: targetUrl, 
                            similarity_score: parseFloat(score.toFixed(2)), 
                            status: 'pending_review' 
                        }]);
                        matchesFound++;
                    }
                }
            } catch { continue; }
        }
        res.json({ matches_found: matchesFound, scanned_images: foundImageUrls.length });
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

app.patch('/api/matches/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const { data, error } = await supabase.from('asset_matches').update({ status }).eq('id', id).select();
        if (error) throw error;
        res.json({ message: 'Status updated', match: data[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

cron.schedule('0 * * * *', async () => {
    const targets = ['https://example-sports-blog.com/gallery']; 
    for (const url of targets) {
        
    }
});

app.listen(8080, '127.0.0.1', () => {
    console.log('SYSTEM ONLINE: http://127.0.0.1:8080');
});