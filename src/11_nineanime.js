/* 9anime */
/*******************************************************************************************************************************************************************/
const nineanime = {};
nineanime.base = "https://9anime.to/";
nineanime.anime = nineanime.base + "watch/";
nineanime.servers = nineanime.base + "ajax/film/servers/";
nineanime.search = nineanime.base + "search?keyword=";
nineanime.regexBlacklist = /preview|special|trailer|CAM/i;

// open captcha page
function nineanime_openCaptcha() {
	if (GM_getValue("NAcaptcha", false) + 30*1000 < Date.now()) {
		GM_setValue("NAcaptcha", Date.now());
		GM_openInTab(nineanime.base, false);
	}
}

// function to execute when script is run on nineanime
pageLoad["nineanime"] = function() {
	// close window if opended by script
	if (GM_getValue("NAcaptcha", false) && document.title != "WAF") {
		GM_setValue("NAcaptcha", false);
		window.close();
	}
}

getEpisodes["nineanime"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: nineanime.servers + url.match(/\.(\w+)$/)[1],
		onload: function(resp) {
			if (resp.status == 200) {
				// successful response is a json with only html attribute, parse it
				let json = null;
				try {
					json = JSON.parse(resp.response);
				} catch (e) {
					// solving captcha
					nineanime_openCaptcha();
					return;
				}

				// OK
				let jqPage = $(json.html);
				let episodes = [];
				// get servers
				let servers = jqPage.find("div.widget-body > .server");
				let as = null;
				// auto select server with the most videos
				servers.each(function() {
					let nas = $(this).find("li > a");
					if (!as || nas.length > as.length) {
						as = nas;
					}
				});
				if (as) {
					as.each(function() {
						// ignore blacklisted episodes
						if (!nineanime.regexBlacklist.test($(this).text())) {
							// push episode to array
							episodes.push({
								text: "Episode " + $(this).text().replace(/^0+(?=\d+)/, ""),
								href: nineanime.base + $(this).attr("href").substr(1),
							});
						}
					});
				}
				// get time if available
				GM_xmlhttpRequest({
					method: "GET",
					url: nineanime.anime + url,
					onload: function(resp) {
						if (resp.status == 200) {
							// OK
							let time = $(resp.response).find("#main > div > div.alert.alert-primary > i");
							let timeMillis = undefined;
							if (time.length !== 0) {
								// timer is present
								timeMillis = time.data("to") * 1000;
							}
							// callback
							putEpisodes(dataStream, episodes, timeMillis);
						} else {
							// not OK, callback
							putEpisodes(dataStream, episodes, undefined);
						}
					}
				});
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
				let list = jqPage.find("#main > div > div:nth-child(3) > div.widget-body > div.film-list > .item");
				list = list.slice(0, 10);
				// add to results
				list.each(function() {
					// get anchor for text and href
					let a = $(this).find("a")[1];
					// get episode count
					let ep = $(this).find(".status > .ep").text().match(/\/(\d+)/);
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

