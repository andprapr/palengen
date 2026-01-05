import axios from "axios";

// Parse data dari Melolo API response
const parseBooks = (data) => {
  if (!data || !data.content) return [];
  
  return data.content.map((item, idx) => ({
    book_id: item.search_source_book_id || item.id || `melolo_${idx}`,
    book_name: item.title || item.book_name || "Unknown",
    thumb_url: item.cover || item.image_url || "",
    play_count: item.play_count || 0,
    episode_index: item.index || idx,
    series_name: item.series_name || item.title,
    abstract: item.description || ""
  }));
};

const meloloLatest = async () => {
  try {
    const url = "https://api.tmtreader.com/i18n_novel/search/front_page/v1/?feature_switch=%7B%22enable_drama_infinite_filter%22%3Afalse%2C%22enable_filter_page%22%3Atrue%7D&time_zone=Asia%2FMakassar&iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757818463332%26current_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&ui_language=in&cdid=98dd5744-724c-4a6a-bf4e-23779f43e745";

    const headers = {
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8"
    };

    const response = await axios.get(url, { headers });
    
    // response.data.data[2] adalah tab "Latest"
    const latestData = response.data.data[2];
    
    if (!latestData || !latestData.content) {
      return { status: true, data: { books: [] } };
    }

    const books = parseBooks(latestData);
    
    return {
      status: true,
      data: { books }
    };
  } catch (error) {
    console.error("Melolo Latest Error:", error.message);
    throw error;
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

    // response.data.data[0] adalah tab "Trending"
    const trendingData = response.data.data[0];
    
    if (!trendingData || !trendingData.content) {
      return { status: true, data: { books: [] } };
    }

    const books = parseBooks(trendingData);
    
    return {
      status: true,
      data: { books }
    };
  } catch (error) {
    console.error("Melolo Trending Error:", error.message);
    throw error;
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
    
    if (!res.data || !res.data.data || !res.data.data.content) {
      return { status: true, data: { books: [] } };
    }

    const books = parseBooks(res.data.data);
    
    return {
      status: true,
      data: { books }
    };
  } catch (error) {
    console.error("Melolo Search Error:", error.message);
    throw error;
  }
};

const meloloDetail = async (seriesId) => {
  try {
    const url = "https://api.tmtreader.com/novel/player/video_detail/v1/?iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757691583427¤t_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&time_zone=Asia%2FMakassar&ui_language=in&cdid=ac4c8833-8614-4a9e-8f27-6e4fcdeabdc3";

    const headers = {
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8"
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
      series_id: seriesId
    };

    const response = await axios.post(url, data, { headers });
    
    // Parse video list dari response
    const videoList = response.data.data?.video_list || [];
    
    return {
      status: true,
      data: {
        series_name: response.data.data?.series_name || "Unknown",
        abstract: response.data.data?.description || "",
        thumb_url: response.data.data?.thumb_url || "",
        video_list: videoList.map((vid, idx) => ({
          vid: vid.vid || vid.video_id || `${seriesId}_${idx}`,
          episode_index: vid.episode_index || idx,
          title: vid.title || `Episode ${idx + 1}`
        }))
      }
    };
  } catch (error) {
    console.error("Melolo Detail Error:", error.message);
    throw error;
  }
};

const meloloLinkStream = async (videoId) => {
  try {
    const url = "https://api.tmtreader.com/novel/player/video_link/v1/?iid=7549227319043409680&device_id=7380433722363364870&ac=mobile&channel=gp&aid=645713&app_name=Melolo&version_code=49819&version_name=4.9.8&device_platform=android&os=android&ssmix=a&device_type=SM-A042F&device_brand=samsung&language=in&os_api=33&os_version=13&openudid=244a3f8dcf4d103a&manifest_version_code=49819&resolution=720*1465&dpi=300&update_version_code=49819&_rticket=1757934234789¤t_region=ID&carrier_region=id&app_language=id&sys_language=in&app_region=ID&sys_region=ID&mcc_mnc=51089&carrier_region_v2=510&user_language=id&time_zone=Asia%2FMakassar&ui_language=in&cdid=ac4c8833-8614-4a9e-8f27-6e4fcdeabdc3";

    const headers = {
      "Accept": "application/json; charset=utf-8,application/x-protobuf",
      "Accept-Encoding": "gzip, deflate",
      "x-xs-from-web": "false",
      "age-range": "8"
    };

    const data = {
      biz_param: {
        need_all_video_definition: true,
        need_mp4_align: false,
        source: 4,
        use_os_player: false
      },
      video_id: videoId
    };

    const response = await axios.post(url, data, { headers });
    
    // Parse video links
    const videoList = response.data.data?.video_list || [];
    
    return {
      status: true,
      data: {
        video_list: videoList.map(v => ({
          definition: v.definition,
          main_url: v.main_url || v.play_url
        }))
      }
    };
  } catch (error) {
    console.error("Melolo Stream Error:", error.message);
    throw error;
  }
};

export { meloloLatest, meloloTrending, meloloSearch, meloloDetail, meloloLinkStream };