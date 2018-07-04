/* kissanime */
/*******************************************************************************************************************************************************************/
const kissanime = {};
kissanime.base = "http://kissanime.ru/";
kissanime.anime = kissanime.base + "Anime/";
kissanime.search = kissanime.base + "Search/Anime/";
kissanime.server = "&s=rapidvideo";
// blacklisted urls
kissanime.epsBlacklist = [
	"/Anime/Macross/Bunny_Hat-Macross_Special_-4208D135?id=73054",
	"/Anime/Macross/Bunny_Hat_Raw-30th_Anniversary_Special_-0A1CD40E?id=73055",
	"/Anime/Macross/Episode-011-original?id=35423"
];
// regexes
kissanime.regexWhitelist = /episode|movie|special|OVA/i;
kissanime.regexBlacklist = /\b_[a-z]+|recap|\.5/i;
kissanime.regexCountdown = /\d+(?=\), function)/;

// loads kissanime cookies and then calls back
function kissanime_loadCookies(callback, arg1, arg2) {
	if (!GM_getValue("KAloadcookies", false)) {
		GM_setValue("KAloadcookies", true);
		GM_openInTab(kissanime.base, true);
	}
	if (callback) {
		setTimeout(function() {
			callback(arg1, arg2);
		}, 6000);
	}
}

// function to execute when scrip is run on kissanime
pageLoad["kissanime"] = function() {
	if (GM_getValue("KAloadcookies", false) && document.title != "Please wait 5 seconds...") {
		GM_setValue("KAloadcookies", false);
		window.close();
	}
}

getEpisodes["kissanime"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: kissanime.anime + url,
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissanime_loadCookies(getEpisodes["kissanime"], dataStream, url);
			} else if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get anchors for the episodes
				let as = jqPage.find(".listing").find("tr > td > a");
				// get title to split episode name and leave only "Episode xx"
				let title = jqPage.find("#leftside > div:nth-child(1) > div.barContent > div:nth-child(2) > a").text();
				// filter and add to episodes array
				as.each(function(i, e) {
					// title must match regexWhitelist, must not match regexBlacklist and href must not be in epsBlacklist to be considered a valid episode
					if (kissanime.regexWhitelist.test(e.text) && !kissanime.regexBlacklist.test(e.text) && kissanime.epsBlacklist.indexOf(e.href) == -1) {
						let t = e.text.split(title)[1].substring(1).replace(/ 0+(?=\d+)/, " ");
						// prepend new object to array
						episodes.unshift({
							text: t,
							href: kissanime.anime + e.href.split("/Anime/")[1] + kissanime.server
						});
					}
				});
				// get time until next episode
				let timeMillis = parseInt(kissanime.regexCountdown.exec(resp.responseText));
				// callback to insert episodes in list
				putEpisodes(dataStream, episodes, timeMillis);
			}
		}
	});
}

getEplistUrl["kissanime"] = function(partialUrl) {
	return kissanime.anime + partialUrl;
}

searchSite["kissanime"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "POST",
		data: "type=Anime" + "&keyword=" + title,
		url: kissanime.search,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissanime_loadCookies(search["kissanime"], id, title);
			} else if (resp.status == 200) {
				// OK
				let results = [];
				// if there is only one result, kissanime redirects to the only result page
				if (resp.finalUrl.indexOf(kissanime.search) == -1) {
					// only one result
					results.push({
						title:    title,
						href:     resp.finalUrl.split("/")[4],
						fullhref: kissanime.anime + resp.finalUrl.split("/")[4]
					});
				} else {
					// multiple results
					let list = $(resp.response).find("#leftside > div > div.barContent > div:nth-child(2) > table > tbody > tr").slice(2);
					list.each(function() {
						let a = $(this).find("a")[0];
						results.push({
							title:    a.text.replace(/\n\s+/, ""), // regex is used to remove leading whitespace
							href:     a.pathname.split("/")[2],
							fullhref: kissanime.anime + a.pathname.split("/")[2]
						});
					})
				}
				// callback
				putResults(id, results);
			}
		}
	});
}

