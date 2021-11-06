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

