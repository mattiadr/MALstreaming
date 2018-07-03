/* kissmanga */
/*******************************************************************************************************************************************************************/
const kissmanga = {};
kissmanga.base = "http://kissmanga.com/";
kissmanga.manga = kissmanga.base + "Manga/";
kissmanga.search = kissmanga.base + "Search/Manga/";
// regex
kissmanga.regexVol = /(?<=vol).+?\d+/i;

// loads kissmanga cookies and then calls back
function kissmanga_loadCookies(callback, arg1, arg2) {
	if (!GM_getValue("KMloadcookies", false)) {
		GM_setValue("KMloadcookies", true);
		GM_openInTab(kissmanga.base, true);
	}
	if (callback) {
		setTimeout(function() {
			callback(arg1, arg2);
		}, 6000);
	}
}

// function to execute when scrip is run on kissmanga
pageLoad["kissmanga"] = function() {
	if (GM_getValue("KMloadcookies", false) && document.title != "Please wait 5 seconds...") {
		GM_setValue("KMloadcookies", false);
		window.close();
	}
}

getEpisodes["kissmanga"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: kissmanga.manga + url,
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissmanga_loadCookies(getEpisodes["kissmanga"], dataStream, url);
			} else if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get anchors for the episodes
				let as = jqPage.find(".listing").find("tr > td > a");
				// filter and add to episodes array
				as.each(function(i, e) {
					// get chapter title without series title
					let title = jqPage.find("#leftside > div:nth-child(1) > div.barContent > div:nth-child(2) > a").text();
					let t = e.text.split(title)[1].substring(1).replace(/ 0+(?=\d+)/, " ");
					// get all numbers in title
					let ns = t.match(/\d+/g);
					let n;
					// if vol is present then get second match else get first
					if (kissmanga.regexVol.test(t)) {
						n = ns[1];
					} else {
						n = ns[0];
					}
					// chapter number - 1 is used as index
					n = parseInt(n) - 1;
					// add chapter to array
					episodes[n] = {
						text: t,
						href: kissmanga.manga + e.href.split("/Manga/")[1]
					}
				});
				// callback to insert episodes in list
				putEpisodes(dataStream, episodes, undefined);
			}
		}
	});
}

getEplistUrl["kissmanga"] = function(partialUrl) {
	return kissmanga.manga + partialUrl;
}

searchSite["kissmanga"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "POST",
		data: "type=Manga" + "&keyword=" + title,
		url: kissmanga.search,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissmanga_loadCookies(search["kissmanga"], id, title);
			} else if (resp.status == 200) {
				// OK
				let results = [];
				// if there is only one result, kissmanga redirects to the only result page
				if (resp.finalUrl.indexOf(kissmanga.search) == -1) {
					// only one result
					results.push({
						title:    title,
						href:     resp.finalUrl.split("/")[4],
						fullhref: kissmanga.manga + resp.finalUrl.split("/")[4]
					});
				} else {
					// multiple results
					let list = $(resp.response).find("#leftside > div > div.barContent > div:nth-child(2) > table > tbody > tr").slice(2);
					list.each(function() {
						let a = $(this).find("a")[0];
						results.push({
							title:    a.text.replace(/\n\s+/, ""), // regex is used to remove leading whitespace
							href:     a.pathname.split("/")[2],
							fullhref: kissmanga.manga + a.pathname.split("/")[2]
						});
					})
				}
				// callback
				putResults(id, results);
			}
		}
	});
}

