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

// loads cloudflare cookies and then calls back
function masterani_loadCookies(callback) {
	if (GM_getValue("MAloadcookies", false) + 30*1000 < Date.now()) {
		GM_setValue("MAloadcookies", Date.now());
		GM_openInTab(masterani.base, true);
	}
	if (callback) {
		setTimeout(function() {
			callback();
		}, 6000);
	}
}

// function to execute when script is run on masteranime
pageLoad["masterani"] = function() {
	if (GM_getValue("MAloadcookies", false) && document.title != "Just a moment...") {
		GM_setValue("MAloadcookies", false);
		window.close();
	}
}

getEpisodes["masterani"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: masterani.anime + url + masterani.anime_suffix,
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				masterani_loadCookies(function() {
					getEpisodes["masterani"](dataStream, url);
				});
			} else if (resp.status == 200) {
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
			if (resp.status == 503) {
				// loading CF cookies
				masterani_loadCookies(function() {
					searchSite["masterani"](id, title);
				});
			} else if (resp.status == 200) {
				// OK
				let list = JSON.parse(resp.response).data;
				let results = [];
				if (list) {
					list = list.slice(0, 10);
					// add to results
					for (let i = 0; i < list.length; i++) {
						let r = list[i];
						let eps = r.episode_count;
						if (!eps) {
							eps = "? eps"
						} else {
							eps += ((eps > 1) ? " eps" : " ep")
						}
						results.push({
							title:    r.title,
							href:     r.slug,
							episodes: eps,
						});
					}
				}
				// callback
				putResults(id, results);
			}
		}
	});
}

