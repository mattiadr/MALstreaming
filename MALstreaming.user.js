// ==UserScript==
// @name         MALstreaming
// @namespace    https://github.com/mattiadr/MALstreaming
// @version      5.37
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
// @match        http://kissanime.ru/
// @match        https://kissmanga.com/
// @match        https://www1.9anime.nl/
// @match        https://twist.moe/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
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
	{ id: "kissanime",   type: "anime", name: "Kissanime",     domain: "http://kissanime.ru/"      },
	{ id: "nineanime",   type: "anime", name: "9anime",        domain: "https://www1.9anime.to/"   },
	{ id: "animetwist",  type: "anime", name: "Anime Twist",   domain: "https://twist.moe/"        },
	// manga
	{ id: "kissmanga",   type: "manga", name: "Kissmanga",     domain: "https://kissmanga.com/"    },
	{ id: "mangadex",    type: "manga", name: "MangaDex",      domain: "https://mangadex.org/"     },
	{ id: "jaiminisbox", type: "manga", name: "Jaimini's Box", domain: "https://jaiminisbox.com/"  },
];
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

	// anime is not airing, exit
	if (listitem.find(properties.findAiring).length == 0) return;

	let times = GM_getValue("anilistTimes", false);
	// get anime id
	let id = listitem.find(".data.title > .link").attr("href").split("/")[2];
	let t = times ? times[id] : false;

	if (times && t && Date.now() < t.timeMillis) {
		// time doesn't need to update
		// set timeMillis, this is used to check if anilist timer is referring to next episode
		dataStream.data("timeMillis", t);
	} else {
		// add value change listener
		let listenerId = GM_addValueChangeListener("anilistTimes", function(name, old_value, new_value, remote) {
			// reload, avoid infinite loops
			if (canReload) anilist_setTimeMillis(dataStream, false);
			// remove listener
			GM_removeValueChangeListener(listenerId);
		});
		// api request to anilist
		requestTime(id);
	}
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
	if (GM_getValue("KAloadcookies", false) + 30*1000 < Date.now()) {
		GM_setValue("KAloadcookies", Date.now());
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
	if (GM_getValue("KAloadcookies", false) && document.title != "Just a moment...") {
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
nineanime.base = "https://www1.9anime.nl/";
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
					let ep = $(this).find(".status > .ep").text().match(/\/(\d+)/);
					results.push({
						title:    a.text,
						href:     a.href.split("/")[4],
						episodes: ep ? (ep[1] + " eps") : "1 ep"
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

/* animetwist */
/*******************************************************************************************************************************************************************/
const animetwist = {};
animetwist.base = "https://twist.moe/";
animetwist.anime = animetwist.base + "a/";
animetwist.anime_suffix = "/last";
animetwist.dataRegex = /<script>window\.__NUXT__=(.*(?=;<\/script>))/;

// loads animetwist cookies and then calls back
function animetwist_loadCookies(callback) {
	if (GM_getValue("ATloadcookies", false) + 30*1000 < Date.now()) {
		GM_setValue("ATloadcookies", Date.now());
		GM_openInTab(animetwist.base, true);
	}
	if (callback) {
		setTimeout(function() {
			callback();
		}, 1000);
	}
}

// function to execute when script is run on animetwist
pageLoad["animetwist"] = function() {
	if (GM_getValue("ATloadcookies", false)) {
		GM_setValue("ATloadcookies", false);
		window.close();
	}
}

getEpisodes["animetwist"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: animetwist.anime + url + animetwist.anime_suffix,
		onload: function(resp) {
			if (resp.status == 200) {
				// need to opend and close animetwist page to get last episode
				if (resp.finalUrl.indexOf(animetwist.anime_suffix) != -1) {
					animetwist_loadCookies(function() {
						getEpisodes["animetwist"](dataStream, url);
					});
					return;
				}

				// OK
				let episodes = [];
				// get last episode number
				let lastEp = parseInt(resp.finalUrl.match(/\d+$/));
				// insert all episodes until lastEp
				for (let i = 1; i <= lastEp; i++) {
					episodes.push({
						text: "Episode " + i,
						href: animetwist.anime + url + "/" + i,
					});
				}
				// callback
				putEpisodes(dataStream, episodes, undefined);
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
		url: animetwist.base,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list;
				try {
					list = JSON.parse(resp.response.match(animetwist.dataRegex)[1]).state.anime.all;
				} catch (e) {
					// error parsing JSON
				}
				let results = [];
				// turn title into regex to filter results
				let titleRegex = new RegExp(title.replace(/\W+/, ".*"), "");

				if (list) {
					for (let i = 0; i < list.length; i++) {
						let r = list[i];
						// filter only matching titles
						if (titleRegex.test(r.title)) {
							results.push({
								title: r.title,
								href:  r.slug.slug,
							})
						}
					}
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
kissmanga.base = "https://kissmanga.com/";
kissmanga.manga = kissmanga.base + "Manga/";
kissmanga.search = kissmanga.base + "Search/SearchSuggest";
// regex
kissmanga.regexVol = /vol.+?\d+/i;

// loads kissmanga cookies and then calls back
function kissmanga_loadCookies(callback) {
	if (GM_getValue("KMloadcookies", false) + 30*1000 < Date.now()) {
		GM_setValue("KMloadcookies", Date.now());
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
	if (GM_getValue("KMloadcookies", false) && document.title != "Just a moment...") {
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
					};
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
						href:  this.pathname.split("/")[2],
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
							text:      (ch.volume && `Vol. ${ch.volume} `) + `Ch. ${ch.chapter}`,
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

/* kissmanga */
/*******************************************************************************************************************************************************************/
const jbox = {};
jbox.base = "https://jaiminisbox.com/";
jbox.manga = jbox.base + "reader/series/";
jbox.search = jbox.base + "reader/search/";
// regex
jbox.dateRegex = /(\w+|[\d\.]+)(?= $)/;

getEpisodes["jaiminisbox"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: jbox.manga + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get chapter divs
				let divs = jqPage.find("#content > .panel > .list > .group > .element");

				divs.each(function() {
					// get title, href and chapter number
					let a = $(this).find(".title > a");
					let t = a.text();
					// chapter number - 1 is used as index
					let n = parseInt(t.match(/\d+/)[0]) - 1;
					// get date
					let date = $(this).find(".meta_r").text().match(jbox.dateRegex)[0];
					if (date == "Today" || date == "Yesterday") {
						let d = new Date();
						d.setHours(0);
						d.setMinutes(0);
						d.setSeconds(0);
						d.setMilliseconds(0);
						date = +d;
						// remove 24h if yesterday
						if (date == "Yesterday") date -= 24*60*60*1000;
					} else {
						date = Date.parse(date);
					}
					// add chapter to array
					episodes[n] = {
						text:      t,
						href:      a.attr("href"),
						timestamp: date,
					};
				});
				// estimate timeMillis
				let timeMillis = estimateTimeMillis(episodes, 5);
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
			}
		}
	});
}

getEplistUrl["jaiminisbox"] = function(partialUrl) {
	return jbox.manga + partialUrl;
}

searchSite["jaiminisbox"] = function(id, title) {
	GM_xmlhttpRequest({
		method:  "POST",
		url:     jbox.search,
		data:    "search=" + encodeURIComponent(title),
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];

				let as = jqPage.find("#content > .panel > .list > .group > .title > a");
				as.each(function() {
					results.push({
						title: this.text,
						href:  this.href.split("/")[5],
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

	// add col header to table
	$("#list-container").find("th.header-title.title").after(properties.colHeader);
	$(".header-title.stream").css("min-width", "120px");

	// column header listener
	$(".header-title.stream").on("click", function() {
		$(".data.stream").trigger("click");
	});

	// load first 25 rows, start from 1 to remove header
	loadRows(1, 26);

	// update timer
	setInterval(function() {
		$(".data.stream").trigger("update-time");
	}, 15000);

	// check when an element comes into view
	$(window).scroll(function() {
		// get viewport
		let top = $(window).scrollTop();
		let bottom = top + $(window).height();
		// iterate scroll event queue
		let i = onScrollQ.length;
		while (i--) {
			if (top < onScrollQ[i].offset().top && bottom > onScrollQ[i].offset().top) {
				onScrollQ[i].trigger("intoView");
				// remove element
				onScrollQ.splice(i, 1);
			}
		}
	});
}

// force hide more-info
const hideInfoSheet = document.createElement("style");
hideInfoSheet.innerHTML =`
	.list-table .more-info {
		display: none!important;
	}
`;

let onScrollQ = [];

// loads more-info and saves comment in dataStream
function loadRows(start, end) {
	// get rows
	let rows = $(`#list-container > div.list-block > div > table > tbody`).slice(start, end);
	if (rows.length == 0) {
		return;
	}

	// pre-hide more-info
	document.body.appendChild(hideInfoSheet);

	// expand more-info
	rows.find(".more > a").each(function() {
		this.click();
	});

	// add cells to column
	rows.find(".list-table-data > .data.title").after("<td class='data stream'></td>");

	let dataStreams = rows.find(".data.stream");

	// style dataStreams
	dataStreams.css("font-weight", "normal");
	dataStreams.css("line-height", "1.5em");

	// wait
	let interval = setInterval(function() {
		let done = true;
		// put comment into data("comment")
		rows.each(function() {
			let td = $(this).find(".td1.borderRBL");
			// if not loaded yet then check later
			if (td.length == 0) {
				done = false;
				return
			}
			let comment = td.html().match(properties.commentsRegex);
			if (comment) {
				// revome the first 10 characters to remove "Comments: " since js doesn't support lookbehinds
				comment = comment.toString().substring(10);
			} else {
				comment = null;
			}

			$(this).find(".data.stream").data("comment", comment);
		});

		if (done) {
			// collapse more-info
			rows.find(".more-info").css("display", "none");
			// remove sheet
			document.body.removeChild(hideInfoSheet);
			// load links
			$(".header-title.stream").trigger("click");
			// stop interval
			clearInterval(interval);
		}
	}, 100);

	// table cell listener
	dataStreams.on("click", function() {
		updateList($(this), true, true);
	});

	// complete one episode listener
	rows.find(properties.iconAdd).on("click", function() {
		let dataStream = $(this).parents(".list-item").find(".data.stream");
		updateList(dataStream, false, true);
	});

	// timer event
	dataStreams.on("update-time", function() {
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

	// add last element to scroll event queue
	let last = rows.last();
	last.on("intoView", function() {
		loadRows(end, end + 25);
	});
	onScrollQ.push(last);
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
			// set offset data
			dataStream.data("offset", url[2] ? url[2] : 0);
			// executes getEpisodes relative to url[0] passing dataStream and url[1]
			getEpisodes[url[0]](dataStream, url[1]);
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

/* main */
/*******************************************************************************************************************************************************************/
// associates an url with properties and pageLoad function
let pages = [
	{ url: kissanime.base,                           prop: null,    load: "kissanime"  },
	{ url: kissmanga.base,                           prop: null,    load: "kissmanga"  },
	{ url: nineanime.base,                           prop: null,    load: "nineanime"  },
	{ url: animetwist.base,                          prop: null,    load: "animetwist" },
	{ url: "https://myanimelist.net/animelist/",     prop: "anime", load: "list"       },
	{ url: "https://myanimelist.net/mangalist/",     prop: "manga", load: "list"       },
	{ url: "https://myanimelist.net/ownlist/anime/", prop: "anime", load: "edit"       },
	{ url: "https://myanimelist.net/ownlist/manga/", prop: "manga", load: "edit"       },
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
