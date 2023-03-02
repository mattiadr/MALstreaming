/* mangadex */
/*******************************************************************************************************************************************************************/
const mangadex = {};
mangadex.base = "https://mangadex.org/";
mangadex.base_api = "https://api.mangadex.org/";
mangadex.manga = mangadex.base + "title/"
mangadex.lang_code = "en";
mangadex.manga_api = mangadex.base_api + `manga/{0}/feed?limit=500&order[chapter]=asc&offset={1}&translatedLanguage[]=${mangadex.lang_code}`;
mangadex.chapter = mangadex.base + "chapter/";
mangadex.search_api = mangadex.base_api + "manga?title=";

getEpisodes["mangadex"] = function(dataStream, url, offset=0, episodes=[]) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangadex.manga_api.formatUnicorn(url, offset),
		onload: function(resp) {
			if (resp.status == 200) {
				let res = JSON.parse(resp.response);
				if (res.result != "ok") {
					// error
					errorResults(id, "MangaDex: " + res.result);
				}
				// OK
				for (let i = 0; i < res.data.length; i++) {
					let chapter = res.data[i];
					let n = chapter.attributes.chapter;
					let t = `Chapter ${n}`;
					if (chapter.attributes.title) t += `: ${chapter.attributes.title}`;
					episodes[n - 1] = {
						text:      t,
						href:      mangadex.chapter + chapter.id,
						timestamp: new Date(chapter.attributes.createdAt).getTime(),
					}
				}
				// check if we got all the episodes
				if (offset + 500 >= res.total) {
					// estimate timeMillis
					let timeMillis = estimateTimeMillis(episodes, 5);
					// callback
					putEpisodes(dataStream, episodes, timeMillis);
				} else {
					// request next 500 episodes
					getEpisodes["mangadex"](dataStream, url, offset + 500, episodes);
				}
			} else {
				// error
				errorEpisodes(dataStream, "MangaDex: " + resp.status);
			}
		}
	});
}

getEplistUrl["mangadex"] = function(partialUrl) {
	return mangadex.manga + partialUrl;
}

searchSite["mangadex"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangadex.search_api + encodeURI(title),
		onload: function(resp) {
			if (resp.status == 200) {
				let res = JSON.parse(resp.response);
				if (res.result != "ok") {
					// error
					errorResults(id, "MangaDex: " + res.result);
				}
				// OK
				let results = [];
				for (let i = 0; i < res.data.length; i++) {
					let manga = res.data[i];
					results.push({
						title: manga.attributes.title.en || manga.attributes.title.jp,
						href:  manga.id,
					});
				}
				// callback
				putResults(id, results);
			} else {
				// error
				errorResults(id, "MangaDex: " + resp.status);
			}
		}
	});
}

