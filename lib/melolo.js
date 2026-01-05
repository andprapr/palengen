import axios from "axios";

const meloloLatest = async () => {
  try {
    const url =
      "https://api.tmtreader.com/i18n_novel/search/front_page/v1/?feature_switch=%7B%22enable_drama_infinite_filter%22%3Afalse%2C%22enable_filter_page%22%3Atrue%7D&time_zone=Asia%2FMakassar&iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757818463332¤t_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&ui_language=in&cdid=98dd5744-724c-4a6a-bf4e-23779f43e745";

    const headers = {
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8"
    };

    const response = await axios.get(url, { headers });
    
    // Log untuk debugging
    console.log("[Melolo Latest] Response structure:", JSON.stringify(response.data).substring(0, 500));
    
    // Cek berbagai kemungkinan struktur response
    if (response.data && response.data.data) {
      const dataArray = response.data.data;
      
      // Cari data yang memiliki field 'books'
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] && dataArray[i].books && Array.isArray(dataArray[i].books)) {
          console.log(`[Melolo Latest] Found books at index ${i}, count: ${dataArray[i].books.length}`);
          return dataArray[i];
        }
      }
      
      // Jika tidak ada yang punya books, return index 0 atau 2 (fallback)
      if (dataArray.length > 2 && dataArray[2]) {
        return dataArray[2];
      } else if (dataArray.length > 0 && dataArray[0]) {
        return dataArray[0];
      }
    }
    
    // Return struktur kosong jika tidak ada data
    console.warn("[Melolo Latest] No valid data found, returning empty structure");
    return { books: [] };
  } catch (error) {
    console.error("[Melolo Latest] Error:", error.message);
    console.error("[Melolo Latest] Error details:", error.response?.data || error);
    return { books: [] };
  }
};

const meloloTrending = async () => {
  try {
    const response = await axios.get(
      "https://api.tmtreader.com/i18n_novel/search/front_page/v1/",
      {
        params: {
          feature_switch: '{"enable_drama_infinite_filter":false,"enable_filter_page":true}',
          time_zone: "Asia/Makassar",
          iid: "7576599913972598536",
          device_id: "7554232785717380664",
          ac: "wifi",
          channel: "gp",
          aid: "645713",
          app_name: "Melolo",
          version_code: "49819",
          version_name: "4.9.8",
          device_platform: "android",
          os: "android",
          ssmix: "a",
          device_type: "SM-A042F",
          device_brand: "samsung",
          language: "in",
          os_api: "33",
          os_version: "13",
          openudid: "d7ad3f25422073a0",
          manifest_version_code: "49819",
          resolution: "720*1465",
          dpi: "300",
          update_version_code: "49819",
          _rticket: "1764064930510",
          current_region: "ID",
          carrier_region: "id",
          app_language: "id",
          sys_language: "in",
          app_region: "ID",
          sys_region: "ID",
          mcc_mnc: "51089",
          carrier_region_v2: "510",
          user_language: "id",
          ui_language: "in",
          cdid: "fc503247-242d-4743-a459-f6662c828ac7"
        },
        headers: {
          "Accept": "application/json; charset=utf-8,application/x-protobuf",
          "Accept-Encoding": "gzip, deflate",
          "x-xs-from-web": "false",
          "age-range": "8"
        }
      }
    );

    console.log("[Melolo Trending] Response structure:", JSON.stringify(response.data).substring(0, 500));
    
    // Cek berbagai kemungkinan struktur response
    if (response.data && response.data.data) {
      const dataArray = response.data.data;
      
      // Cari data yang memiliki field 'books'
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] && dataArray[i].books && Array.isArray(dataArray[i].books)) {
          console.log(`[Melolo Trending] Found books at index ${i}, count: ${dataArray[i].books.length}`);
          return dataArray[i];
        }
      }
      
      // Fallback ke index 0
      if (dataArray.length > 0 && dataArray[0]) {
        return dataArray[0];
      }
    }
    
    console.warn("[Melolo Trending] No valid data found, returning empty structure");
    return { books: [] };
  } catch (error) {
    console.error("[Melolo Trending] Error:", error.message);
    console.error("[Melolo Trending] Error details:", error.response?.data || error);
    return { books: [] };
  }
};

const meloloSearch = async (query, limit = 10, offset = 0) => {
  try {
    const url = `https://api.tmtreader.com/i18n_novel/search/page/v1/?search_source_id=clks%23%23%23&IsFetchDebug=false&offset=${offset}&cancel_search_category_enhance=false&query=${encodeURIComponent(query)}&limit=${limit}&time_zone=Asia%2FMakassar&search_id&image_control=%7B%22image_size_config%22%3A%7B%22S%22%3A%7B%22h%22%3A228%2C%22level%22%3A%22S%22%2C%22w%22%3A160%7D%2C%22M%22%3A%7B%22h%22%3A342%2C%22level%22%3A%22M%22%2C%22w%22%3A240%7D%2C%22L%22%3A%7B%22h%22%3A427%2C%22level%22%3A%22L%22%2C%22w%22%3A300%7D%7D%7D&iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757926595794¤t_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&ui_language=in&cdid=98dd5744-724c-4a6a-bf4e-23779f43e745`;

    const headers = {
      "User-Agent": "com.worldance.drama/49819 (Linux; U; Android 13; in; SM-A042F; Build/TP1A.220624.014; Cronet/TTNetVersion:8f366453 2024-12-24 QuicVersion:ef6c341e 2024-11-14)",
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8"
    };

    const res = await axios.get(url, { headers });
    
    console.log("[Melolo Search] Query:", query, "Results:", res.data?.data?.books?.length || 0);
    
    // Pastikan ada struktur data yang benar
    if (res.data && res.data.data && res.data.data.books) {
      return res.data;
    }
    
    // Return struktur kosong jika tidak ada hasil
    return { data: { books: [] } };
  } catch (error) {
    console.error("[Melolo Search] Error:", error.message);
    return { data: { books: [] } };
  }
};

const meloloDetail = async (seriesId) => {
  try {
    const url = "https://api.tmtreader.com/novel/player/video_detail/v1/?iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757691583427¤t_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&time_zone=Asia%2FMakassar&ui_language=in&cdid=ac4c8833-8614-4a9e-8f27-6e4fcdeabdc3";

    const headers = {
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8",
      "Content-Type": "application/json"
    };

    const data = {
      biz_param: {
        detail_page_version: 0,
        from_video_id: "",
        need_all_video_definition: false,
        need_mp4_align: false,
        source: 4,
        use_os_player: false,
        video_id_type: 1
      },
      series_id: String(seriesId)
    };

    console.log("[Melolo Detail] Requesting series_id:", seriesId);
    const response = await axios.post(url, data, { headers });
    
    console.log("[Melolo Detail] Response status:", response.status);
    console.log("[Melolo Detail] Response data keys:", Object.keys(response.data || {}));
    
    // Parse response dengan safe navigation
    const rawData = response.data?.data || {};
    
    // Ekstrak informasi dengan fallback values
    const seriesInfo = rawData.series_info || {};
    const videoList = rawData.video_list || [];
    
    console.log("[Melolo Detail] Series name:", seriesInfo.series_name || "Unknown");
    console.log("[Melolo Detail] Video count:", videoList.length);
    
    return {
      status: true,
      data: {
        series_name: seriesInfo.series_name || seriesInfo.name || "Unknown",
        abstract: seriesInfo.abstract || seriesInfo.description || "",
        thumb_url: seriesInfo.thumb_url || seriesInfo.cover || "",
        video_list: videoList.map((video, index) => ({
          vid: video.vid || video.video_id || "",
          episode_index: video.episode_index || index + 1,
          title: video.title || `Episode ${index + 1}`,
          thumb_url: video.thumb_url || video.cover || "",
          duration: video.duration || 0
        }))
      }
    };
  } catch (error) {
    console.error("[Melolo Detail] Error:", error.message);
    console.error("[Melolo Detail] Error response:", error.response?.data || "No response data");
    
    // Return struktur minimal jika error
    return {
      status: false,
      data: {
        series_name: "Unknown",
        abstract: "",
        thumb_url: "",
        video_list: []
      },
      error: error.message
    };
  }
};

const meloloLinkStream = async (videoId) => {
  try {
    const url = "https://api.tmtreader.com/novel/player/video_model/v1/?iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757691585555¤t_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&time_zone=Asia%2FMakassar&ui_language=in&cdid=ac4c8833-8614-4a9e-8f27-6e4fcdeabdc3";

    const headers = {
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8",
      "Content-Type": "application/json"
    };

    const data = {
      biz_param: {
        detail_page_version: 0,
        device_level: 3,
        from_video_id: "",
        need_all_video_definition: true,
        need_mp4_align: false,
        source: 4,
        use_os_player: false,
        video_id_type: 0,
        video_platform: 3
      },
      video_id: String(videoId)
    };

    console.log("[Melolo Stream] Requesting video_id:", videoId);
    const response = await axios.post(url, data, { headers });
    
    console.log("[Melolo Stream] Response status:", response.status);
    
    return response.data;
  } catch (error) {
    console.error("[Melolo Stream] Error:", error.message);
    console.error("[Melolo Stream] Error response:", error.response?.data || "No response data");
    throw error;
  }
};

export { meloloSearch, meloloDetail, meloloLinkStream, meloloLatest, meloloTrending };
export default { meloloSearch, meloloDetail, meloloLinkStream, meloloLatest, meloloTrending };