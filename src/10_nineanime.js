/* 9anime */
/*******************************************************************************************************************************************************************/
const nineanime = {};
nineanime.base = "https://www5.9anime.is/";
nineanime.anime = nineanime.base + "watch/";
nineanime.search = nineanime.base + "search?keyword=";
nineanime.regexBlacklist = /preview|special|trailer|CAM/i;

getEpisodes["nineanime"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: nineanime.anime + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get servers
				let servers = jqPage.find("#main > div > div.widget.servers > div.widget-body > .server");
				let as = null;
				// auto select server with the most videos
				servers.each(function() {
					let nas = $(this).find("li > a");
					if (!as || nas.length > as.length) {
						as = nas;
					}
				});
				as.each(function() {
					// ignore blacklisted episodes
					if (!nineanime.regexBlacklist.test($(this).text())) {
						// push episode to array
						episodes.push({
							text: "Episode " + $(this).text().replace(/^0+(?=\d+)/, ""),
							href: nineanime.base + $(this).attr("href").substr(1),
							date: $(this).data("title").replace("-", "")
						});
					}
				});
				// get time if available
				let time = jqPage.find("#main > div > div.alert.alert-primary > i");
				let timeMillis;
				if (time.length !== 0) {
					// timer is present
					timeMillis = time.data("to") * 1000 - Date.now();
				} else {
					// timer is not present, estimating based on latest episode
					let timeStr = episodes[episodes.length - 1].date;
					timeMillis = Date.parse(timeStr) + 1000 * 60 * 60 * 24 * 7 - Date.now();
				}
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
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
				let list = jqPage.find("#main > div > div:nth-child(1) > div.widget-body > div.film-list > .item");
				list = list.slice(0, 10);
				// add to results
				list.each(function() {
					// get anchor for text and href
					let a = $(this).find("a")[1];
					// get episode count
					let ep = $(this).find(".status > .ep").text().match(/(?<=\/)\d+/);
					results.push({
						title:    a.text,
						href:     a.href.split("/")[4],
						fullhref: a.href,
						episodes: ep ? (ep[0] + " eps") : "1 ep"
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

