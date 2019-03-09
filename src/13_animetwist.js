/* animetwist */
/*******************************************************************************************************************************************************************/
const animetwist = {};
animetwist.base = "https://twist.moe/";
animetwist.anime = animetwist.base + "a/";
animetwist.anime_suffix = "/last";
animetwist.dataRegex = /(?<=<script>window\.__NUXT__=).*(?=;<\/script>)/;

getEpisodes["animetwist"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: animetwist.anime + url + animetwist.anime_suffix,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let episodes = [];
				// get last episode number
				let lastEp = parseInt(resp.finalUrl.match(/\d+$/));
				// insert all episodes until lastEp
				for (let i = 1; i <= lastEp; i++) {
					episodes.push({
						text: "Episode " + i,
						href: animetwist.anime + url + "/" + i,
					});
				}
				// callback
				putEpisodes(dataStream, episodes, undefined);
			}
		}
	});
}

getEplistUrl["animetwist"] = function(partialUrl) {
	return animetwist.anime + partialUrl;
}

searchSite["animetwist"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: animetwist.base,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list;
				try {
					list = JSON.parse(resp.response.match(animetwist.dataRegex)).state.anime.all;
				} catch (e) {
					// error parsing JSON
				}
				let results = [];
				// turn title into regex to filter results
				let titleRegex = new RegExp(title.replace(/\W+/, ".*"), "");

				if (list) {
					for (let i = 0; i < list.length; i++) {
						let r = list[i];
						// filter only matching titles
						if (titleRegex.test(r.title)) {
							results.push({
								title: r.title,
								href:  r.slug.slug,
							})
						}
					}
				}
				// callback
				putResults(id, results);
			}
		}
	});
}

