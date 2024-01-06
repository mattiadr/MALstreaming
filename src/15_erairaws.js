/* erai-raws */
/*******************************************************************************************************************************************************************/
const erairaws = {};
erairaws.base = "https://www.erai-raws.info/";
erairaws.anime = erairaws.base + "anime-list/";
erairaws.search = erairaws.base + "?s="

getEpisodes["erairaws"] = function(dataStream, url) {
	// request
	GM_xmlhttpRequest({
		method: "POST",
		url: erairaws.anime + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];

				jqPage.find("#menu0 > .table").each(function() {
					let tt = $(this).find(".tooltip2");
					let type = tt.text();
					let m = tt.next().text().match(/[\d\.]+/g);

					let release = $(this).find(".release-links").first();
					let magnet = release.find(".load_more_links_buttons:contains(magnet)");

					if (type == "B") {
						// batch
						let first = parseInt(m[m.length - 2]);
						let last = parseInt(m[m.length - 1]);

						let obj = {
							text: `Batch ${first} ~ ${last}`,
							href: magnet,
						};

						for (let i = first - 1; i < last; i++) {
							episodes[i] = obj;
						}
					} else if (type == "E" || type == "A" || type == "F") {
						// encoding || airing || final
						let ep = parseInt(m[m.length - 1]);
						let res = release.find("span").text().match(/^\w+/)[0];

						if (!episodes[ep - 1]) {
							episodes[ep - 1] = {
								text: `Ep ${ep} (${res})`,
								href: magnet,
							}
						}
					} else {
						// unknown type
						return;
					}
				});

				// callback
				putEpisodes(dataStream, episodes, undefined);
			} else {
				// error
				errorEpisodes(dataStream, "Erai-raws: " + resp.status);
			}
		}
	});
}

getEplistUrl["erairaws"] = function(partialUrl) {
	return erairaws.anime + partialUrl;
}

searchSite["erairaws"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: erairaws.search + title,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = jqPage.find("#main .entry-title > a").map(function() {
					return {
						title: $(this).text().trim(),
						href:  $(this).attr("href").split("/")[4],
					};
				});

				// callback
				putResults(id, results);
			} else {
				// error
				errorResults(id, "Erai-raws: " + resp.status);
			}
		}
	});
}

