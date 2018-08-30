/* masterani */
/*******************************************************************************************************************************************************************/
const masterani = {};
masterani.base = "https://www.masterani.me/";
masterani.anime = masterani.base + "api/anime/";
masterani.anime_suffix = "/detailed";
masterani.anime_info = masterani.base + "anime/info/";
masterani.anime_watch = masterani.base + "anime/watch/";
masterani.search = masterani.base + "api/anime/filter?search=";
masterani.search_suffix = "&order=relevance_desc&page=1";

getEpisodes["masterani"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: masterani.anime + url + masterani.anime_suffix,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let res = JSON.parse(resp.response);
				let episodes = [];
				// get all episodes
				for (let i = 0; i < res.episodes.length; i++) {
					let ep = res.episodes[i].info.episode;
					// push episodes to array
					episodes.push({
						text: "Episode " + ep,
						href: masterani.anime_watch + url + "/" + ep,
					});
				}
				// callback
				putEpisodes(dataStream, episodes, undefined);
			}
		}
	});
}

getEplistUrl["masterani"] = function(partialUrl) {
	return masterani.anime_info + partialUrl;
}

searchSite["masterani"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: masterani.search + encodeURIComponent(title).slice(0, 60) + masterani.search_suffix, // maximum search length is 60 chars
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list = JSON.parse(resp.response).data;
				list = list.slice(0, 10);
				let results = [];
				// add to results
				for (let i = 0; i < list.length; i++) {
					let r = list[i];
					results.push({
						title:    r.title,
						href:     r.slug,
						episodes: r.episode_count
					});
				}
				// callback
				putResults(id, results);
			}
		}
	});
}

