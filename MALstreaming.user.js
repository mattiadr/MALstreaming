// ==UserScript==
// @name         MALstreaming
// @namespace    https://github.com/mattiadr/MALstreaming
// @version      4.1
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
// @match        http://kissanime.ru/
// @match        https://myanimelist.net/mangalist/*
// @match        https://myanimelist.net/ownlist/manga/*/edit*
// @match        https://myanimelist.net/ownlist/manga/add?selected_series_id=*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
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
	  timeMillis can optionally be the time left until the next episode in milliseconds
	- create a new function in search that will accept id and title
	  the function needs to callback to putResults(id, results, manualSearch)
	  results needs to be an array of object with title (display title), href (the url that will be put in the comments), fullhref (full url of page) attributes
	  and epsiodes (optional number of episodes)
	  manualSearch needs to be an url to visit if search yields no results
	- if other utility is needed, add it in the service section and if you need to run a script on specific pages add another object to the pages array
*/

/* generic */
/*******************************************************************************************************************************************************************/
// contains properties related to MAL
let malProperties = {};
malProperties["anime"] = {};
malProperties["manga"] = {};
malProperties["anime"].mode = "anime";
malProperties["manga"].mode = "manga";
malProperties["anime"].watching = ".list-unit.watching";
malProperties["manga"].watching = ".list-unit.reading";
malProperties["anime"].colHeader = "<th class='header-title stream'>Watch</th>";
malProperties["manga"].colHeader = "<th class='header-title stream'>Read</th>";
malProperties["anime"].commentsRegex = /Comments: ([\S ]+)(?=&nbsp;)/g;
malProperties["manga"].commentsRegex = /Comments: ([\S ]+)(?=\n)/g;
malProperties["anime"].findAiring = "span.content-status:contains('Airing')";
malProperties["manga"].findAiring = "span.content-status:contains('Publishing')";
malProperties["anime"].editPageBox = "#add_anime_comments";
malProperties["manga"].editPageBox = "#add_manga_comments";
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
	{ id: "kissanime", anime: true, maga: false, name: "Kissanime" },
	{ id: "nineanime", anime: true, maga: false, name: "9anime"    }
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
				// filter and add to episodes array
				as.each(function(i, e) {
					// title must match regexWhitelist, must not match regexBlacklist and href must not be in epsBlacklist to be considered a valid episode
					if (kissanime.regexWhitelist.test(e.text) && !kissanime.regexBlacklist.test(e.text) && kissanime.epsBlacklist.indexOf(e.href) == -1) {
						// get tite to split episode name and leave only "Episode xx"
						let title = jqPage.find("#leftside > div:nth-child(1) > div.barContent > div:nth-child(2) > a").text();
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
				kissanime_loadCookies(search["kissanime"], title);
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
				putResults(id, results, kissanime.base);
			}
		}
	});
}

/* 9anime */
/*******************************************************************************************************************************************************************/
const nineanime = {};
nineanime.base = "https://www5.9anime.is/";
nineanime.anime = nineanime.base + "watch/";
nineanime.search = nineanime.base + "search?keyword=";
nineanime.server = "33"; // RapidVideo = 33, MyCloud = 28, Streamango = 34, OpenLoad = 24

getEpisodes["nineanime"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: nineanime.anime + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get servers
				let servers = jqPage.find("#main > div > div.widget.servers > div.widget-body > .server");
				let server = null;
				// if possibe use specified server
				servers.each(function() {
					if ($(this).attr("data-name") == nineanime.server) {
						server = $(this);
					}
				});
				// else use first one
				if (!server) {
					server = servers.first();
				}
				// get anchors
				let as = server.find("li > a");
				as.each(function() {
					episodes.push({
						text: "Episode " + $(this).text().replace(/^0+(?=\d+)/, ""),
						href: nineanime.base + $(this).attr("href").substr(1)
					});
				});
				// get time if available
				let time = jqPage.find("#main > div > div.alert.alert-primary > i");
				let timeMillis;
				if (time.length !== 0) {
					// timer is present
					timeMillis = time.data("to") * 1000 - Date.now();
				} else {
					// timer is not present, estimating based on latest episode
					let timeStr = as.last().data("title").replace("-", "");
					timeMillis = Date.parse(timeStr) + 1000 * 60 * 60 * 24 * 7 - Date.now();
				}
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
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
				putResults(id, results, nineanime.base);
			}
		}
	});
}

/* MAL animelist */
/*******************************************************************************************************************************************************************/
pageLoad["list"] = function() {
	// own list
	if ($(".header-menu.other").length !== 0) return;
	if ($(malProperties.watching).length !== 1) return;

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
	$("#list-container").find("th.header-title.title").after(malProperties.colHeader);
	$(".list-item").each(function() {
		$(this).find(".data.title").after("<td class='data stream'></td>");
	});

	// style
	$(".data.stream").css("font-weight", "normal");
	$(".data.stream").css("line-height", "1.5em");
	$(".header-title.stream").css("min-width", "90px");

	// wait
	setTimeout(function() {
		// collapse more-info
		$(".more-info").css("display", "none");
		// remove sheet
		document.body.removeChild(styleSheet);

		// put comment into data("comment")
		$(".list-item").each(function() {
			let comment = $(this).find(".td1.borderRBL").html().match(malProperties.commentsRegex);
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
	$(".icon-add-episode").on("click", function() {
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
	if (episodeList && episodeList.length > 0 && !forceReload) {
		// episode list exists
		updateList_exists(dataStream);
	} else if (canReload) {
		// episode list doesn't exist or needs to be reloaded
		updateList_doesntExist(dataStream);
	} else {
		// broken link
		dataStream.prepend("<div class='error' color='red'>Broken link</div><br>");
	}
}

function updateList_exists(dataStream) {
	// listitem
	let listitem = dataStream.parents(".list-item");
	// get current episode number
	let currEp = parseInt(listitem.find(".data.progress").find(".link").text());
	if (isNaN(currEp)) currEp = 0;
	// get episodes from data
	let episodes = dataStream.data("episodeList");
	// create new nextep
	let nextep = $("<div class='nextep'></div>");
	// add new nextep
	dataStream.prepend(nextep);

	if (episodes.length > currEp) {
		// there are episodes available
		let isAiring = listitem.find(malProperties.findAiring).length !== 0;
		let t = episodes[currEp].text;

		let a = $("<a></a>");
		a.text(t.length > 13 ? t.substr(0, 12) + "&hellip;" : t);
		if (t.length > 13) a.attr("title", t);
		a.attr("href", episodes[currEp].href);
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
		nextep.append($("<div class='.epcount-error'>Ep. count Error</div>").css("color", "red"));
	} else {
		// there aren't episodes available, displaying timer
		// add update-time event
		dataStream.on("update-time", function() {
			// get time from data
			let timeMillis = dataStream.data("timeMillis");
			let time;
			if (!timeMillis || isNaN(timeMillis) || timeMillis < 1000) {
				time = "Not Yet Aired";
			} else {
				const d = Math.floor(timeMillis / (1000 * 60 * 60 * 24));
				const h = Math.floor((timeMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				const m = Math.floor((timeMillis % (1000 * 60 * 60)) / (1000 * 60));
				time = (h < 10 ? "0"+h : h) + "h:" + (m < 10 ? "0" + m : m) + "m";
				if (d > 0) {
					time = d + (d == 1 ? " day " : " days ") + time;
				}
				// subtract time
				dataStream.data("timeMillis", timeMillis - 1000);
				// if 0 is reached, stop it
				if (timeMillis < 1000) {
					dataStream.removeData("timeMillis");
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
				dataStream.append("<a class='eplist' target='_blank' href='" + eplistUrl + "'>Ep. list</a>");
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
	dataStream.data("episodeList", episodes);
	dataStream.data("timeMillis", timeMillis);
	updateList(dataStream, false, false);
}

/* MAL edit anime */
/*******************************************************************************************************************************************************************/
pageLoad["edit"] = function() {
	// get title
	const title = $("#main-form > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > strong > a")[0].text;
	// add #search div
	let search = $("<div id='search'><b style='font-size: 110%; line-height: 180%;'>Search: </b></div>");
	$(malProperties.editPageBox).after(search);
	// add streamingServices
	for (let i = 0 ; i < streamingServices.length; i++) {
		let ss = streamingServices[i];
		if (!ss[malProperties.mode]) continue;
		if (i !== 0) search.append(", ");
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
			searchSite[ss.id](ss.id, title);
			// return
			return false;
		});
		search.append(a);
	}
	search.append("<br>");
}

function putResults(id, results, manualSearch) {
	let siteDiv = $("#search").find("." + id);
	// if div with current id cant be found then don't add results
	if (siteDiv.length !== 0) {
		siteDiv.find("#searching").remove();

		if (results.length === 0) {
			siteDiv.append("No Results. <a target='_blank' href='" + manualSearch + "'>Manual Search</a></div>");
			return;
		}
		// add results
		for (let i = 0; i < results.length; i++) {
			let r = results[i];
			let a = $("<a href='#'>Select</a>");
			a.on("click", function() {
				$(malProperties.editPageBox).val(id + " " + r.href);
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
// associates an url with malProperties and pageLoad function
let pages = [
	{ url: kissanime.base,                            prop: null,    load: "kissanime" },
	{ url: "https://myanimelist.net/animelist/",      prop: "anime", load: "list"      },
	{ url: "https://myanimelist.net/mangalist/",      prop: "manga", load: "list"      },
	{ url: "https://myanimelist.net/ownlist/anime/",  prop: "anime", load: "edit"      },
	{ url: "https://myanimelist.net/ownlist/manga/",  prop: "manga", load: "edit"      }
];

(function($) {
	for (let i = 0; i < pages.length; i++) {
		if (window.location.href.indexOf(pages[i].url) != -1) {
			malProperties = malProperties[pages[i].prop];
			pageLoad[pages[i].load]();
			break;
		}
	}
})(jQuery);