# 🔍 Melolo API Debugging Guide

## Status Perbaikan
✅ **File diperbaiki:**
- `routes/api.js` - Normalisasi data format
- `lib/melolo.js` - Error handling & dynamic parsing

## Cara Test Endpoint

### 1. Test Latest/Trending
```bash
# Latest
curl https://sukadracin.online/api/melolo/latest

# Trending  
curl https://sukadracin.online/api/melolo/trending
```

**Expected Response:**
```json
{
  "status": true,
  "success": true,
  "data": [
    {
      "shortPlayId": "7582454785920470021",
      "shortPlayName": "Drama Title",
      "shortPlayCover": "https://...",
      "source": "melolo"
    }
  ]
}
```

### 2. Test Detail
```bash
curl "https://sukadracin.online/api/melolo/detail?bookId=7582454785920470021"
```

**Expected Response:**
```json
{
  "status": true,
  "data": {
    "series_name": "Drama Title",
    "abstract": "Description...",
    "thumb_url": "https://...",
    "video_list": [
      {
        "vid": "123",
        "episode_index": 1,
        "title": "Episode 1"
      }
    ]
  }
}
```

### 3. Test Search
```bash
curl "https://sukadracin.online/api/melolo/search?q=drama"
```

## Cek Server Logs

Setelah restart server, lihat log untuk debugging:

```bash
# Lihat log real-time
tail -f /path/to/your/logs/stdout.log

# atau jika pakai PM2
pm2 logs palengen
```

**Log yang akan muncul:**
```
[Melolo Latest] Response structure: {...}
[Melolo Latest] Found books at index 2, count: 20
[Melolo Detail] Requesting series_id: 7582454785920470021
[Melolo Detail] Series name: Drama Title
[Melolo Detail] Video count: 80
```

## Troubleshooting

### Jika data masih kosong:

1. **Cek API Melolo masih aktif:**
```bash
curl -X GET "https://api.tmtreader.com/i18n_novel/search/front_page/v1/?time_zone=Asia/Makassar&aid=645713&app_name=Melolo" \
  -H "Accept: application/json"
```

2. **Cek struktur response:**
   - Lihat log: `[Melolo Latest] Response structure`
   - Pastikan ada `data.data[].books`

3. **Update headers jika perlu:**
   - API mungkin butuh token/auth baru
   - Update `device_id` atau `iid` di `lib/melolo.js`

### Jika error 403/401:
- API Melolo mungkin block request dari server
- Coba ganti `device_id` dan `iid` dengan yang baru
- Tambahkan User-Agent yang lebih spesifik

### Jika error 500:
- Lihat `stderr.log` untuk detail error
- Pastikan axios sudah ter-install: `npm install axios`

## Update Headers (jika diperlukan)

Jika API Melolo berubah, update di `lib/melolo.js`:

```javascript
const headers = {
  "Accept": "application/json",
  "User-Agent": "Melolo/5.0.0", // Update version
  "x-api-key": "your-new-key",  // Jika ada
  // ... tambahkan header baru
};
```

## Testing Manual

1. **Restart server:**
```bash
npm start
# atau
pm2 restart palengen
```

2. **Buka browser:**
```
https://sukadracin.online
```

3. **Klik tab "Melolo"**

4. **Cek apakah poster muncul**

## Response Structure Cheat Sheet

### meloloLatest/Trending:
```
response.data.data[] (Array)
  ↳ [0, 1, 2, ...] (Loop untuk cari yang ada 'books')
      ↳ .books[] (Array of books)
          ↳ .book_id
          ↳ .book_name
          ↳ .thumb_url
          ↳ .play_count
```

### meloloDetail:
```
response.data.data (Object)
  ↳ .series_info (Object)
      ↳ .series_name
      ↳ .abstract
      ↳ .thumb_url
  ↳ .video_list[] (Array)
      ↳ .vid
      ↳ .episode_index
      ↳ .title
```

## Kontak Developer
Jika masih ada masalah setelah perbaikan ini, cek:
1. Server logs untuk error detail
2. Network tab di browser DevTools
3. Test endpoint langsung dengan curl/Postman
