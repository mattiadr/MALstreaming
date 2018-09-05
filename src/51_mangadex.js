/* mangadex */
/*******************************************************************************************************************************************************************/
const mangadex = {};
mangadex.base = "https://mangadex.org/";
mangadex.manga = mangadex.base + "manga/";
mangadex.chapter = mangadex.base + "chapter/";
mangadex.search = mangadex.base + "quick_search/";
// selectors
mangadex.rowSelector = ".chapter-container > .row";
mangadex.titleSelector = "div > div > div:nth-child(2) > a";
mangadex.dateSelector = "div > div > div:nth-child(4)";
mangadex.navSelector = ".chapter-container ~ nav > ul";
// regex
mangadex.regexVol = /(?<=vol).+?\d+/i;

getEpisodes["mangadex"] = function(dataStream, url, episodes) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangadex.manga + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				// if there are no episodes from previous calls, init as new array
				if (!episodes) episodes = [];
				// get table rows for the episodes
				let rows = jqPage.find(mangadex.rowSelector).slice(1);
				// filter and add to episodes array
				rows.each(function() {
					let a = $(this).find(mangadex.titleSelector);
					let t = a.text();
					// get all numbers in title
					let n = t.match(/\d+/g);
					// if vol is present then get second match else get first
					if (mangadex.regexVol.test(t)) {
						n = n[1];
					} else {
						n = n[0];
					}
					// chapter number - 1 is used as index
					n = parseInt(n) - 1;
					// add chapter to array
					episodes[n] = {
						text: t,
						href: mangadex.chapter + a.attr('href').split("/chapter/")[1],
						date: $(this).find(mangadex.dateSelector).attr("title")
					}
				});

				// check if it's the last page
				let ul = jqPage.find(mangadex.navSelector);
				if (ul.length > 0 && ul.find("li.active + li.disabled").length == 0) {
					// not last page
					// slice at 7th char to remove /manga/ from the front
					let nextUrl = ul.find("li.active + li > a").attr("href").slice(7);
					// call getEpisodes on next page
					getEpisodes["mangadex"](dataStream, nextUrl, episodes);
				} else {
					// last page
					// estimate timeMillis
					let timeMillis = estimateTimeMillis(episodes, 5);
					// callback
					putEpisodes(dataStream, episodes, timeMillis);
				}
			}
		}
	});
}

getEplistUrl["mangadex"] = function(partialUrl) {
	return mangadex.manga + partialUrl;
}

searchSite["mangadex"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangadex.search + encodeURI(title),
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let results = [];
				// get title anchors
				let titles = $(resp.response).find("#search_manga").find("a.manga_title");
				titles.each(function() {
					results.push({
						title: this.title,
						href:  this.pathname.split("/")[2]
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

