import axios from "axios";

const meloloLatest = async () => {
  try {
    const url =
      "https://api.tmtreader.com/i18n_novel/search/front_page/v1/?feature_switch=%7B%22enable_drama_infinite_filter%22%3Afalse%2C%22enable_filter_page%22%3Atrue%7D&time_zone=Asia%2FMakassar&iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757818463332&current_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&ui_language=in&cdid=98dd5744-724c-4a6a-bf4e-23779f43e745";

    const headers = {
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8"
    };

    const response = await axios.get(url, { headers });
    
    console.log("[Melolo Latest] Response structure:", JSON.stringify(response.data).substring(0, 500));
    
    if (response.data && response.data.data) {
      const dataArray = response.data.data;
      
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] && dataArray[i].books && Array.isArray(dataArray[i].books)) {
          console.log(`[Melolo Latest] Found books at index ${i}, count: ${dataArray[i].books.length}`);
          return dataArray[i];
        }
      }
      
      if (dataArray.length > 2 && dataArray[2]) {
        return dataArray[2];
      } else if (dataArray.length > 0 && dataArray[0]) {
        return dataArray[0];
      }
    }
    
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
    
    if (response.data && response.data.data) {
      const dataArray = response.data.data;
      
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] && dataArray[i].books && Array.isArray(dataArray[i].books)) {
          console.log(`[Melolo Trending] Found books at index ${i}, count: ${dataArray[i].books.length}`);
          return dataArray[i];
        }
      }
      
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
    const url = `https://api.tmtreader.com/i18n_novel/search/page/v1/?search_source_id=clks%23%23%23&IsFetchDebug=false&offset=${offset}&cancel_search_category_enhance=false&query=${encodeURIComponent(query)}&limit=${limit}&time_zone=Asia%2FMakassar&search_id&image_control=%7B%22image_size_config%22%3A%7B%22S%22%3A%7B%22h%22%3A228%2C%22level%22%3A%22S%22%2C%22w%22%3A160%7D%2C%22M%22%3A%7B%22h%22%3A342%2C%22level%22%3A%22M%22%2C%22w%22%3A240%7D%2C%22L%22%3A%7B%22h%22%3A427%2C%22level%22%3A%22L%22%2C%22w%22%3A300%7D%7D%7D&iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757926595794&current_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&ui_language=in&cdid=98dd5744-724c-4a6a-bf4e-23779f43e745`;

    const headers = {
      "User-Agent": "com.worldance.drama/49819 (Linux; U; Android 13; in; SM-A042F; Build/TP1A.220624.014; Cronet/TTNetVersion:8f366453 2024-12-24 QuicVersion:ef6c341e 2024-11-14)",
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8"
    };

    const res = await axios.get(url, { headers });
    
    console.log("[Melolo Search] Query:", query, "Results:", res.data?.data?.books?.length || 0);
    
    if (res.data && res.data.data && res.data.data.books) {
      return res.data;
    }
    
    return { data: { books: [] } };
  } catch (error) {
    console.error("[Melolo Search] Error:", error.message);
    return { data: { books: [] } };
  }
};

const meloloDetail = async (seriesId) => {
  try {
    const url = "https://api.tmtreader.com/novel/player/video_detail/v1/?iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757691583427&current_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&time_zone=Asia%2FMakassar&ui_language=in&cdid=ac4c8833-8614-4a9e-8f27-6e4fcdeabdc3";

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

    console.log("[Melolo Detail] ============================================");
    console.log("[Melolo Detail] Requesting series_id:", seriesId);
    console.log("[Melolo Detail] Request payload:", JSON.stringify(data));
    
    const response = await axios.post(url, data, { headers });
    
    console.log("[Melolo Detail] Response status:", response.status);
    console.log("[Melolo Detail] Response code:", response.data?.code);
    console.log("[Melolo Detail] Full response:", JSON.stringify(response.data).substring(0, 1000));
    
    if (response.data?.code !== 0) {
      console.error("[Melolo Detail] API returned error code:", response.data?.code);
      console.error("[Melolo Detail] Error message:", response.data?.message || 'Unknown error');
      
      return {
        status: false,
        data: {
          series_name: "Unknown",
          abstract: "",
          thumb_url: "",
          video_list: []
        },
        error: `API Error: ${response.data?.message || 'Unknown error'}, Code: ${response.data?.code}`
      };
    }
    
    const rawData = response.data?.data || {};
    const videoData = rawData.video_data || {}; 
    const videoList = videoData.video_list || [];
    
    console.log("[Melolo Detail] Raw data keys:", Object.keys(rawData));
    console.log("[Melolo Detail] Video data keys:", Object.keys(videoData));
    console.log("[Melolo Detail] Series title:", videoData.series_title || "NOT FOUND");
    console.log("[Melolo Detail] Video list length:", videoList.length);
    console.log("[Melolo Detail] Episode count:", videoData.episode_cnt || 0);
    
    if (!videoData.series_title) {
      console.warn("[Melolo Detail] ⚠️  video_data.series_title not found!");
      console.warn("[Melolo Detail] Available data structure:", JSON.stringify(rawData).substring(0, 500));
      
      const altSeriesInfo = rawData.series_info || rawData.book_info || {};
      if (altSeriesInfo.series_title || altSeriesInfo.book_name) {
        console.log("[Melolo Detail] Found alternative structure:", Object.keys(altSeriesInfo));
      }
    }
    
    return {
      status: true,
      data: {
        series_name: videoData.series_title || "Unknown",
        abstract: videoData.series_intro || "",
        thumb_url: videoData.series_cover || "",
        episode_cnt: videoData.episode_cnt || 0,
        series_status: videoData.series_status || 0,
        video_list: videoList.map((video, index) => ({
          vid: video.vid || "",
          vid_index: video.vid_index || index + 1,
          title: video.title || `Episode ${index + 1}`,
          cover: video.cover || video.episode_cover || "",
          duration: video.duration || 0,
          digged_count: video.digged_count || 0,
          comment_count: video.comment_count || 0,
          disable_play: video.disable_play || false,
          series_id: video.series_id || seriesId
        }))
      }
    };
  } catch (error) {
    console.error("[Melolo Detail] ============================================");
    console.error("[Melolo Detail] ERROR CAUGHT!");
    console.error("[Melolo Detail] Error message:", error.message);
    console.error("[Melolo Detail] Error response status:", error.response?.status);
    console.error("[Melolo Detail] Error response data:", JSON.stringify(error.response?.data).substring(0, 500));
    console.error("[Melolo Detail] Request URL:", error.config?.url);
    console.error("[Melolo Detail] Request data:", error.config?.data);
    
    return {
      status: false,
      data: {
        series_name: "Unknown",
        abstract: "",
        thumb_url: "",
        video_list: []
      },
      error: error.message,
      errorDetails: {
        status: error.response?.status,
        message: error.response?.data?.message,
        code: error.response?.data?.code
      }
    };
  }
};

const meloloLinkStream = async (videoId) => {
  try {
    const url = "https://api.tmtreader.com/novel/player/video_model/v1/?iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757691585555&current_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&time_zone=Asia%2FMakassar&ui_language=in&cdid=ac4c8833-8614-4a9e-8f27-6e4fcdeabdc3";

    const headers = {
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8",
      "Content-Type": "application/json",
      "User-Agent": "com.worldance.drama/49819 (Linux; U; Android 13; in; SM-A042F; Build/TP1A.220624.014; Cronet/TTNetVersion:8f366453 2024-12-24 QuicVersion:ef6c341e 2024-11-14)"
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

    console.log("[Melolo Stream] ============================================");
    console.log("[Melolo Stream] Requesting video_id:", videoId);
    console.log("[Melolo Stream] Request payload:", JSON.stringify(data));
    
    const response = await axios.post(url, data, { headers });
    
    console.log("[Melolo Stream] Response status:", response.status);
    console.log("[Melolo Stream] Response code:", response.data?.code);
    console.log("[Melolo Stream] Full response:", JSON.stringify(response.data).substring(0, 1000));
    
    // Cek error code
    if (response.data?.code !== 0) {
      console.error("[Melolo Stream] API returned error code:", response.data?.code);
      console.error("[Melolo Stream] Error message:", response.data?.message || response.data?.BaseResp?.StatusMessage);
      
      return {
        status: false,
        code: response.data?.code,
        message: response.data?.message || response.data?.BaseResp?.StatusMessage || 'Unknown error',
        data: {}
      };
    }
    
    // Parse video data
    const videoData = response.data?.data?.video_data || {};
    const cdnList = videoData.cdn_list || [];
    
    console.log("[Melolo Stream] Video data keys:", Object.keys(videoData));
    console.log("[Melolo Stream] CDN list count:", cdnList.length);
    
    // Ekstrak video URLs
    const videoUrls = [];
    cdnList.forEach(cdn => {
      const videoPathList = cdn.video_path_list || [];
      videoPathList.forEach(path => {
        if (path.video_path) {
          videoUrls.push({
            quality: path.quality || 'auto',
            url: path.video_path,
            size: path.size || 0,
            bitrate: path.bit_rate || 0,
            codec: path.codec || 'h264',
            isDefault: path.is_default || false
          });
        }
      });
    });
    
    console.log("[Melolo Stream] Found video URLs:", videoUrls.length);
    
    return {
      status: true,
      code: 0,
      data: {
        video_id: videoId,
        video_urls: videoUrls,
        duration: videoData.duration || 0,
        title: videoData.title || "",
        cover: videoData.cover || ""
      }
    };
    
  } catch (error) {
    console.error("[Melolo Stream] ============================================");
    console.error("[Melolo Stream] ERROR CAUGHT!");
    console.error("[Melolo Stream] Error message:", error.message);
    console.error("[Melolo Stream] Error response status:", error.response?.status);
    console.error("[Melolo Stream] Error response data:", JSON.stringify(error.response?.data || {}).substring(0, 500));
    console.error("[Melolo Stream] Request URL:", error.config?.url);
    console.error("[Melolo Stream] Request data:", error.config?.data);
    
    return {
      status: false,
      code: error.response?.data?.code || 500,
      message: error.response?.data?.message || error.message,
      data: {},
      errorDetails: {
        status: error.response?.status,
        statusMessage: error.response?.data?.BaseResp?.StatusMessage
      }
    };
  }
};

export { meloloSearch, meloloDetail, meloloLinkStream, meloloLatest, meloloTrending };
export default { meloloSearch, meloloDetail, meloloLinkStream, meloloLatest, meloloTrending };