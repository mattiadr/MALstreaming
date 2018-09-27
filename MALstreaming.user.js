// ==UserScript==
// @name         MALstreaming
// @namespace    https://github.com/mattiadr/MALstreaming
// @version      5.20
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
// @match        https://myanimelist.net/ownlist/manga/add?selected_manga_id=*
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
	  results needs to be an array of object with title (display title), href (the url that will be put in the comments) attributes
	  and epsiodes (optional number of episodes)
	- if other utility is needed, add it in the service section and if you need to run a script on specific pages add another object to the pages array
*/

/* generic */
/*******************************************************************************************************************************************************************/
// contains variable properties for anime/manga modes
let properties = {};
properties.anime = {
	mode:          "anime",
	watching:      ".list-unit.watching",
	colHeader:     "<th class='header-title stream'>Watch</th>",
	commentsRegex: /Comments: ([\S ]+)(?=&nbsp;)/g,
	iconAdd:       ".icon-add-episode",
	findProgress:  ".data.progress",
	findAiring:    "span.content-status:contains('Airing')",
	latest:        "Latest ep is #",
	notAired:      "Not Yet Aired",
	ep:            "Ep.",
	editPageBox:   "#add_anime_comments",
};
properties.manga = {
	mode:          "manga",
	watching:      ".list-unit.reading",
	colHeader:     "<th class='header-title stream'>Read</th>",
	commentsRegex: /Comments: ([\S ]+)(?=\n)/g,
	iconAdd:       ".icon-add-chapter",
	findProgress:  ".data.chapter",
	findAiring:    "span.content-status:contains('Publishing')",
	latest:        "Latest ch is #",
	notAired:      "Not Yet Published",
	ep:            "Ch.",
	editPageBox:   "#add_manga_comments",
};
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
	{ id: "kissanime", type: "anime", name: "Kissanime",    domain: "kissanime.ru"     },
	{ id: "nineanime", type: "anime", name: "9anime",       domain: "www8.9anime.is"   },
	{ id: "masterani", type: "anime", name: "Masterani.me", domain: "www.masterani.me" },
	// manga
	{ id: "kissmanga", type: "manga", name: "Kissmanga",    domain: "kissmanga.com"    },
	{ id: "mangadex",  type: "manga", name: "MangaDex",     domain: "mangadex.org"     },
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
		if (prev && episodes[i].timestamp != prev) {
			let diff = prev - episodes[i].timestamp;
			if (!min || diff < min && diff > 0) min = diff;
		}
		prev = episodes[i].timestamp;
	}
	return episodes[episodes.length - 1].timestamp + min;
}

// returns the domain for the streaming service or false if ss doesn't exist
function getDomainById(id) {
	for (let i = 0; i < streamingServices.length; i++) {
		if (streamingServices[i].id == id) {
			return streamingServices[i].domain;
		}
	}
	return false;
}

/* anichart */
/*******************************************************************************************************************************************************************/
const anichartUrl = "http://anichart.net/airing";

// puts timeMillis into dataStream, then calls back
function anichart_setTimeMillis(dataStream, canReload) {
	let listitem = dataStream.parents(".list-item");

	// anime is not airing, exit
	if (listitem.find(properties.findAiring).length == 0) return;

	let times = GM_getValue("anichartTimes", false);
	// get anime id
	let id = listitem.find(".data.title > .link").attr("href").split("/")[2];
	let t = times ? times[id] : false;

	if (times && t && Date.now() < t.timeMillis) {
		// time doesn't need to update
		// set timeMillis, this is used to check if anichart timer is referring to next episode
		dataStream.data("timeMillis", t);
	} else {
		// add value change listener
		let listenerId = GM_addValueChangeListener("anichartTimes", function(name, old_value, new_value, remote) {
			// reload, avoid infinite loops
			if (canReload) anichart_setTimeMillis(dataStream, false);
			// remove listener
			GM_removeValueChangeListener(listenerId);
		});
		// load times from anichart
		if (!GM_getValue("anichartLoading", false)) {
			// set value then open anichart
			GM_setValue("anichartLoading", true);
			GM_openInTab(anichartUrl, true);
		}
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
				let id = $(this).find(".title > a").attr("href").match(/\d+$/)[0];
				let ep = $(this).find(".airing > span:first-child").text().match(/\d+/)[0];
				// get time array days, hours, mins
				let time = $(this).find("timer").text().match(/\d+/g);
				let timeMillis = ((parseInt(time[0]) * 24 + parseInt(time[1])) * 60 + parseInt(time[2])) * 60 * 1000;
				// edge case 0d 0h 0m
				if (timeMillis == 0) {
					timeMillis = undefined;
				} else {
					timeMillis += Date.now();
				}
				// set time, ep is episode the timer is referring to
				times[id] = {
					ep: ep,
					timeMillis: timeMillis
				}
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

/* kissanime */
/*******************************************************************************************************************************************************************/
const kissanime = {};
kissanime.base = "http://kissanime.ru/";
kissanime.anime = kissanime.base + "Anime/";
kissanime.search = kissanime.base + "Search/SearchSuggestx";
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
function kissanime_loadCookies(callback) {
	if (!GM_getValue("KAloadcookies", false)) {
		GM_setValue("KAloadcookies", true);
		GM_openInTab(kissanime.base, true);
	}
	if (callback) {
		setTimeout(function() {
			callback();
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
				kissanime_loadCookies(function() {
					getEpisodes["kissanime"](dataStream, url);
				});
			} else if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get anchors for the episodes
				let as = jqPage.find(".listing").find("tr > td > a");
				// get series title to remove it from episode name
				let title = jqPage.find("#leftside > div:nth-child(1) > div.barContent > div:nth-child(2) > a").text();
				// filter and add to episodes array
				as.each(function() {
					// title must match regexWhitelist, must not match regexBlacklist and href must not be in epsBlacklist to be considered a valid episode
					if (kissanime.regexWhitelist.test(this.text) && !kissanime.regexBlacklist.test(this.text) && kissanime.epsBlacklist.indexOf(this.href) == -1) {
						// prepend new object to array
						episodes.unshift({
							text: this.text.split(title)[1].substring(1).replace(/ 0+(?=\d+)/, " "),
							href: kissanime.anime + this.href.split("/Anime/")[1] + kissanime.server
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
		url: kissanime.search,
		data: "type=Anime" + "&keyword=" + title,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissanime_loadCookies(function() {
					searchSite["kissanime"](id, title);
				});
			} else if (resp.status == 200) {
				// OK
				let results = [];
				
				let list = $(resp.responseText);
				list.each(function() {
					results.push({
						title: this.text,
						href:  this.pathname.split("/")[2]
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
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
						episodes: ep ? (ep[0] + " eps") : "1 ep"
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

/* masterani */
/*******************************************************************************************************************************************************************/
const masterani = {};
masterani.base = "https://www.masterani.me/";
masterani.anime = masterani.base + "api/anime/";
masterani.anime_suffix = "/detailed";
masterani.anime_info = masterani.base + "anime/info/";
masterani.anime_watch = masterani.base + "anime/watch/";
masterani.search = masterani.base + "api/anime/filter?search=";
masterani.search_suffix = "&order=relevance_desc&page=1";

getEpisodes["masterani"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: masterani.anime + url + masterani.anime_suffix,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let res = JSON.parse(resp.response);
				let episodes = [];
				// get all episodes
				for (let i = 0; i < res.episodes.length; i++) {
					let ep = res.episodes[i].info.episode;
					// push episodes to array
					episodes.push({
						text: "Episode " + ep,
						href: masterani.anime_watch + url + "/" + ep,
					});
				}
				// callback
				putEpisodes(dataStream, episodes, undefined);
			}
		}
	});
}

getEplistUrl["masterani"] = function(partialUrl) {
	return masterani.anime_info + partialUrl;
}

searchSite["masterani"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: masterani.search + encodeURIComponent(title).slice(0, 60) + masterani.search_suffix, // maximum search length is 60 chars
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list = JSON.parse(resp.response).data;
				list = list.slice(0, 10);
				let results = [];
				// add to results
				for (let i = 0; i < list.length; i++) {
					let r = list[i];
					results.push({
						title:    r.title,
						href:     r.slug,
						episodes: r.episode_count
					});
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
kissmanga.search = kissmanga.base + "Search/SearchSuggest";
// regex
kissmanga.regexVol = /(?<=vol).+?\d+/i;

// loads kissmanga cookies and then calls back
function kissmanga_loadCookies(callback) {
	if (!GM_getValue("KMloadcookies", false)) {
		GM_setValue("KMloadcookies", true);
		GM_openInTab(kissmanga.base, true);
	}
	if (callback) {
		setTimeout(function() {
			callback();
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
				kissmanga_loadCookies(function() {
					getEpisodes["kissmanga"](dataStream, url);
				});
			} else if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get table rows for the episodes
				let trs = jqPage.find(".listing").find("tr");
				// get series title to remove it from chapter name
				let title = jqPage.find("#leftside > div:nth-child(1) > div.barContent > div:nth-child(2) > a").text();
				// filter and add to episodes array
				trs.each(function() {
					let a = $(this).find("td > a");
					if (a.length === 0) return;
					let t = a.text().split(title)[1].substring(1).replace(/ 0+(?=\d+)/, " ");
					// get all numbers in title
					let n = t.match(/\d+/g);
					// if vol is present then get second match else get first
					n = kissmanga.regexVol.test(t) ? n[1] : n[0];
					// chapter number - 1 is used as index
					n = parseInt(n) - 1;
					// add chapter to array
					episodes[n] = {
						text:      t,
						href:      kissmanga.manga + a.attr('href').split("/Manga/")[1],
						timestamp: Date.parse($(this).find("td:nth-child(2)").text()),
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
		url: kissmanga.search,
		data: "type=Manga" + "&keyword=" + title,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissmanga_loadCookies(function() {
					searchSite["kissmanga"](id, title);
				});
			} else if (resp.status == 200) {
				// OK
				let results = [];
				
				let list = $(resp.responseText);
				list.each(function() {
					results.push({
						title: this.text,
						href:  this.pathname.split("/")[2]
					});
				});
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
mangadex.manga_api = mangadex.base + "api/manga/";
mangadex.chapter = mangadex.base + "chapter/";
mangadex.lang_code = "gb";
mangadex.search = mangadex.base + "quick_search/";

getEpisodes["mangadex"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangadex.manga_api + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let res_ch = JSON.parse(resp.response).chapter;
				let episodes = [];
				// parse json
				for (let key in res_ch) {
					if (res_ch.hasOwnProperty(key)) {
						let ch = res_ch[key];
						// skip wrong language
						if (ch.lang_code != mangadex.lang_code) continue;
						// put into episodes array
						episodes[ch.chapter - 1] = {
							text:      `Vol. ${ch.volume} Ch. ${ch.chapter}`,
							href:      mangadex.chapter + key,
							timestamp: ch.timestamp,
						}
					}
				}
				// estimate timeMillis
				let timeMillis = estimateTimeMillis(episodes, 5);
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
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

/* MAL list */
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
	$(".more > a").each(function() {
		this.click();
	});
	// $(".more > a").click(); doesn't work for some reason

	// add col to table
	$("#list-container").find("th.header-title.title").after(properties.colHeader);
	$(".list-item .data.title").after("<td class='data stream'></td>");

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
		$(".data.stream").trigger("click");
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

	// timer event
	$(".data.stream").on("update-time", function() {
		let dataStream = $(this);
		// get time object from dataStream
		let t = dataStream.data("timeMillis");
		// get next episode number
		let nextEp = parseInt(dataStream.parents(".list-item").find(properties.findProgress).find(".link").text()) + 1;
		let timeMillis;
		// if t.ep is set then it needs to be equal to nextEp, else we set timeMillis to false to display Not Yet Aired
		if (t && (t.ep ? t.ep == nextEp : true)) {
			timeMillis = t.timeMillis - Date.now();
		} else {
			timeMillis = false;
		}

		let time;
		if (!timeMillis || isNaN(timeMillis) || timeMillis < 1000) {
			time = properties.notAired;
		} else {
			const d = Math.floor(timeMillis / (1000 * 60 * 60 * 24));
			const h = Math.floor((timeMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const m = Math.floor((timeMillis % (1000 * 60 * 60)) / (1000 * 60));
			time = (h < 10 ? "0"+h : h) + "h:" + (m < 10 ? "0" + m : m) + "m";
			if (d > 0) {
				time = d + (d == 1 ? " day " : " days ") + time;
			}
		}
		if (dataStream.find(".nextep, .loading, .error").length > 0) {
			// do nothing if timer is not needed
			return;
		} else if (dataStream.find(".timer").length === 0) {
			// if timer doesn't exist create it
			dataStream.prepend("<div class='timer'>" + time + "<div>");
		} else {
			// update timer
			dataStream.find(".timer").html(time);
		}
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
		// add new nextep
		dataStream.prepend(nextep);
	} else if (currEp > episodes.length) {
		// user has watched too many episodes
		nextep.append($("<div class='.ep-error'>" + properties.latest + episodes.length + "</div>").css("color", "red"));
		// add new nextep
		dataStream.prepend(nextep);
	} else {
		// there aren't episodes available, trigger timer
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
			// add eplist and favicon to dataStream
			if (dataStream.find(".eplist").length === 0) {
				// add eplist
				let eplistUrl = getEplistUrl[url[0]](url[1]);
				dataStream.append("<a class='eplist' target='_blank' href='" + eplistUrl + "'>" + properties.ep + " list</a>");
				// add favicon
				let domain = getDomainById(url[0]);
				if (domain) {
					let src = "https://www.google.com/s2/favicons?domain=" + domain;
					dataStream.append("<img class='favicon' src='" + src + "' style='position: relative; top: 3px; padding-left: 4px'>");
				}
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
		dataStream.data("timeMillis", { timeMillis: timeMillis });
		updateList(dataStream, false, false);
	} else if (properties.mode == "anime") {
		// timeMillis doesn't exist, get time from anichart
		anichart_setTimeMillis(dataStream, true);
		updateList(dataStream, false, false);
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
	streamingServices.forEach(function(ss) {
		if (ss.type != properties.mode) return;
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
	});
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
			siteDiv.append("(").append(a).append(") ").append("<a target='_blank' href='" + getEplistUrl[id](r.href) + "'>" + r.title + "</a>");
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