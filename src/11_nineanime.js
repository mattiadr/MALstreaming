/* 9anime */
/*******************************************************************************************************************************************************************/
const nineanime = {};
nineanime.base = "https://9anime.to/";
nineanime.anime = nineanime.base + "watch/";
nineanime.servers = nineanime.base + "ajax/anime/servers?id=";
nineanime.search = nineanime.base + "search?keyword=";
nineanime.regexBlacklist = /preview|special|trailer|CAM/i;

getEpisodes["nineanime"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: nineanime.servers + url.match(/\.(\w+)$/)[1],
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];

				let list = jqPage.find(".episodes > li > a");
				list.each(function() {
					// ignore blacklisted episodes
					if (!nineanime.regexBlacklist.test($(this).text())) {
						// push episode to array
						episodes.push({
							text: "Episode " + $(this).text(),
							href: nineanime.base + $(this).attr("href").substr(1),
						});
					}
				});

				// callback
				putEpisodes(dataStream, episodes, undefined);
			} else {
				// error
				errorEpisodes(dataStream, "9anime: " + resp.status);
			}
		}
	});
}

getEplistUrl["nineanime"] = function(partialUrl) {
	return nineanime.anime + partialUrl;
}

searchSite["nineanime"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: nineanime.search + encodeURI(title),
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];
				// get results from response
				let list = jqPage.find("ul.anime-list > li");
				list = list.slice(0, 10);
				// add to results
				list.each(function() {
					// get anchor for text and href
					let a = $(this).find("a")[1];
					// get episode count
					let ep = $(this).find(".tag.ep").text().match(/\/(\d+)/);
					results.push({
						title:    a.text,
						href:     a.href.split("/")[4],
						episodes: ep ? (ep[1] + " eps") : "1 ep"
					});
				});
				// callback
				putResults(id, results);
			} else {
				// error
				errorResults(id, "9anime: " + resp.status);
			}
		}
	});
}

