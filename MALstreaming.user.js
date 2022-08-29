// ==UserScript==
// @name         MALstreaming
// @namespace    https://github.com/mattiadr/MALstreaming
// @version      5.78
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
// @match        https://9anime.to/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdn.rawgit.com/dcodeIO/protobuf.js/6.8.8/dist/protobuf.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// @connect      *
// ==/UserScript==

/* generic */
/*******************************************************************************************************************************************************************/
// array of all streaming services
const streamingServices = [
	// anime
	{ id: "nineanime",  type: "anime", name: "9anime",      domain: "9anime.to"                },
	{ id: "animetwist", type: "anime", name: "Anime Twist", domain: "twist.moe"                },
	{ id: "erairaws",   type: "anime", name: "Erai-raws",   domain: "www.erai-raws.info"       },
	{ id: "subsplease", type: "anime", name: "SubsPlease",  domain: "subsplease.org"           },
	// manga
	{ id: "mangadex",   type: "manga", name: "MangaDex",    domain: "mangadex.org"             },
	{ id: "mangaplus",  type: "manga", name: "MANGA Plus",  domain: "mangaplus.shueisha.co.jp" },
];
// contains variable properties for anime/manga modes
let properties = {};
properties.anime = {
	mode:          "anime",
	watching:      ".list-unit.watching",
	colHeaderText: "Watch",
	commentsRegex: /Notes: ([\S ]+)&nbsp;/,
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
	colHeaderText: "Read",
	commentsRegex: /Notes: ([\S ]+)\n/,
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
// contains queue settings for queuing requests to services (optional)
// must contain `maxRequests` and `timout`
const queueSettings = {};
queueSettings["default"] = {
	maxRequests: 1,
	timeout:     1000,
}
// contains all functions to get the episode list url from the partial url
const getEplistUrl = {};
// contains all functions to execute the search on the streaming services
// must callback to putResults(results)
const searchSite = {};

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
	if (episodes.length == 0) return undefined;
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

// returns true if the result matches the title
function matchResult(result, title) {
	// split title into tokens
	let split = title.split(/\W+/g);
	for (let i = 0; i < split.length; i++) {
		// result must contain all tokens
		if (!result.title.toLowerCase().includes(split[i].toLowerCase())) {
			return false;
		}
	}
	return true;
}

// stackexchange's string format utility
String.prototype.formatUnicorn = function() {
	let e = this.toString();
	if (!arguments.length) return e;
	let t = typeof arguments[0];
	let n = "string" === t || "number" === t ? Array.prototype.slice.call(arguments) : arguments[0];
	for (let i in n) {
		e = e.replace(new RegExp("\\{" + i + "\\}", "gi"), n[i]);
	}
	return e;
}

/* anilist */
/*******************************************************************************************************************************************************************/
const anilist = {};
anilist.api = "https://graphql.anilist.co";
anilist.query = `\
query ($idMal: Int) {
	Media(type: ANIME, idMal: $idMal) {
		airingSchedule(notYetAired: true, perPage: 1) {
			nodes {
				episode
				airingAt
			}
		}
	}
}`;

// request time until next episode for the specified anime id
function requestTime(id) {
	// prepare data
	let data = {
		query: anilist.query,
		variables: { idMal: id }
	};
	// do request
	GM_xmlhttpRequest({
		method:  "POST",
		url:     anilist.api,
		headers: { "Content-Type": "application/json" },
		data:    JSON.stringify(data),
		onload:  function(resp) {
			let res = JSON.parse(resp.response);
			let times = GM_getValue("anilistTimes", {});
			// get data from response
			let sched = res.data.Media.airingSchedule.nodes[0];
			// if there is no episode then it means the last episode just notYetAired
			if (!sched || !sched.episode) return;
			let ep = sched.episode;
			let timeMillis = sched.airingAt * 1000;
			// set time, ep is episode the timer is referring to
			times[id] = {
				ep: ep,
				timeMillis: timeMillis
			};
			// put times in GM value
			GM_setValue("anilistTimes", times);
		}
	});
}

// puts timeMillis into dataStream, then calls back
function anilist_setTimeMillis(dataStream, canReload) {
	let listitem = dataStream.parents(".list-item");

	let times = GM_getValue("anilistTimes", false);
	// get anime id
	let id = listitem.find(".data.title > .link").attr("href").split("/")[2];
	let t = times ? times[id] : false;

	if (times && t && Date.now() < t.timeMillis) {
		// time doesn't need to update
		// set timeMillis, this is used to check if anilist timer is referring to next episode
		dataStream.data("timeMillis", t);
		dataStream.trigger("update-time");
	} else if (canReload) {
		// add value change listener
		let listenerId = GM_addValueChangeListener("anilistTimes", function(name, old_value, new_value, remote) {
			// reload
			anilist_setTimeMillis(dataStream, false);
			// remove listener
			GM_removeValueChangeListener(listenerId);
		});
		// api request to anilist
		requestTime(id);
	}
}

/* cookies */
/*******************************************************************************************************************************************************************/
// array with services that require cookies to make requests
const cookieServices = [
	// anime
	{ id: "nineanime", status: 401, url: "https://9anime.to/", loaded: _ => document.title != "Redirecting...", timeout: 1000 },
	// manga
];

// checks if i need/can load cookies and returns the cookieService
function needsCookies(id, status) {
	for (let i = 0; i < cookieServices.length; i++) {
		if (cookieServices[i].id == id && cookieServices[i].status == status) return cookieServices[i];
	}
	return false;
}

// load cookies for specified service, then calls back
function loadCookies(cookieService, callback) {
	let lc = GM_getValue("loadCookies", {});
	if (lc[cookieService.id] === undefined || lc[cookieService.id] + 30*1000 < Date.now()) {
		lc[cookieService.id] = Date.now();
		GM_setValue("loadCookies", lc);
		GM_openInTab(cookieService.url, true);
	}
	if (callback) {
		setTimeout(function() {
			callback();
		}, cookieService.timeout);
	}
}

// function to execute when script is run on website to load cookies from
pageLoad["loadCookies"] = function(cookieService) {
	let lc = GM_getValue("loadCookies", {});
	if (lc[cookieService.id] && cookieService.loaded()) {
		lc[cookieService.id] = false;
		GM_setValue("loadCookies", lc);
		window.close();
	}
}

/* 9anime */
/*******************************************************************************************************************************************************************/
const nineanime = {};
nineanime.base = "https://9anime.to/";
nineanime.anime = nineanime.base + "watch/";
nineanime.servers = nineanime.base + "ajax/anime/servers?id=";
nineanime.search = nineanime.base + "search?keyword=";
nineanime.regexBlacklist = /preview|special|trailer|CAM/i;

getEpisodes["nineanime"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: nineanime.servers + url.match(/\.(\w+)$/)[1],
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let res = JSON.parse(resp.response);
				let jqPage = $(res.html);
				let episodes = [];

				let list = jqPage.find(".episodes > li > a");
				list.each(function() {
					// ignore blacklisted episodes
					if (!nineanime.regexBlacklist.test($(this).text())) {
						// push episode to array
						episodes.push({
							text: "Episode " + $(this).text(),
							href: nineanime.base + $(this).attr("href").substr(1),
						});
					}
				});

				// callback
				putEpisodes(dataStream, episodes, undefined);
			} else {
				let cs = needsCookies("nineanime", resp.status);
				// error
				if (!cs) return errorEpisodes(dataStream, "9anime: " + resp.status);
				// load cookies
				loadCookies(cs, function() {
					getEpisodes["nineanime"](dataStream, url);
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
				let list = jqPage.find("ul.anime-list > li");
				list = list.slice(0, 10);
				// add to results
				list.each(function() {
					// get anchor for text and href
					let a = $(this).find("a")[1];
					// get episode count
					let ep = $(this).find(".tag.ep").text().match(/\/(\d+)/);
					results.push({
						title:    a.text,
						href:     a.href.split("/")[4],
						episodes: ep ? (ep[1] + " eps") : "1 ep"
					});
				});
				// callback
				putResults(id, results);
			} else {
				let cs = needsCookies("nineanime", resp.status);
				// error
				if (!cs) return errorResults(id, "9anime: " + resp.status);
				// load cookies
				loadCookies(cs, function() {
					searchSite["nineanime"](id, title);
				});
			}
		}
	});
}

/* animetwist */
/*******************************************************************************************************************************************************************/
const animetwist = {};
animetwist.base = "https://twist.moe/";
animetwist.anime = animetwist.base + "a/"
animetwist.api = "https://api.twist.moe/api/anime";

getEpisodes["animetwist"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: `${animetwist.api}/${url}`,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list = JSON.parse(resp.response).episodes;
				let episodes = [];
				// insert all episodes
				for (let i = 0; i < list.length; i++) {
					let n = list[i].number;
					episodes[n - 1] = {
						text: "Episode " + n,
						href: animetwist.anime + url + "/" + n,
					}
				}
				// callback
				putEpisodes(dataStream, episodes, undefined);
			} else {
				// error
				errorEpisodes(dataStream, "Anime Twist: " + resp.status);
			}
		}
	});
}

getEplistUrl["animetwist"] = function(partialUrl) {
	return animetwist.anime + partialUrl;
}

searchSite["animetwist"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: animetwist.api,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list = JSON.parse(resp.response);
				if (!list) {
					// error
					return;
				}
				// map and filter list to results
				let results = list.map(item => ({
					title: item.title,
					href:  item.slug.slug,
				})).filter(item => matchResult(item, title));
				// callback
				putResults(id, results);
			} else {
				// error
				errorResults(id, "Anime Twist: " + resp.status);
			}
		}
	});
}

/* erai-raws */
/*******************************************************************************************************************************************************************/
const erairaws = {};
erairaws.base = "https://www.erai-raws.info/";
erairaws.anime = erairaws.base + "anime-list/";
erairaws.api = erairaws.base + "wp-admin/admin-ajax.php";
erairaws.regexEpisode = /A|F/i;

getEpisodes["erairaws"] = function(dataStream, url) {
	// prepare data
	let query = {
		"anime-list": url,
		"nopaging": true
	};
	let data = "action=load_more_0&query=" + encodeURI(JSON.stringify(query));

	// request
	GM_xmlhttpRequest({
		method: "POST",
		url: erairaws.api,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		data: data,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];

				jqPage.find(".post-inner").each(function() {
					// get episode number
					let title = $(this).find("div:first-child > h1 > font > a:last-child > font").text();
					let ep = parseInt(title.match(/\d+/)[0]);
					// get max resolution magnet
					let div = $(this).find("div:nth-child(3) > div:nth-child(2) > div");
					let res = div.find("i:first-child").text().slice(1, -1);
					let magnet = div.find(":last-child > :first-child").attr("href");
					// put episode into array
					episodes[ep - 1] = {
						text: "Ep " + ep + " (" + res + ")",
						href: magnet
					};
				});

				// callback
				putEpisodes(dataStream, episodes, undefined);

				// get batch episodes if any
				GM_xmlhttpRequest({
					method: "GET",
					url: erairaws.anime + url,
					onload: function(resp) {
						if (resp.status == 200) {
							// OK
							let jqPage = $(resp.response);
							// get first batch post and stop if no batch is available
							let postInner = jqPage.find(".show-batch > article:first-child > .post-inner");
							if (postInner.length <= 0) return;
							// get batch title
							let title = postInner.find("div:first-child > h1 > a:nth-child(3) > font > font > font").text();
							// get max resolution magnet
							let div = postInner.find("div:nth-child(3) > div:nth-child(2) > div");
							let magnet = div.find(":last-child > :first-child").attr("href");
							// get first and last episodes of batch
							let m = title.match(/(\d+)\D+(\d+)/);
							let first = parseInt(m[1]);
							let last = parseInt(m[2]);

							// add missing episodes
							let obj = {
								text: "Batch " + first + " ~ " + last,
								href: magnet
							};
							for (let i = first - 1; i < last; i++) {
								if (!episodes[i]) {
									episodes[i] = obj;
								}
							}

							// callback
							putEpisodes(dataStream, episodes, undefined);
						}
					}
				});
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
		url: erairaws.anime,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];
				// get all anime as list
				let list = jqPage.find("#main > div.shows-wrapper > .ind-show > a");
				// map and filter list to results
				list.each(function () {
					results.push({
						title: $(this).text().trim(),
						href:  $(this).attr("href")
					});
				});
				results = results.filter(item => matchResult(item, title));
				// callback
				putResults(id, results);
			} else {
				// error
				errorResults(id, "Erai-raws: " + resp.status);
			}
		}
	});
}

/* subsplease */
/*******************************************************************************************************************************************************************/
const subsplease = {};
subsplease.base = "https://subsplease.org/";
subsplease.anime = subsplease.base + "shows/";
subsplease.api = subsplease.base + "api/?f=show&tz=" + Intl.DateTimeFormat().resolvedOptions().timeZone + "&sid=";

getEpisodes["subsplease"] = function(dataStream, url) {
	let ids = GM_getValue("subspleaseIDS", {});
	if (ids[url]) {
		// found id, request episodes
		subsplease_getEpisodesFromAPI(dataStream, ids[url]);
	} else {
		// id not found, request id then episodes
		GM_xmlhttpRequest({
			method: "GET",
			url: subsplease.anime + url,
			onload: function(resp) {
				if (resp.status == 200) {
					// OK
					let jqPage = $(resp.response);
					// get id
					let id = jqPage.find("#show-release-table").attr("sid");
					// save id in GM values
					ids[url] = id;
					GM_setValue("subspleaseIDS", ids);
					// get episodes
					subsplease_getEpisodesFromAPI(dataStream, id);
				} else {
					// error
					errorEpisodes(dataStream, "SubsPlease: " + resp.status);
				}
			}
		});
	}
}

function subsplease_getEpisodesFromAPI(dataStream, id) {
	GM_xmlhttpRequest({
		method: "GET",
		url: subsplease.api + id,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let res = JSON.parse(resp.response);
				let episodes = [];
				// loop through values
				Object.values(res.episode).forEach(ep => {
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
}

getEplistUrl["subsplease"] = function(partialUrl) {
	return subsplease.anime + partialUrl;
}

searchSite["subsplease"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: subsplease.anime,
		onload: function(resp) {
			if (resp.status == 200) {
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

/* mangadex */
/*******************************************************************************************************************************************************************/
const mangadex = {};
mangadex.base = "https://mangadex.org/";
mangadex.base_api = "https://api.mangadex.org/";
mangadex.manga = mangadex.base + "title/"
mangadex.lang_code = "en";
mangadex.manga_api = mangadex.base_api + `manga/{0}/feed?limit=500&order[chapter]=asc&offset={1}&translatedLanguage[]=${mangadex.lang_code}`;
mangadex.chapter = mangadex.base + "chapter/";
mangadex.search_api = mangadex.base_api + "manga?title=";

getEpisodes["mangadex"] = function(dataStream, url, offset=0, episodes=[]) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangadex.manga_api.formatUnicorn(url, offset),
		onload: function(resp) {
			if (resp.status == 200) {
				let res = JSON.parse(resp.response);
				if (res.result != "ok") {
					// error
					errorResults(id, "MangaDex: " + res.result);
				}
				// OK
				for (let i = 0; i < res.data.length; i++) {
					let chapter = res.data[i];
					let n = chapter.attributes.chapter;
					episodes[n - 1] = {
						text:      `Chapter ${n}: ${chapter.attributes.title}`,
						href:      mangadex.chapter + chapter.id,
						timestamp: new Date(chapter.attributes.createdAt).getTime(),
					}
				}
				// check if we got all the episodes
				if (offset + 500 >= res.total) {
					// estimate timeMillis
					let timeMillis = estimateTimeMillis(episodes, 5);
					// callback
					putEpisodes(dataStream, episodes, timeMillis);
				} else {
					// request next 500 episodes
					getEpisodes["mangadex"](dataStream, url, offset + 500, episodes);
				}
			} else {
				// error
				errorEpisodes(dataStream, "MangaDex: " + resp.status);
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
		url: mangadex.search_api + encodeURI(title),
		onload: function(resp) {
			if (resp.status == 200) {
				let res = JSON.parse(resp.response);
				if (res.result != "ok") {
					// error
					errorResults(id, "MangaDex: " + res.result);
				}
				// OK
				let results = [];
				for (let i = 0; i < res.data.length; i++) {
					let manga = res.data[i];
					results.push({
						title: manga.attributes.title.en || manga.attributes.title.jp,
						href:  manga.id,
					});
				}
				// callback
				putResults(id, results);
			} else {
				// error
				errorResults(id, "MangaDex: " + resp.status);
			}
		}
	});
}

/* manga plus */
/*******************************************************************************************************************************************************************/
const mangaplus = {}
mangaplus.base = "https://mangaplus.shueisha.co.jp/";
mangaplus.manga = mangaplus.base + "titles/";
mangaplus.base_api = "https://jumpg-webapi.tokyo-cdn.com/api/";
mangaplus.manga_api = mangaplus.base_api + "title_detail?title_id=";
mangaplus.chapter = mangaplus.base + "viewer/";
mangaplus.search = mangaplus.base_api + "title_list/all";
mangaplus.lang_table = {
	undefined: "english",
	0:         "english",
	1:         "spanish",
	2:         "french",
	3:         "indonesian",
	4:         "portuguese",
	5:         "russian",
	6:         "thai",
}

/* =============== *\
   protobuf config
\* =============== */
let Root = protobuf.Root;
let Type = protobuf.Type;
let Field = protobuf.Field;
let Enum = protobuf.Enum;
let OneOf = protobuf.OneOf;

let Response = new Type("Response")
	.add(new OneOf("data")
		.add(new Field("success", 1, "SuccessResult"))
		.add(new Field("error", 2, "ErrorResult"))
	);

let ErrorResult = new Type("ErrorResult")
	.add(new Field("action", 1, "Action"))
	.add(new Field("englishPopup", 2, "Popup"))
	.add(new Field("spanishPopup", 3, "Popup"));

let Action = new Enum("Action")
	.add("DEFAULT", 0)
	.add("UNAUTHORIZED", 1)
	.add("MAINTAINENCE", 2)
	.add("GEOIP_BLOCKING", 3);

let Popup = new Type("Popup")
	.add(new Field("subject", 1, "string"))
	.add(new Field("body", 2, "string"));

let SuccessResult = new Type("SuccessResult")
	.add(new Field("isFeaturedUpdated", 1, "bool"))
	.add(new OneOf("data")
		.add(new Field("allTitlesView", 5, "AllTitlesView"))
		.add(new Field("titleRankingView", 6, "TitleRankingView"))
		.add(new Field("titleDetailView", 8, "TitleDetailView"))
		.add(new Field("mangaViewer", 10, "MangaViewer"))
		.add(new Field("webHomeView", 11, "WebHomeView"))
	);

let TitleRankingView = new Type("TitleRankingView")
	.add(new Field("titles", 1, "Title", "repeated"));

let AllTitlesView = new Type("AllTitlesView")
	.add(new Field("titles", 1, "Title", "repeated"));

let WebHomeView = new Type("WebHomeView")
	.add(new Field("groups", 2, "UpdatedTitleGroup", "repeated"));

let TitleDetailView = new Type("TitleDetailView")
	.add(new Field("title", 1, "Title"))
	.add(new Field("titleImageUrl", 2, "string"))
	.add(new Field("overview", 3, "string"))
	.add(new Field("backgroundImageUrl", 4, "string"))
	.add(new Field("nextTimeStamp", 5, "uint32"))
	.add(new Field("updateTiming", 6, "UpdateTiming"))
	.add(new Field("viewingPeriodDescription", 7, "string"))
	.add(new Field("firstChapterList", 9, "Chapter", "repeated"))
	.add(new Field("lastChapterList", 10, "Chapter", "repeated"))
	.add(new Field("isSimulReleased", 14, "bool"))
	.add(new Field("chaptersDescending", 17, "bool"));

let UpdateTiming = new Enum("UpdateTiming")
	.add("NOT_REGULARLY", 0)
	.add("MONDAY", 1)
	.add("TUESDAY", 2)
	.add("WEDNESDAY", 3)
	.add("THURSDAY", 4)
	.add("FRIDAY", 5)
	.add("SATURDAY", 6)
	.add("SUNDAY", 7)
	.add("DAY", 8);

let MangaViewer = new Type("MangaViewer")
	.add(new Field("pages", 1, "Page", "repeated"));

let Title = new Type("Title")
	.add(new Field("titleId", 1, "uint32"))
	.add(new Field("name", 2, "string"))
	.add(new Field("author", 3, "string"))
	.add(new Field("portraitImageUrl", 4, "string"))
	.add(new Field("landscapeImageUrl", 5, "string"))
	.add(new Field("viewCount", 6, "uint32"))
	.add(new Field("language", 7, "Language", {"default": 0}));

let Language = new Enum("Language")
	.add("ENGLISH", 0)
	.add("SPANISH", 1);

let UpdatedTitleGroup = new Type("UpdatedTitleGroup")
	.add(new Field("groupName", 1, "string"))
	.add(new Field("titles", 2, "UpdatedTitle", "repeated"));

let UpdatedTitle = new Type("UpdatedTitle")
	.add(new Field("title", 1, "Title"))
	.add(new Field("chapterId", 2, "uint32"))
	.add(new Field("chapterName", 3, "string"))
	.add(new Field("chapterSubtitle", 4, "string"));

let Chapter = new Type("Chapter")
	.add(new Field("titleId", 1, "uint32"))
	.add(new Field("chapterId", 2, "uint32"))
	.add(new Field("name", 3, "string"))
	.add(new Field("subTitle", 4, "string", "optional"))
	.add(new Field("startTimeStamp", 6, "uint32"))
	.add(new Field("endTimeStamp", 7, "uint32"));

let Page = new Type("Page")
	.add(new Field("page", 1, "MangaPage"));

let MangaPage = new Type("MangaPage")
	.add(new Field("imageUrl", 1, "string"))
	.add(new Field("width", 2, "uint32"))
	.add(new Field("height", 3, "uint32"))
	.add(new Field("encryptionKey", 5, "string", "optional"));

let root = new Root()
	.define("mangaplus")
	.add(Response)
	.add(ErrorResult)
	.add(Action)
	.add(Popup)
	.add(SuccessResult)
	.add(TitleRankingView)
	.add(AllTitlesView)
	.add(WebHomeView)
	.add(TitleDetailView)
	.add(UpdateTiming)
	.add(MangaViewer)
	.add(Title)
	.add(Language)
	.add(UpdatedTitleGroup)
	.add(UpdatedTitle)
	.add(Chapter)
	.add(Page)
	.add(MangaPage);

/* =================== *\
   protobuf config end
\* =================== */

getEpisodes["mangaplus"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangaplus.manga_api + url,
		responseType: "arraybuffer",
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				// decode response
				let buf = resp.response;
				let message = Response.decode(new Uint8Array(buf));
				let respJSON = Response.toObject(message);
				// check if response is valid
				if (!respJSON || !respJSON.success || !respJSON.success.titleDetailView) {
					// error
					errorEpisodes(dataStream, "MANGA Plus: Bad Response");
					return;
				}

				let episodes = [];
				let titleDetailView = respJSON.success.titleDetailView;
				// insert episodes into list
				for (let i = 0; i < (titleDetailView.firstChapterList || []).length; i++) {
					let ch = titleDetailView.firstChapterList[i];
					let n = parseInt(ch.name.slice(1) - 1);
					episodes[n] = {
						text:      ch.subTitle,
						href:      mangaplus.chapter + ch.chapterId,
						timestamp: ch.startTimeStamp * 1000,
					};
				}
				for (let i = 0; i < (titleDetailView.lastChapterList || []).length; i++) {
					let ch = titleDetailView.lastChapterList[i];
					let n = parseInt(ch.name.slice(1) - 1);
					episodes[n] = {
						text:      ch.subTitle,
						href:      mangaplus.chapter + ch.chapterId,
						timestamp: ch.startTimeStamp * 1000,
					};
				}
				// get time of next episode
				let time = titleDetailView.nextTimeStamp * 1000;
				// callback
				putEpisodes(dataStream, episodes, time);
			} else {
				// error
				errorEpisodes(dataStream, "MANGA Plus: " + resp.status);
			}
		}
	});
}

getEplistUrl["mangaplus"] = function(partialUrl) {
	return mangaplus.manga + partialUrl;
}

searchSite["mangaplus"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangaplus.search,
		responseType: "arraybuffer",
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				// decode response
				let buf = resp.response;
				let message = Response.decode(new Uint8Array(buf));
				let respJSON = Response.toObject(message);
				// check if response is valid
				if (!respJSON || !respJSON.success || !respJSON.success.allTitlesView) {
					// error
					return;
				}

				let titles = respJSON.success.allTitlesView.titles;
				let list = [];
				// insert results into list
				for (let i = 0; i < titles.length; i++) {
					let lang = mangaplus.lang_table[titles[i].language];
					list.push({
						title: titles[i].name + " (" + lang + ")",
						href:  titles[i].titleId,
					});
				}
				// filter results
				let results = list.filter(item => matchResult(item, title));
				// callback
				putResults(id, results);
			} else {
				// error
				errorResults(id, "MANGA Plus: " + resp.status);
			}
		}
	});
}

/* MAL list */
/*******************************************************************************************************************************************************************/
const mal = {};
mal.timerRate = 15000;
mal.loadRows = 25;
mal.epStrLen = 14;
mal.genericErrorRequest = "Error while performing request";
mal.userId = null;
mal.CSRFToken = null;

let onScrollQueue = [];
let requestsQueues = {};

pageLoad["list"] = function() {
	// own list
	if ($(".header-menu.other").length !== 0) return;
	if ($(properties.watching).length !== 1) return;

	// add col header to table
	let colHeader = $(`<th class='header-title stream'>${properties.colHeaderText}</th>`);
	$("#list-container").find("th.header-title.title").after(colHeader);
	colHeader.css("min-width", "120px");

	// column header listener
	colHeader.on("click", function() {
		$(".data.stream").each(function() {
			// update dataStream without skipping queue
			updateList($(this), true, false);
		});
	});

	// set id and token for more-info requests
	mal.userId = $(document.body).attr("data-owner-id");
	mal.CSRFToken = $("meta[name=csrf_token]").attr("content");

	// load first n rows, start from 1 to remove header
	loadRows(1, mal.loadRows + 1);

	// update timer
	setInterval(function() {
		$(".data.stream").trigger("update-time");
	}, mal.timerRate);

	// check when an element comes into view
	$(window).scroll(function() {
		// get viewport
		let top = $(window).scrollTop();
		let bottom = top + $(window).height();
		// iterate scroll event queue
		let i = onScrollQueue.length;
		while (i--) {
			if (top < onScrollQueue[i].offset().top && bottom > onScrollQueue[i].offset().top) {
				onScrollQueue[i].trigger("intoView");
				// remove element
				onScrollQueue.splice(i, 1);
			}
		}
	});
}

// loads more-info and saves comment in dataStream
function loadRows(start, end) {
	// get rows
	let rows = $("#list-container > div.list-block > div > table > tbody").slice(start, end);
	if (rows.length == 0) {
		return;
	}

	// iterate over rows to add dataStream and request more-info
	// stop if a row is not valid (usually happens only during first iteration)
	for (let i = 0; i < rows.length; i++) {
		let row = $(rows[i]);
		// if href does not exist then row is invalid
		let href = row.find(".list-table-data > .data.title > .link").attr("href");
		if (!href) {
			// row was invalid, schedule retry and quit
			setTimeout(function() {
				loadRows(start, end);
			}, 100);
			return;
		}
		// add dataStream to row
		let dataStream = $("<td class='data stream' style='font-weight: normal; line-height: 1.5em;'></td>");
		row.find(".list-table-data > .data.title").after(dataStream);
		// get id to make request
		let id = href.split("/")[2];
		// finally request more info
		requestMoreInfo(id, dataStream);
	}

	let dataStreams = $(".data.stream");

	// table cell listener
	dataStreams.on("click", function(e) {
		// if ctrl is pressed also reload more-info
		if (e.ctrlKey) {
			requestMoreInfo(null, $(this));
		} else if (e.target.tagName != "A") {
			// avoid reloading if clicked on an anchor element
			updateList($(this), true, true);
		}
	});

	// complete one episode listener
	rows.find(properties.iconAdd).on("click", function() {
		let dataStream = $(this).parents(".list-item").find(".data.stream");
		// this timeout is needed, otherwise updateList could be called before the current episode number is updated
		setTimeout(function() {
			updateList(dataStream, false, false);
		}, 0);
	});

	// timer event
	dataStreams.on("update-time", function() {
		let dataStream = $(this);
		if (dataStream.find(".nextep, .loading, .error").length > 0) {
			// do nothing if timer is not needed
			return;
		}
		// get time object from dataStream
		let t = dataStream.data("timeMillis");
		// get next episode number
		let nextEp = parseInt(dataStream.parents(".list-item").find(properties.findProgress).find(".link").text()) + 1;
		if (isNaN(nextEp)) nextEp = 1;
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
		if (dataStream.find(".timer").length === 0) {
			// if timer doesn't exist create it
			dataStream.prepend("<div class='timer'>" + time + "<div>");
		} else {
			// update timer
			dataStream.find(".timer").html(time);
		}
	});

	// add last element to scroll event queue
	let last = rows.last();
	last.on("intoView", function() {
		loadRows(end, end + mal.loadRows);
	});
	onScrollQueue.push(last);
}

// request more-info and set data("comment")
function requestMoreInfo(id, dataStream) {
	// if id is not set, get it from dataStream
	if (!id) {
		id = dataStream.parents(".list-item").find(".data.title > .link").attr("href").split("/")[2];
	}
	// execute request
	GM_xmlhttpRequest({
		method: "POST",
		url: "https://myanimelist.net/includes/ajax-no-auth.inc.php?t=6",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"Cookie":       document.cookie,
		},
		data: jQuery.param({
			memId:      mal.userId,
			csrf_token: mal.CSRFToken,
			type:       properties.mode,
			id:         id,
		}),
		onload: function(resp) {
			let comment = null;
			if (resp.status == 200) {
				// OK
				try {
					let respJSON = JSON.parse(resp.response);
					let m = respJSON.html.match(properties.commentsRegex);
					comment = m[1];
				} catch (e) {
					// do nothing on error
				}
			}
			// set data
			dataStream.data("comment", comment);
			// remove old divs
			dataStream.find(".error").remove();
			dataStream.find(".eplist").remove();
			dataStream.find(".nextep").remove();
			dataStream.find(".loading").remove();
			dataStream.find(".timer").remove();
			dataStream.find(".favicon").remove();
			// check if comment exists and is correct
			if (comment) {
				// comment exists
				// url is an array that contains the streaming service and url relative to that service
				let url = getUrlFromComment(comment);
				if (url) {
					// add eplist
					let eplistUrl = getEplistUrl[url[0]](url[1]);
					dataStream.append("<a class='eplist' target='_blank' href='" + eplistUrl + "'>" + properties.ep + " list</a>");
					// add favicon
					let domain = getDomainById(url[0]);
					if (domain) {
						let src = "https://www.google.com/s2/favicons?domain=" + domain;
						dataStream.append("<img class='favicon' src='" + src + "' style='position: relative; top: 3px; padding-left: 4px'>");
					}
					// load links
					updateList(dataStream, true, true);
				} else {
					// comment invalid
					dataStream.append("<div class='error'>Invalid Link</div>");
				}
			} else {
				// comment doesn't extst
				dataStream.append("<div class='error'>No Link</div>");
			}
		}
	});
}

// updates dataStream cell
function updateList(dataStream, forceReload, skipQueue) {
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
	} else {
		// episode list doesn't exist or needs to be reloaded
		updateList_doesntExist(dataStream, skipQueue);
	}
}

function updateList_exists(dataStream) {
	// listitem
	let listitem = dataStream.parents(".list-item");
	// get current episode number
	let currEp = parseInt(listitem.find(properties.findProgress).find(".link").text());
	if (isNaN(currEp)) currEp = 0;
	// add offset to currEp
	currEp += parseInt(dataStream.data("offset"));
	// get episodes from data
	let episodes = dataStream.data("episodeList");
	// create new nextep
	let nextep = $("<div class='nextep'></div>");

	if (episodes.length > currEp) {
		// there are episodes available
		let isAiring = listitem.find(properties.findAiring).length !== 0;
		let t = episodes[currEp] ? episodes[currEp].text : ("Missing #" + (currEp + 1));

		let a = $("<a></a>");
		a.text(t.length > mal.epStrLen ? t.substr(0, mal.epStrLen - 1) + "…" : t);
		if (t.length > mal.epStrLen) a.attr("title", t);
		a.attr("href", episodes[currEp] ? episodes[currEp].href : "javascript:void(0)");
		if (episodes[currEp]) a.attr("target", "_blank");
		a.attr("class", isAiring ? "airing" : "non-airing");
		a.css("color", isAiring ? "#2db039" : "#ff730a");
		nextep.append(a);

		if (episodes.length - currEp > 1) {
			// if there is more than 1 new ep then put the amount in parenthesis
			nextep.append(" (" + (episodes.length - currEp) + ")");
		}
		// add new nextep
		dataStream.prepend(nextep);
	} else if (currEp > episodes.length && episodes.length > 0) {
		// user has watched too many episodes
		nextep.append($("<div class='ep-error'>" + properties.latest + episodes.length + "</div>").css("color", "red"));
		// add new nextep
		dataStream.prepend(nextep);
	} else {
		// there aren't episodes available, trigger timer
		dataStream.trigger("update-time");
	}
}

function queueGetEpisodes(dataStream, service, url) {
	// get queue for specified service or create it
	let queue = requestsQueues[service];
	if (!queue) {
		queue = [];
		queue.timers = 0;
		queue.maxRequests = (queueSettings[service] || queueSettings["default"]).maxRequests;
		queue.timeout = (queueSettings[service] || queueSettings["default"]).timeout;
		requestsQueues[service] = queue;
	}

	if (queue.timers < queue.maxRequests) {
		// if there are no active timers, set timer and do request
		queue.timers++
		getEpisodes[service](dataStream, url);
		setTimeout(function() {
			dequeueGetEpisodes(service);
		}, queue.timeout);
	} else {
		// queue full, append to end
		queue.push({
			dataStream: dataStream,
			url:        url,
		});
	}
}

function dequeueGetEpisodes(service) {
	let queue = requestsQueues[service];

	if (queue.length > 0) {
		// if there are elements in queue, request the first and restart the timer
		let req = queue.shift();
		getEpisodes[service](req.dataStream, req.url);
		setTimeout(function() {
			dequeueGetEpisodes(service);
		}, queue.timeout);
	} else {
		// queue empty, terminate timer
		queue.timers--;
	}
}

function updateList_doesntExist(dataStream, skipQueue) {
	// check if comment exists and is correct
	let comment = dataStream.data("comment");
	if (comment) {
		// comment exists
		// url is an array that contains the streaming service and url relative to that service
		let url = getUrlFromComment(comment);
		if (url) {
			// comment valid
			// add loading
			dataStream.prepend("<div class='loading'>Loading...</div>");
			// set offset data
			dataStream.data("offset", url[2] ? url[2] : 0);
			// queue getEpisode if needed
			if (!skipQueue) {
				queueGetEpisodes(dataStream, url[0], url[1]);
			} else {
				getEpisodes[url[0]](dataStream, url[1]);
			}
		} else {
			// comment invalid
			dataStream.append("<div class='error'>Invalid Link</div>");
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
	} else if (properties.mode == "anime") {
		// timeMillis doesn't exist, get time from anilist
		anilist_setTimeMillis(dataStream, true);
	}
	updateList(dataStream, false, false);
}

// set error to dataStream
function errorEpisodes(dataStream, error) {
	// remove old divs
	dataStream.find(".error").remove();
	dataStream.find(".nextep").remove();
	dataStream.find(".loading").remove();
	dataStream.find(".timer").remove();
	// create error div
	dataStream.prepend($(`<div class='error'>${error || mal.genericErrorRequest}</div>`).css("color", "red"));
}

/* MAL edit */
/*******************************************************************************************************************************************************************/
pageLoad["edit"] = function() {
	// get title
	let title = $("#main-form > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > strong > a")[0].text;
	// add titleBox with default title
	title = title.replace(/'/g, "&apos;");
	title = title.trim();
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

	// offset textarea
	let offsetBox = $("<input type='text' size='1' style='font-size: 11px; padding: 3px; margin-left: 8px;'>");
	let o = $(properties.editPageBox).val().split(" ")[2];
	if (o) offsetBox.val(o);
	// Set Offset button
	let a = $("<a>Set Offset</a>");
	a.attr("href", "#");
	a.on("click", function() {
		// get offset from offsetBox
		let o = parseInt(offsetBox.val());
		// replace or append to commentBox
		let val = $(properties.editPageBox).val().split(" ");
		if (!o || o == 0) {
			val[2] = undefined;
		} else {
			val[2] = o;
		}
		$(properties.editPageBox).val(val.join(" "));
		return false;
	});
	// offset div
	let offset = $("<div id='offset'>");
	offset.append(a, offsetBox);
	search.after(offset);
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

function errorResults(id, error) {
	let siteDiv = $("#search").find("." + id);
	// if div with current id cant be found then don't add error
	if (siteDiv.length !== 0) {
		siteDiv.find("#searching").remove();
		siteDiv.append(error || mal.genericErrorRequest);
	}
}

/* main */
/*******************************************************************************************************************************************************************/
// associates an url with properties and pageLoad function
let pages = [
	{ url: "https://myanimelist.net/animelist/",     prop: "anime", load: "list" },
	{ url: "https://myanimelist.net/mangalist/",     prop: "manga", load: "list" },
	{ url: "https://myanimelist.net/ownlist/anime/", prop: "anime", load: "edit" },
	{ url: "https://myanimelist.net/ownlist/manga/", prop: "manga", load: "edit" },
];

(function($) {
	// check on which page we are
	for (let i = 0; i < pages.length; i++) {
		if (window.location.href.indexOf(pages[i].url) != -1) {
			properties = properties[pages[i].prop];
			pageLoad[pages[i].load]();
			return;
		}
	}

	// check if we are on a load cookies page
	for (let i = 0; i < cookieServices.length; i++) {
		if (window.location.href.indexOf(cookieServices[i].url) != -1) {
			pageLoad["loadCookies"](cookieServices[i]);
			return;
		}
	}
})(jQuery);
