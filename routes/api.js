import { Router } from 'express';
import axios from 'axios'; 
import { Settings } from '../lib/db.js'; 
import Dramabox from '../lib/dramabox-class.js'; 
import { allepisode as nsDetail, search as nsSearch, foryou as nsHome } from '../lib/netshort.js';
import { meloloSearch, meloloDetail, meloloLinkStream, meloloLatest, meloloTrending } from '../lib/melolo.js';

const router = Router();

const createProxyUrl = (rawUrl) => {
    if (!rawUrl) return null;
    return `/api/proxy?url=${encodeURIComponent(rawUrl)}`;
};

const formatNetshortItem = (item) => ({
    id: item.shortPlayId, bookId: item.shortPlayId, source: 'netshort',
    name: item.shortPlayName, title: item.shortPlayName,
    cover: item.shortPlayCover || "https://placehold.co/300x450?text=No+Cover",
    poster: item.shortPlayCover, chapterCount: item.chapterCount || 0,
    introduction: item.introduction || "Sinopsis tidak tersedia.",
    playCount: item.heatScoreShow || "", tags: item.labelArray || [], status: 1
});

// ============================================
// NORMALISASI DATA DARI SEMUA PROVIDER
// ============================================
const normalizeDramaItem = (item, source) => {
    switch(source) {
        case 'melolo':
            return {
                shortPlayId: item.book_id,
                id: item.book_id,
                bookId: item.book_id,
                shortPlayName: item.book_name,
                name: item.book_name,
                title: item.book_name,
                shortPlayCover: item.thumb_url || item.cover_url,
                cover: item.thumb_url || item.cover_url,
                coverUrl: item.thumb_url || item.cover_url,
                heatScoreShow: item.play_count || "HOT",
                playCount: item.play_count,
                chapterCount: item.episode_count || 0,
                labelArray: item.tags || [],
                tags: item.tags || [],
                introduction: item.abstract || "",
                source: 'melolo'
            };
        case 'netshort':
            return {
                shortPlayId: item.shortPlayId,
                id: item.shortPlayId,
                bookId: item.shortPlayId,
                shortPlayName: item.shortPlayName,
                name: item.shortPlayName,
                title: item.shortPlayName,
                shortPlayCover: item.shortPlayCover,
                cover: item.shortPlayCover,
                coverUrl: item.shortPlayCover,
                heatScoreShow: item.heatScoreShow || "HOT",
                playCount: item.heatScoreShow,
                chapterCount: item.chapterCount || 0,
                labelArray: item.labelArray || [],
                tags: item.labelArray || [],
                introduction: item.introduction || "",
                source: 'netshort'
            };
        case 'dramabox':
            return {
                shortPlayId: item.bookId || item.id,
                id: item.bookId || item.id,
                bookId: item.bookId || item.id,
                shortPlayName: item.bookName || item.name,
                name: item.bookName || item.name,
                title: item.bookName || item.name,
                shortPlayCover: item.cover || item.coverWap,
                cover: item.cover || item.coverWap,
                coverUrl: item.cover || item.coverWap,
                heatScoreShow: item.playCount || "HOT",
                playCount: item.playCount,
                chapterCount: item.chapterCount || 0,
                labelArray: item.tags || [],
                tags: item.tags || [],
                introduction: item.introduction || item.briefIntroduction || "",
                source: 'dramabox'
            };
        default:
            return item;
    }
};

// ============================================
// MELOLO ROUTES
// ============================================

// GET /api/melolo/latest - Drama Terbaru
router.get('/melolo/latest', async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=600');
        const result = await meloloLatest();
        
        // Normalisasi data Melolo
        if (result && result.data && result.data.books) {
            const normalizedBooks = result.data.books.map(item => normalizeDramaItem(item, 'melolo'));
            return res.json({
                status: true,
                success: true,
                data: normalizedBooks,
                isMore: true
            });
        }
        
        res.json(result);
    } catch (error) {
        console.error("[API] Melolo Latest Error:", error.message);
        res.status(500).json({ status: false, error: 'Server error', message: error.message });
    }
});

// GET /api/melolo/trending - Drama Trending
router.get('/melolo/trending', async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=600');
        const result = await meloloTrending();
        
        // Normalisasi data Melolo
        if (result && result.data && result.data.books) {
            const normalizedBooks = result.data.books.map(item => normalizeDramaItem(item, 'melolo'));
            return res.json({
                status: true,
                success: true,
                data: normalizedBooks,
                isMore: true
            });
        }
        
        res.json(result);
    } catch (error) {
        console.error("[API] Melolo Trending Error:", error.message);
        res.status(500).json({ status: false, error: 'Server error', message: error.message });
    }
});

// GET /api/melolo/search?q=query - Cari Drama
router.get('/melolo/search', async (req, res) => {
    try {
        const { q, limit = 10, offset = 0 } = req.query;
        if (!q) return res.status(400).json({ status: false, error: 'Parameter "q" required' });
        
        const result = await meloloSearch(q, parseInt(limit), parseInt(offset));
        
        // Normalisasi data Melolo
        if (result && result.data && result.data.books) {
            const normalizedBooks = result.data.books.map(item => normalizeDramaItem(item, 'melolo'));
            return res.json({
                status: true,
                success: true,
                data: normalizedBooks
            });
        }
        
        res.json(result);
    } catch (error) {
        console.error("[API] Melolo Search Error:", error.message);
        res.status(500).json({ status: false, error: 'Server error', message: error.message });
    }
});

// GET /api/melolo/detail/:seriesId OR /api/melolo/detail?bookId=XXX
router.get(['/melolo/detail/:seriesId', '/melolo/detail'], async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=3600');
        const seriesId = req.params.seriesId || req.query.bookId;
        
        if (!seriesId) {
            return res.status(400).json({ status: false, error: 'bookId parameter required' });
        }
        
        console.log(`[API] Melolo Detail request for: ${seriesId}`);
        const result = await meloloDetail(seriesId);
        res.json(result);
    } catch (error) {
        console.error("[API] Melolo Detail Error:", error.message);
        res.status(500).json({ status: false, error: 'Server error', message: error.message });
    }
});

// GET /api/melolo/stream?videoId=XXX - Stream Drama (UPDATED)
router.get('/melolo/stream', async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache');
        const { videoId } = req.query;
        
        if (!videoId) {
            return res.status(400).json({ 
                status: false, 
                code: 400,
                message: 'videoId parameter required',
                data: {} 
            });
        }
        
        console.log(`[API] Melolo Stream request for videoId: ${videoId}`);
        const result = await meloloLinkStream(videoId);
        
        // Jika error dari API Melolo, return dengan status code yang sesuai
        if (!result.status || result.code !== 0) {
            return res.status(result.code === 101000 ? 503 : 400).json(result);
        }
        
        // Success response
        res.json(result);
    } catch (error) {
        console.error("[API] Melolo Stream Error:", error.message);
        res.status(500).json({ 
            status: false, 
            code: 500,
            message: error.message,
            data: {} 
        });
    }
});

// ============================================
// EXISTING ROUTES (NetShort, DramaBox, etc.)
// ============================================

// PROXY VIDEO
router.get('/proxy', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("URL video tidak ditemukan");
    try {
        const headers = { 'User-Agent': 'okhttp/4.10.0', 'Referer': 'https://www.dramabox.com/' };
        if (req.headers.range) headers['Range'] = req.headers.range;
        const response = await axios({
            method: 'GET', url: videoUrl, responseType: 'stream', headers: headers,
            validateStatus: status => status >= 200 && status < 300
        });
        res.status(response.status);
        ['content-type', 'content-length', 'content-range', 'accept-ranges'].forEach(h => {
            if (response.headers[h]) res.set(h.replace(/\b\w/g, l => l.toUpperCase()), response.headers[h]);
        });
        response.data.pipe(res);
    } catch (error) { if (!res.headersSent) res.status(500).send("Proxy Error"); }
});

// VIP CONTENT
router.get('/vip', async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=600');
        const lang = req.query.lang || 'in';
        const dramabox = new Dramabox(lang);
        const result = await dramabox.getVIPContent();
        res.json({ success: true, data: result });
    } catch (e) { 
        res.status(500).json({ success: false, message: e.message }); 
    }
});

// REKOMENDASI (FIXED)
router.get('/recommend', async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=600');
        const dramabox = new Dramabox('in');
        const result = await dramabox.getRecommendedBooks(1);
        res.json({ success: true, data: result });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// HOME & SEARCH
router.get('/home', async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=300'); 
        const source = req.query.source || req.query.server || 'dramabox';
        
        if (source === 'netshort') {
            const rawData = await nsHome(parseInt(req.query.page) || 1);
            const list = rawData.contentInfos || [];
            return res.json({ status: true, success: true, data: list.map(formatNetshortItem), isMore: list.length > 0 });
        }
        
        if (source === 'melolo') {
            const result = await meloloLatest();
            
            // Normalisasi data Melolo
            if (result && result.data && result.data.books) {
                const normalizedBooks = result.data.books.map(item => normalizeDramaItem(item, 'melolo'));
                return res.json({
                    status: true,
                    success: true,
                    data: normalizedBooks,
                    isMore: true
                });
            }
            
            return res.json(result);
        }
        
        const dramabox = new Dramabox('in');
        const result = await dramabox.getRecommendedBooks(req.query.page || 1);
        const labeledData = result.map(item => ({ ...item, source: 'dramabox' }));
        return res.json({ status: true, success: true, data: labeledData, isMore: true });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/search', async (req, res) => {
    try {
        const source = req.query.source || req.query.server || 'dramabox';
        const query = req.query.q || req.query.query || "";
        
        if (source === 'netshort') {
            const rawData = await nsSearch(query);
            const list = Array.isArray(rawData) ? rawData : (rawData.contentInfos || []);
            return res.json({ status: true, success: true, data: list.map(formatNetshortItem) });
        }
        
        if (source === 'melolo') {
            const result = await meloloSearch(query);
            
            // Normalisasi data Melolo
            if (result && result.data && result.data.books) {
                const normalizedBooks = result.data.books.map(item => normalizeDramaItem(item, 'melolo'));
                return res.json({
                    status: true,
                    success: true,
                    data: normalizedBooks
                });
            }
            
            return res.json(result);
        }
        
        const dramabox = new Dramabox('in');
        const result = await dramabox.searchDrama(query);
        const labeledData = result.map(item => ({ ...item, source: 'dramabox' }));
        return res.json({ status: true, success: true, data: labeledData });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// DETAIL V2 (FIX JUMLAH EPISODE) + MELOLO FALLBACK
router.get(['/detail/:bookId', '/detail/:bookId/v2'], async (req, res) => {
    try {
        res.set('Cache-Control', 'public, max-age=3600');
        const source = req.query.source || req.query.server || 'dramabox';
        const bookId = req.params.bookId;
        
        // Handle Melolo Provider
        if (source === 'melolo') {
            console.log(`[API] Routing melolo to detail handler for: ${bookId}`);
            const result = await meloloDetail(bookId);
            return res.json(result);
        }
        
        if (source === 'netshort') {
            const nsData = await nsDetail(bookId);
            return res.json({
                ...nsData,
                id: bookId, source: 'netshort',
                name: nsData.shortPlayName || nsData.name, cover: nsData.shortPlayCover || nsData.cover,
                chapters: (nsData.chapters || []).map(ch => ({ ...ch, url: ch.url || null }))
            });
        }
        
        // DRAMABOX LOGIC
        const dramabox = new Dramabox('in');
        const fullData = await dramabox.getChaptersWithMetadata(bookId);
        
        const d = fullData.metadata || {};
        const chs = fullData.chapters || [];

        const finalName = d.bookName || "Judul Tidak Ditemukan";
        const finalCover = d.cover || d.coverWap || "https://placehold.co/300x450?text=No+Cover";
        const finalIntro = d.introduction || d.briefIntroduction || "Sinopsis tidak tersedia.";
        
        const formattedChapters = chs.map(ch => ({
            id: ch.id,
            index: ch.index,
            name: ch.name || `Episode ${ch.index + 1}`,
            url: ch.url ? createProxyUrl(ch.url) : null,
            videoPath: ch.url
        }));

        return res.json({ 
            status: true, 
            success: true, 
            data: {
                id: bookId,
                bookId: bookId,
                source: 'dramabox',
                name: finalName,
                cover: finalCover,
                introduction: finalIntro,
                chapters: formattedChapters,
                episode_count: formattedChapters.length
            }
        });

    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/stream', async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache'); 
        const { bookId, episode } = req.query;
        if (!bookId) return res.status(400).json({ status: false, message: "Book ID required" });
        
        const dramabox = new Dramabox('in');
        const index = parseInt(episode) || 0;
        const result = await dramabox.request("/drama-box/chapterv2/batch/load", {
            boundaryIndex: 0, comingPlaySectionId: -1, index: index,
            currencyPlaySource: "discover_new_rec_new", needEndRecommend: 0,
            preLoad: false, loadDirection: 0, bookId: bookId.toString()
        });

        const list = result?.data?.chapterList || [];
        const targetChapter = list.find(ch => (ch.index === index) || (ch.id == episode)) || list[0];

        if (!targetChapter) return res.status(404).json({ status: false, message: "Video belum tersedia" });

        const cdn = targetChapter.cdnList?.find(c => c.isDefault === 1) || targetChapter.cdnList?.[0];
        let videoInfo = cdn?.videoPathList?.find(v => v.isDefault === 1);
        if (!videoInfo && cdn?.videoPathList) videoInfo = cdn.videoPathList.find(v => v.quality === 720) || cdn.videoPathList[0];

        if (!videoInfo?.videoPath) return res.status(404).json({ status: false, message: "Link rusak/VIP" });

        res.json({ status: true, success: true, url: createProxyUrl(videoInfo.videoPath), quality: videoInfo.quality });
    } catch (e) { res.status(500).json({ status: false, message: e.message }); }
});

// LEGACY
router.get('/dramabox/allepisode', async (req, res) => { try { res.set('Cache-Control', 'public, max-age=3600'); const finalData = await getFullDramaData(req, req.query.shortPlayId, 'in'); res.json({ status: true, success: true, data: finalData }); } catch (e) { res.status(500).json({ status: false, message: e.message }); } });
router.get('/dramabox/foryou', async (req, res) => { try { const r = await new Dramabox('in').getRecommendedBooks(parseInt(req.query.page)||1); res.json({status:true,success:true,data:r}); } catch (e) { res.status(500).json({error:e.message}); } });
router.get('/dramabox/search', async (req, res) => { try { const r = await new Dramabox('in').searchDrama(req.query.query); res.json({status:true,success:true,data:r}); } catch (e) { res.status(500).json({error:e.message}); } });
router.get('/netshort/foryou', async (req, res) => { try { const r = await nsHome(parseInt(req.query.page)||1); res.json(r); } catch (e) { res.status(500).json({error:e.message}); } });
router.get('/netshort/search', async (req, res) => { try { const r = await nsSearch(req.query.query); res.json(r); } catch (e) { res.status(500).json({error:e.message}); } });
router.get('/netshort/allepisode', async (req, res) => { try { const r = await nsDetail(req.query.shortPlayId); res.json(r); } catch (e) { res.status(500).json({error:e.message}); } });
router.get('/admin/config', async (req, res) => { try { let c = await Settings.findOne(); if (!c) c = await Settings.create({ siteName: "StreamHub Indo" }); res.json(c); } catch (e) { res.status(500).json({ error: "DB" }); } });
router.post('/admin/update-all', async (req, res) => { const { newName, newDesc, newLogo, password } = req.body; try { const c = await Settings.findOne(); if (c.adminPassword && c.adminPassword !== password) return res.status(401).json({ success: false }); c.siteName = newName; if(newDesc) c.siteDescription = newDesc; if(newLogo) c.logoUrl = newLogo; await c.save(); res.json({ success: true }); } catch (e) { res.status(500).json({ success: false }); } });

export default router;