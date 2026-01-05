import axios from "axios";

// Parse data dari Melolo API response - Latest/Trending
const parseLatestBooks = (booksArray) => {
  if (!Array.isArray(booksArray)) return [];
  
  return booksArray.map((item) => ({
    book_id: item.book_id || item.id || "",
    book_name: item.book_name || item.title || "Unknown",
    thumb_url: item.thumb_url || item.cover || "",
    abstract: item.abstract || item.introduction || "",
    play_count: item.play_count || 0
  })).filter(item => item.book_id); // Filter out items without ID
};

// Parse detail response - Convert to standard format
const parseDetailResponse = (videoData) => {
  if (!videoData) return null;
  
  const videoList = videoData.video_list || [];
  
  return {
    series_name: videoData.series_title || "Unknown",
    series_intro: videoData.series_intro || "",
    thumb_url: videoData.series_cover || "",
    episode_count: videoData.episode_cnt || 0,
    video_list: videoList.map((vid, idx) => ({
      vid: vid.vid || vid.video_id || `ep_${idx}`,
      episode_index: vid.vid_index || vid.episode_index || (idx + 1),
      title: vid.title || `Episode ${vid.vid_index || idx + 1}`,
      cover: vid.cover || vid.episode_cover || ""
    }))
  };
};

const meloloLatest = async () => {
  try {
    // Call sansekai API which proxies Melolo
    const response = await axios.get(
      "https://api.sansekai.my.id/api/melolo/latest",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        timeout: 10000
      }
    );
    
    const books = parseLatestBooks(response.data.books || []);
    
    return {
      status: true,
      data: { books }
    };
  } catch (error) {
    console.error("[Melolo Latest] Error:", error.message);
    return {
      status: false,
      data: { books: [] },
      error: error.message
    };
  }
};

const meloloTrending = async () => {
  try {
    // For now, use latest as fallback. Update when trending endpoint available
    const response = await axios.get(
      "https://api.sansekai.my.id/api/melolo/latest",
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        timeout: 10000
      }
    );
    
    const books = parseLatestBooks(response.data.books || []);
    
    return {
      status: true,
      data: { books }
    };
  } catch (error) {
    console.error("[Melolo Trending] Error:", error.message);
    return {
      status: false,
      data: { books: [] },
      error: error.message
    };
  }
};

const meloloSearch = async (query, limit = 10, offset = 0) => {
  try {
    const response = await axios.get(
      "https://api.sansekai.my.id/api/melolo/search",
      {
        params: { q: query, limit, offset },
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        timeout: 10000
      }
    );
    
    const books = parseLatestBooks(response.data.books || []);
    
    return {
      status: true,
      data: { books }
    };
  } catch (error) {
    console.error("[Melolo Search] Error:", error.message);
    return {
      status: true,
      data: { books: [] },
      error: error.message
    };
  }
};

const meloloDetail = async (seriesId) => {
  try {
    console.log(`[Melolo Detail] Fetching ID: ${seriesId}`);
    
    const response = await axios.get(
      "https://api.sansekai.my.id/api/melolo/detail",
      {
        params: { bookId: seriesId },
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        timeout: 15000
      }
    );
    
    const videoData = response.data?.data?.video_data;
    if (!videoData) {
      console.warn(`[Melolo Detail] No video_data in response for ${seriesId}`);
      return {
        status: false,
        error: "Video data not found",
        data: null
      };
    }
    
    const parsedData = parseDetailResponse(videoData);
    
    return {
      status: true,
      data: parsedData
    };
  } catch (error) {
    console.error(`[Melolo Detail] Error for ${seriesId}:`, error.message);
    return {
      status: false,
      error: error.message,
      data: null
    };
  }
};

const meloloLinkStream = async (videoId) => {
  try {
    console.log(`[Melolo Stream] Fetching video: ${videoId}`);
    
    // This would need the actual streaming endpoint from sansekai
    // For now return placeholder
    return {
      status: false,
      error: "Stream endpoint not yet implemented",
      data: null
    };
  } catch (error) {
    console.error("[Melolo Stream] Error:", error.message);
    return {
      status: false,
      error: error.message,
      data: null
    };
  }
};

export { meloloLatest, meloloTrending, meloloSearch, meloloDetail, meloloLinkStream };