/* subsplease */
/*******************************************************************************************************************************************************************/
const subsplease = {};
subsplease.base = "https://subsplease.org/";
subsplease.anime = subsplease.base + "shows/";
subsplease.api = subsplease.base + "api/?f=show&tz=" + Intl.DateTimeFormat().resolvedOptions().timeZone + "&sid=";

getEpisodes["subsplease"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: subsplease.anime + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				// get id
				let id = jqPage.find("#show-release-table").attr("sid");

				// request episodes from api
				GM_xmlhttpRequest({
					method: "GET",
					url: subsplease.api + id,
					onload: function(resp) {
						if (resp.status == 200) {
							// OK
							let res = JSON.parse(resp.response);
							let episodes = [];
							// loop through values
							Object.values(res).forEach(ep => {
								let dwn = ep.downloads.pop();
								episodes[ep.episode - 1] = {
									text: `Ep ${ep.episode} (${dwn.res}p)`,
									href: dwn.magnet
								};
							});
							// callback
							putEpisodes(dataStream, episodes, undefined);
						} else {
							// error
							errorEpisodes(dataStream, "SubsPlease: " + resp.status);
						}
					}
				});
			} else {
				// error
				errorEpisodes(dataStream, "SubsPlease: " + resp.status);
			}
		}
	});

}

getEplistUrl["subsplease"] = function(partialUrl) {
	return subsplease.anime + partialUrl;
}

searchSite["subsplease"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: subsplease.anime,
		onload: function(resp) {
			if (resp.status = 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];
				// get all anime as list
				let list = jqPage.find("#post-wrapper > div > div > .all-shows > .all-shows-link > a");
				// map and filter list to results
				list.each(function() {
					results.push({
						title: $(this).text().trim(),
						href:  $(this).attr("href").split("/")[2]
					});
				});
				results = results.filter(item => matchResult(item, title));
				// callback
				putResults(id, results);
			} else {
				// error
				errorResults(id, "SubsPlease: " + resp.status);
			}
		}
	});
}

