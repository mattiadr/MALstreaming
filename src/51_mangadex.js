/* mangadex */
/*******************************************************************************************************************************************************************/
const mangadex = {};
mangadex.base = "https://mangadex.org/";
mangadex.manga = mangadex.base + "manga/";
mangadex.manga_api = mangadex.base + "api/manga/";
mangadex.chapter = mangadex.base + "chapter/";
mangadex.lang_code = "gb";
mangadex.search = mangadex.base + "quick_search/";

getEpisodes["mangadex"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangadex.manga_api + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let res_ch = JSON.parse(resp.response).chapter;
				let episodes = [];
				// parse json
				for (let key in res_ch) {
					if (res_ch.hasOwnProperty(key)) {
						let ch = res_ch[key];
						// skip wrong language
						if (ch.lang_code != mangadex.lang_code) continue;
						// put into episodes array
						episodes[ch.chapter - 1] = {
							text:      `Vol. ${ch.volume} Ch. ${ch.chapter}`,
							href:      mangadex.chapter + key,
							timestamp: ch.timestamp,
						}
					}
				}
				// estimate timeMillis
				let timeMillis = estimateTimeMillis(episodes, 5);
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
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
		url: mangadex.search + encodeURI(title),
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let results = [];
				// get title anchors
				let titles = $(resp.response).find("#search_manga").find("a.manga_title");
				titles.each(function() {
					results.push({
						title: this.title,
						href:  this.pathname.split("/")[2]
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

