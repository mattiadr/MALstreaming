// ==UserScript==
// @name         MALstreaming
// @namespace    https://github.com/mattiadr/MALstreaming
// @version      5.9
// @author       https://github.com/mattiadr
// @description  Adds various anime and manga links to MAL
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wQRDic4ysC1kQAAA+lJREFUWMPtlk1sVFUUx3/n3vvmvU6nnXbESkTCR9DYCCQSFqQiMdEY4zeJuiBhwUISAyaIHzHGaDTxKyzEr6ULNboiRonRhQrRCMhGiDFGA+WjhQ4NVKbtzJuP9969Lt4wlGnBxk03vZv3cu495/7u/5x7cmX1xk8dczjUXG4+DzAPMA8AYNoNIunXudnZ2+enrvkvn2kADkhiiwM8o6YEEuLE4pxDK0GakZUIoiCOHXFiW2uNEqyjZdNaIbMB0Ero7gwQ4OJEDa0VSoR6lNDT5eMZRaUa0YgSjFZU6zG1ekK+y6er00eJECWWchiRMYp8VwBAOYyw1l0dQIlQrcfcvKSHT968j+5chg+/OMoHnx9FCdwzsIRdz24gGxhe2v0Le74/htaKFYvzbNm4knWrF3J9IYtSQq0e8+C2r+jwDXvefYjEWja98B2DQyU6fINty8cVCigl9HYHiMCOzWs4/HuR4XNl3n5mPbmsB0DgGyYrDR69ewXvvXgXgW+oNxLOX6ySJJaebp/+ZQWOD5fIZT2cS5WddRGCw9oU5rVtA1SqEfmcTxRZPE8RxZbe7oBXnlpH4BtGx0Ke2PkNt624jte3DzBWqjF4ZhzP6GYBOtw1qtC07Y2I0IgTisUKtyztBaB4voLWQl8hS1iLuL2/j0V9OQC+/fkkx4ZK3L9hGQt6Oyj0BCiR1qZpwV5dgRn7gBLh1Y8OcmpkAoDndv3E6IUQgCRx9BWy6b91bH64n7P7tvL8lrU4l/pOi6dSRZWSaShmJgDPKIbPTfLy+wdYfEMXB46M0JXLNE8ElWoEQK0e8/fJi8SJpa+QZemi7hmiOSphxESlQRRb/IzGKMHNBOCaJwTI53wOHhnBM5pCPqDRSFIHrTh1drzls/2Nffx18h+efGwV7+y8kyi2l+O5VKW1KxeycEEn2Q6PPwfHKE3WMVpwrg1AAK1TkaxzBBlDEGiSxLXsgW84cWacE2fGWX5TnnsHlnB8qEQ2SG+J1qnM0lTLaMVbO+5AJL2ijzy9l7FSDaMV4FIAh0MpoRxGfL1vECRtHiK0Gsj+w8OcHpmkeKFCWIv54dAQWx9fxfo1N/Lxl38wVJzgx1+HCGsx1XoMwN79gy1VfU9zujjB2dFJfE9dLtKpb0JrHeUwzW8u66Gm3N9yGJEkls6sR5I4+pcX2PTArez+7DcmK+lcWIsRgc5mzyhXoivSq5W0+klL9fZH6SWpL9VCy64ERLDW4lyaorAaE2Q0xihE0kqnmfepsaZSJPYanXCmjVt265rnaAKJkM9lsM7hXLPg2nyvFuuaALMdjumn+T9jzh8k8wDzAPMAcw7wLz7iq04ifbsDAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTA0LTE3VDE0OjM5OjU2LTA0OjAw6I0f5AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wNC0xN1QxNDozOTo1Ni0wNDowMJnQp1gAAAAASUVORK5CYII=
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/mattiadr/MALstreaming/master/MALstreaming.user.js
// @downloadURL  https://raw.githubusercontent.com/mattiadr/MALstreaming/master/MALstreaming.user.js
// @supportURL   https://github.com/mattiadr/MALstreaming/issues
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/ownlist/anime/*/edit*
// @match        https://myanimelist.net/ownlist/anime/add?selected_series_id=*
// @match        https://myanimelist.net/mangalist/*
// @match        https://myanimelist.net/ownlist/manga/*/edit*
// @match        https://myanimelist.net/ownlist/manga/add?selected_series_id=*
// @match        http://anichart.net/airing
// @match        http://kissanime.ru/
// @match        http://kissmanga.com/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// ==/UserScript==

/*
	HOW TO ADD A NEW STREAMING SERVICE:
	- add a new object to the streamingServices array with attributes id (unique id, must be a valid identifier) and name (display name)
	- create a new function in getEplistUrl that will simply return the full url from the partial url (saved in comments)
	- create a new function in getEpisodes that will accept dataStream and url,
	  the function needs to callback to putEpisodes(dataStream, episodes, timeMillis)
	  url is the url of the episode list provoded by getEplistUrl
	  episodes needs to be an array of object with text and href attributes
	  timeMillis can optionally be the unix timestamp of the next episode
	- create a new function in search that will accept id and title
	  the function needs to callback to putResults(id, results)
	  results needs to be an array of object with title (display title), href (the url that will be put in the comments), fullhref (full url of page) attributes
	  and epsiodes (optional number of episodes)
	- if other utility is needed, add it in the service section and if you need to run a script on specific pages add another object to the pages array
*/

/* generic */
/*******************************************************************************************************************************************************************/
// contains variable properties for anime/manga modes
let properties = {};
properties["anime"] = {};
properties["manga"] = {};
properties["anime"].mode = "anime";
properties["manga"].mode = "manga";
properties["anime"].watching = ".list-unit.watching";
properties["manga"].watching = ".list-unit.reading";
properties["anime"].colHeader = "<th class='header-title stream'>Watch</th>";
properties["manga"].colHeader = "<th class='header-title stream'>Read</th>";
properties["anime"].commentsRegex = /Comments: ([\S ]+)(?=&nbsp;)/g;
properties["manga"].commentsRegex = /Comments: ([\S ]+)(?=\n)/g;
properties["anime"].iconAdd = ".icon-add-episode";
properties["manga"].iconAdd = ".icon-add-chapter";
properties["anime"].findProgress = ".data.progress";
properties["manga"].findProgress = ".data.chapter";
properties["anime"].findAiring = "span.content-status:contains('Airing')";
properties["manga"].findAiring = "span.content-status:contains('Publishing')";
properties["anime"].latest = "Latest ep is #";
properties["manga"].latest = "Latest ch is #";
properties["anime"].notAired = "Not Yet Aired";
properties["manga"].notAired = "Not Yet Published";
properties["anime"].ep = "Ep.";
properties["manga"].ep = "Ch.";
properties["anime"].editPageBox = "#add_anime_comments";
properties["manga"].editPageBox = "#add_manga_comments";
// contains all functions to execute on page load
const pageLoad = {};
// contains all functions to get the episodes list from the streaming services
// must callback to putEpisodes(dataStream, episodes, timeMillis)
const getEpisodes = {};
// contains all functions to get the episode list url from the partial url
const getEplistUrl = {};
// contains all functions to execute the search on the streaming services
// must callback to putResults(results)
const searchSite = {};
// is an array of valid streaming services names
const streamingServices = [
	// anime
	{ id: "nineanime", type: "anime", name: "9anime"    },
	{ id: "kissanime", type: "anime", name: "Kissanime" },
	// manga
	{ id: "kissmanga", type: "manga", name: "Kissmanga" },
	{ id: "mangadex",  type: "manga", name: "MangaDex"  },
];

// return an array that contains the streaming service and url relative to that service or false if comment is not valid
function getUrlFromComment(comment) {
	let c = comment.split(" ");
	if (c.length < 2) return false;
	for (let i = 0; i < streamingServices.length; i++) {
		if (streamingServices[i].id == c[0]) return c;
	}
	return false;
}

// estimate time before next chapter as min of last n chapters
function estimateTimeMillis(episodes, n) {
	let prev = null;
	let min = undefined;
	for (let i = episodes.length - 1; i > Math.max(0, episodes.length - 1 - n); i--) {
		if (!episodes[i]) continue;
		if (prev && episodes[i].date != prev) {
			let diff = Date.parse(prev) - Date.parse(episodes[i].date);
			if (!min || diff < min && diff > 0) min = diff;
		}
		prev = episodes[i].date;
	}
	return Date.parse(episodes[episodes.length - 1].date) + min;
}

/* anichart */
/*******************************************************************************************************************************************************************/
const anichartUrl = "http://anichart.net/airing";

// puts timeMillis into dataStream, then calls back
function anichart_setTimeMillis(dataStream, callback) {
	let times = GM_getValue("anichartTimes", false);
	// get anime id
	let link = dataStream.parents(".list-item").find(".data.title > .link");
	// get time for current anime
	let currentTime = times[link.attr("href").split("/")[2]];

	if (times && (!currentTime || Date.now() < currentTime)) {
		// time doesn't need to update
		// set timeMillis
		dataStream.data("timeMillis", currentTime);
		// callback
		callback();
	} else if (!GM_getValue("anichartLoading", false)) {
		// load times from anichart
		// add value change listener
		let listenerId = GM_addValueChangeListener("anichartTimes", function(name, old_value, new_value, remote) {
			// set anichart.times
			times = new_value;
			// call back
			anichart_setTimeMillis(dataStream, callback);
			// remove listener
			GM_removeValueChangeListener(listenerId);
		});
		// set value then open anichart
		GM_setValue("anichartLoading", true);
		GM_openInTab(anichartUrl, true);
	} else {
		// anichart still loading, add value change listener
		let listenerId = GM_addValueChangeListener("anichartTimes", function(name, old_value, new_value, remote) {
			// call back
			anichart_setTimeMillis(dataStream, callback);
			// remove listener
			GM_removeValueChangeListener(listenerId);
		});
	}
}

// function to execute when script is run on anichart
pageLoad["anichart"] = function() {
	// wait all items
	setTimeout(function() {
		// get items or cards
		let items = $(".item, .card");
		let times = {};
		if ($(items[0]).find(".title > a").attr("href").indexOf("myanimelist.net") != -1) {
			// check if using MAL urls
			items.each(function(i, e) {
				// get id from url
				let id = $(e).find(".title > a").attr("href").match(/\d+$/)[0];
				// get time array days, hours, mins
				let time = $(e).find("timer").text().match(/\d+/g);
				let timeMillis = ((parseInt(time[0]) * 24 + parseInt(time[1])) * 60 + parseInt(time[2])) * 60 * 1000;
				// edge case 0d 0h 0m
				if (timeMillis == 0) {
					timeMillis = undefined;
				} else {
					timeMillis += Date.now();
				}
				times[id] = timeMillis;
			});
		}
		// put times in GM value
		GM_setValue("anichartTimes", times);
		// finished loading, close only if opened by script
		if (GM_getValue("anichartLoading", false)) {
			GM_setValue("anichartLoading", false);
			window.close();
		}
	}, 500);
}

/* 9anime */
/*******************************************************************************************************************************************************************/
const nineanime = {};
nineanime.base = "https://9anime.is/";
nineanime.anime = nineanime.base + "watch/";
nineanime.servers = nineanime.base + "ajax/film/servers/";
nineanime.search = nineanime.base + "search?keyword=";
nineanime.regexBlacklist = /preview|special|trailer|CAM/i;

getEpisodes["nineanime"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: nineanime.servers + url.match(/(?<=\.)\w+$/)[0],
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				// response is a json with only html attribute, parse and turn into jQuery object
				let jqPage = $(JSON.parse(resp.response).html);
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
								// date: $(this).data("title").replace("-", "")
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
							}/* else if (episodes.length > 0) {
								// timer is not present, estimating based on latest episode
								let timeStr = episodes[episodes.length - 1].date;
								timeMillis = Date.parse(timeStr) + 1000 * 60 * 60 * 24 * 7;
							}*/
							// callback
							putEpisodes(dataStream, episodes, timeMillis);
						} else {
							// not OK, callback
							putEpisodes(dataStream, episodes, undefined);
						}
					}
				});
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

// function to execute when script is run on kissanime
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
				let timeMillis = Date.now() + parseInt(kissanime.regexCountdown.exec(resp.responseText));
				// callback
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

// function to execute when script is run on kissmanga
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
				// get table rows for the episodes
				let trs = jqPage.find(".listing").find("tr");
				// series title to split chapter title
				let title = jqPage.find("#leftside > div:nth-child(1) > div.barContent > div:nth-child(2) > a").text();
				// filter and add to episodes array
				trs.each(function(i, e) {
					let a = $(e).find("td > a");
					if (a.length === 0) return;
					let t = a.text().split(title)[1].substring(1).replace(/ 0+(?=\d+)/, " ");
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
						href: kissmanga.manga + a.attr('href').split("/Manga/")[1],
						date: $(e).find("td:nth-child(2)").text()
					}
				});
				// estimate timeMillis
				let timeMillis = estimateTimeMillis(episodes, 5);
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
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

/* mangadex */
/*******************************************************************************************************************************************************************/
const mangadex = {};
mangadex.base = "https://mangadex.org/";
mangadex.manga = mangadex.base + "manga/";
mangadex.chapter = mangadex.base + "chapter/";
mangadex.search = mangadex.base + "quick_search/";
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
				let trs = jqPage.find("#content > div.edit.tab-content > div > table > tbody > tr");
				// filter and add to episodes array
				trs.each(function(i, e) {
					let a = $(e).find("td:nth-child(2) > a");
					let t = a.text();
					// get all numbers in title
					let ns = t.match(/\d+/g);
					let n;
					// if vol is present then get second match else get first
					if (mangadex.regexVol.test(t)) {
						n = ns[1];
					} else {
						n = ns[0];
					}
					// chapter number - 1 is used as index
					n = parseInt(n) - 1;
					// add chapter to array
					episodes[n] = {
						text: t,
						href: mangadex.chapter + a.attr('href').split("/chapter/")[1],
						date: $(e).find("td:nth-child(8)").attr("title")
					}
				});

				// check if it's the last page
				let ul = jqPage.find("#content > div.edit.tab-content > nav > ul");
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
						title:    this.title,
						href:     this.pathname.split("/")[2],
						fullhref: mangadex.manga + this.pathname.split("/")[2]
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}/* MAL list */
/*******************************************************************************************************************************************************************/
pageLoad["list"] = function() {
	// own list
	if ($(".header-menu.other").length !== 0) return;
	if ($(properties.watching).length !== 1) return;

	// force hide more-info
	const styleSheet = document.createElement("style");
	styleSheet.innerHTML =`
		.list-table .more-info {
			display: none!important;
		}
	`;
	document.body.appendChild(styleSheet);

	// expand more-info
	$(".more > a").each(function(i, e) {
		e.click();
	});

	// add col to table
	$("#list-container").find("th.header-title.title").after(properties.colHeader);
	$(".list-item").each(function() {
		$(this).find(".data.title").after("<td class='data stream'></td>");
	});

	// style
	$(".data.stream").css("font-weight", "normal");
	$(".data.stream").css("line-height", "1.5em");
	$(".header-title.stream").css("min-width", "120px");

	// wait
	setTimeout(function() {
		// collapse more-info
		$(".more-info").css("display", "none");
		// remove sheet
		document.body.removeChild(styleSheet);

		// put comment into data("comment")
		$(".list-item").each(function() {
			let comment = $(this).find(".td1.borderRBL").html().match(properties.commentsRegex);
			if (comment) {
				// revome the first 10 characters to remove "Comments: " since js doesn't support lookbehinds
				comment = comment.toString().substring(10);
			} else {
				comment = null;
			}

			$(this).find(".data.stream").data("comment", comment);
		});

		// load links
		$(".header-title.stream").trigger("click");
	}, 1000);

	// event listeners
	// column header
	$(".header-title.stream").on("click", function() {
		$(".data.stream").each(function() {
			$(this).trigger("click");
		});
	});

	// table cell
	$(".data.stream").on("click", function() {
		updateList($(this), true, true);
	});

	// complete one episode
	$(properties.iconAdd).on("click", function() {
		let dataStream = $(this).parents(".list-item").find(".data.stream");
		updateList(dataStream, false, true);
	});

	// update timer
	setInterval(function() {
		$(".data.stream").trigger("update-time");
	}, 1000);
}

// updates dataStream cell
function updateList(dataStream, forceReload, canReload) {
	// remove old divs
	dataStream.find(".error").remove();
	dataStream.find(".nextep").remove();
	dataStream.find(".loading").remove();
	dataStream.find(".timer").remove();
	dataStream.off("update-time");
	// get episode list from data
	let episodeList = dataStream.data("episodeList");
	if (Array.isArray(episodeList) && !forceReload) {
		// episode list exists
		updateList_exists(dataStream);
	} else if (canReload) {
		// episode list doesn't exist or needs to be reloaded
		updateList_doesntExist(dataStream);
	} else {
		// broken link
		dataStream.prepend($("<div class='error'>Broken link<br></div>").css("color", "red"));
	}
}

function updateList_exists(dataStream) {
	// listitem
	let listitem = dataStream.parents(".list-item");
	// get current episode number
	let currEp = parseInt(listitem.find(properties.findProgress).find(".link").text());
	if (isNaN(currEp)) currEp = 0;
	// get episodes from data
	let episodes = dataStream.data("episodeList");
	// create new nextep
	let nextep = $("<div class='nextep'></div>");
	// add new nextep
	dataStream.prepend(nextep);

	if (episodes.length > currEp) {
		// there are episodes available
		let isAiring = listitem.find(properties.findAiring).length !== 0;
		let t = episodes[currEp] ? episodes[currEp].text : ("Missing #" + (currEp + 1));

		let a = $("<a></a>");
		a.text(t.length > 13 ? t.substr(0, 12) + "…" : t);
		if (t.length > 13) a.attr("title", t);
		a.attr("href", episodes[currEp] ? episodes[currEp].href : "#");
		a.attr("target", "_blank");
		a.attr("class", isAiring ? "airing" : "non-airing");
		a.css("color", isAiring ? "#2db039" : "#ff730a");
		nextep.append(a);

		if (episodes.length - currEp > 1) {
			// if there is more than 1 new ep then put the amount in parenthesis
			nextep.append(" (" + (episodes.length - currEp) + ")");
		}
	} else if (currEp > episodes.length) {
		// user has watched too many episodes
		nextep.append($("<div class='.ep-error'>" + properties.latest + episodes.length + "</div>").css("color", "red"));
	} else {
		// there aren't episodes available, displaying timer
		// add update-time event
		dataStream.on("update-time", function() {
			// get time remaining from air timestamp
			let timeMillis = dataStream.data("timeMillis") - Date.now();
			let time;
			if (!timeMillis || isNaN(timeMillis) || timeMillis < 1000) {
				time = properties.notAired;
				dataStream.off("update-time");
			} else {
				const d = Math.floor(timeMillis / (1000 * 60 * 60 * 24));
				const h = Math.floor((timeMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				const m = Math.floor((timeMillis % (1000 * 60 * 60)) / (1000 * 60));
				time = (h < 10 ? "0"+h : h) + "h:" + (m < 10 ? "0" + m : m) + "m";
				if (d > 0) {
					time = d + (d == 1 ? " day " : " days ") + time;
				}
			}
			// if timer doesn't exist create it, otherwise update it
			if (dataStream.find(".timer").length === 0) {
				dataStream.prepend("<div class='timer'>" + time + "<div>");
			} else {
				dataStream.find(".timer").html(time);
			}
		});

		dataStream.trigger("update-time");
	}
}

function updateList_doesntExist(dataStream) {
	// check if comment exists and is correct
	let comment = dataStream.data("comment");
	if (comment) {
		// comment exists
		// url is and array that contains the streaming service and url relative to that service
		let url = getUrlFromComment(comment);
		if (url) {
			// comment valid
			// add loading
			dataStream.prepend("<div class='loading'>Loading...</div>");
			// add eplist to dataStream
			if (dataStream.find(".eplist").length === 0) {
				let eplistUrl = getEplistUrl[url[0]](url[1]);
				dataStream.append("<a class='eplist' target='_blank' href='" + eplistUrl + "'>" + properties.ep + " list</a>");
			}
			// executes getEpisodes relative to url[0] passing dataStream and url[1]
			getEpisodes[url[0]](dataStream, url[1]);
		} else {
			// comment invalid
			dataStream.append("<div class='error'>Invalid Link</div>")
		}
	} else {
		// comment doesn't extst
		dataStream.append("<div class='error'>No Link</div>");
	}
}

// save episodeList and timeMillis inside .data.stream of listitem
function putEpisodes(dataStream, episodes, timeMillis) {
	// add episodes to dataStream
	dataStream.data("episodeList", episodes);
	// add timeMillis to dataStream
	if (timeMillis) {
		// timeMillis is valid
		dataStream.data("timeMillis", timeMillis);
		updateList(dataStream, false, false);
	} else if (properties.mode == "anime") {
		// timeMillis doesn't exist, get time from anichart
		anichart_setTimeMillis(dataStream, function() {
			updateList(dataStream, false, false);
		});
	}
}

/* MAL edit */
/*******************************************************************************************************************************************************************/
pageLoad["edit"] = function() {
	// get title
	const title = $("#main-form > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > strong > a")[0].text;
	// add titleBox with default title
	let titleBox = $("<input type='text' value='" + title + "' size='36' style='font-size: 11px; padding: 3px;'>");
	// add #search div
	let search = $("<div id='search'><b style='font-size: 110%; line-height: 180%;'>Search: </b></div>");
	$(properties.editPageBox).after("<br>", titleBox, "<br>", search);
	// add streamingServices
	let first = true;
	for (let i = 0; i < streamingServices.length; i++) {
		let ss = streamingServices[i];
		if (ss.type != properties.mode) continue;
		// don't append ", " before first ss
		if (first) {
			first = false;
		} else {
			search.append(", ");
		}
		// new anchor
		let a = $("<a></a>");
		a.text(ss.name);
		a.attr("href", "#");
		// on anchor click
		a.on("click", function() {
			// remove old results
			search.find(".site").remove();
			// add new result box
			search.append("<div class='site " + ss.id + "'><div id='searching'>Searching...</div></div>");
			// execute search
			searchSite[ss.id](ss.id, titleBox.val());
			// return
			return false;
		});
		search.append(a);
	}
	search.append("<br>");
}

function putResults(id, results) {
	let siteDiv = $("#search").find("." + id);
	// if div with current id cant be found then don't add results
	if (siteDiv.length !== 0) {
		siteDiv.find("#searching").remove();

		if (results.length === 0) {
			siteDiv.append("No Results. Try changing the title in the search box above.");
			return;
		}
		// add results
		for (let i = 0; i < results.length; i++) {
			let r = results[i];
			let a = $("<a href='#'>Select</a>");
			a.on("click", function() {
				$(properties.editPageBox).val(id + " " + r.href);
				return false;
			});
			siteDiv.append("(").append(a).append(") ").append("<a target='_blank' href='" + r.fullhref + "'>" + r.title + "</a>");
			if (r.episodes) {
				siteDiv.append(" (" + r.episodes + ")");
			}
			siteDiv.append("<br>");
		}
	}
}

/* main */
/*******************************************************************************************************************************************************************/
// associates an url with properties and pageLoad function
let pages = [
	{ url: kissanime.base,                           prop: null,    load: "kissanime" },
	{ url: kissmanga.base,                           prop: null,    load: "kissmanga" },
	{ url: anichartUrl,                              prop: null,    load: "anichart"  },
	{ url: "https://myanimelist.net/animelist/",     prop: "anime", load: "list"      },
	{ url: "https://myanimelist.net/mangalist/",     prop: "manga", load: "list"      },
	{ url: "https://myanimelist.net/ownlist/anime/", prop: "anime", load: "edit"      },
	{ url: "https://myanimelist.net/ownlist/manga/", prop: "manga", load: "edit"      },
];

(function($) {
	for (let i = 0; i < pages.length; i++) {
		if (window.location.href.indexOf(pages[i].url) != -1) {
			properties = properties[pages[i].prop];
			pageLoad[pages[i].load]();
			break;
		}
	}
})(jQuery);