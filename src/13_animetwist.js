/* animetwist */
/*******************************************************************************************************************************************************************/
const animetwist = {};
animetwist.base = "https://twist.moe/";
animetwist.anime = animetwist.base + "a/"
animetwist.api = animetwist.base + "api/anime/";
animetwist.token = "1rj2vRtegS8Y60B3w3qNZm5T2Q0TN2NR";

getEpisodes["animetwist"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: animetwist.api + url,
		headers: { "x-access-token": animetwist.token },
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list = JSON.parse(resp.response).episodes;
				let episodes = [];
				// insert all episodes
				for (let i = 0; i < list.length; i++) {
					let n = list[i].number;
					episodes[n - 1] = {
						text: "Episode " + n,
						href: animetwist.anime + url + "/" + n,
					}
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
		url: animetwist.api,
		headers: { "x-access-token": animetwist.token },
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list = JSON.parse(resp.response);
				let results = [];
				// turn title into regex to filter results
				let titleRegex = new RegExp(title.replace(/\W+/, ".*"), "i");

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

