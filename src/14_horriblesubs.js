/* horriblesubs */
/*******************************************************************************************************************************************************************/
const horriblesubs = {};
horriblesubs.base = "https://horriblesubs.info/";
horriblesubs.anime = horriblesubs.base + "shows/"
horriblesubs.api = horriblesubs.base + "api.php?method=getshows&type=show&showid="
horriblesubs.nextid = "&nextid=";

horriblesubs.regexID = /(?<=hs_showid = )\d+/;
horriblesubs.resultsPerPage = 12;
horriblesubs.loadPage = 2;

function parseEpisodes(jqPage, episodes) {
	jqPage.each(function() {
		let ep = parseInt(this.id);
		let div = $(this).find(".rls-link").last();
		let res = div.attr("id").split("-")[1];
		let href = div.find(".hs-magnet-link > a").attr("href");
		episodes[ep - 1] = {
			text: `Ep ${ep} (${res})`,
			href: href,
		}
	});
}

getEpisodes["horriblesubs"] = function(dataStream, url) {
	// request id
	GM_xmlhttpRequest({
		method: "GET",
		url: horriblesubs.anime + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let showid = resp.responseText.match(horriblesubs.regexID);

				// request first page of results
				GM_xmlhttpRequest({
					method: "GET",
					url: horriblesubs.api + showid,
					onload: function(resp) {
						if (resp.status == 200) {
							// OK
							let jqPage = $(resp.responseText);
							let episodes = [];
							// parse first page of episodes
							parseEpisodes(jqPage, episodes);
							// put episodes, may be overridden by next requests
							putEpisodes(dataStream, episodes, undefined);
							// check if you need to download another page
							let latestEp = parseInt(jqPage.find(".rls-info-container:first-child()").attr("id"));
							let nextEp = parseInt(dataStream.parents(".list-item").find(properties.findProgress).find(".link").text()) + 1;

							let reqPage = Math.floor((latestEp - nextEp) / horriblesubs.resultsPerPage);

							// request n pages (avoids multiple requests to page 0)
							for (let i = 0; i < horriblesubs.loadPage && reqPage > 0; i++) {
								GM_xmlhttpRequest({
									method: "GET",
									url: horriblesubs.api + showid + nextid + reqPage,
									onload: function(resp) {
										if (resp.status == 200) {
											// OK
											parseEpisodes($(resp.responseText), episodes);
											// put episodes
											putEpisodes(dataStream, episodes, undefined);
										}
									}
								});
								// next page
								reqPage--;
							}
						}
					}
				});
			} else {
				// error
				putError(dataStream, "HorribleSubs: " + resp.status);
			}
		}
	});
}

getEplistUrl["horriblesubs"] = function(partialUrl) {
	return horriblesubs.anime + partialUrl;
}

searchSite["horriblesubs"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: horriblesubs.anime,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];

				let split = title.split(/\W+/g);
				let shows = jqPage.find(".ind-show > a");
				shows.each(function() {
					for (let i = 0; i < split.length; i++) {
						if (!this.text.includes(split[i])) {
							return;
						}
					}
					results.push({
						title: this.text,
						href:  this.pathname.split("/")[2],
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

