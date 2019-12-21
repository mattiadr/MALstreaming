/* MAL list */
/*******************************************************************************************************************************************************************/
const mal = {};
mal.timerRate = 15000;
mal.loadRows = 25;
mal.maxRequests = 15;

pageLoad["list"] = function() {
	// own list
	if ($(".header-menu.other").length !== 0) return;
	if ($(properties.watching).length !== 1) return;

	// add col header to table
	$("#list-container").find("th.header-title.title").after(properties.colHeader);
	$(".header-title.stream").css("min-width", "120px");

	// doesn't work without the delay for some reason
	setTimeout(function() {
		// column header listener
		$(".header-title.stream").on("click", function() {
			// number of requests sent for streaming service
			let triggered = {};
			$(".data.stream").each(function() {
				// get streaming service name
				let comment = $(this).data("comment")
				if (!comment) {
					// if no comment update
					$(this).click();
					return;
				}
				let url = getUrlFromComment(comment);
				if (!url) {
					// if url is invalid update
					$(this).click();
					return;
				}
				let name = url[0];
				// stop if reached max number of requests
				triggered[name] = (triggered[name] || 0) + 1;
				if (triggered[name] > mal.maxRequests) return;
				// update cell
				$(this).click();
			});
		});

		// load first 25 rows, start from 1 to remove header
		loadRows(1, mal.loadRows + 1);
	}, 10);

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

// force hide more-info
const hideInfoSheet = document.createElement("style");
hideInfoSheet.innerHTML =`
	.list-table .more-info {
		display: none!important;
	}
`;

let onScrollQueue = [];

// loads more-info and saves comment in dataStream
function loadRows(start, end) {
	// get rows
	let rows = $("#list-container > div.list-block > div > table > tbody").slice(start, end);
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
				// match the first capturing group
				comment = comment[1];
			} else {
				comment = null;
			}

			let dataStream = $(this).find(".data.stream");
			dataStream.data("comment", comment);

			// check if need to add eplist
			if (dataStream.find(".eplist").length !== 0) return;
			if (!comment) return;
			let url = getUrlFromComment(comment);
			if (!url) return;
			// add click to update message
			dataStream.prepend("<div class='error'><b>Click to update</b></div>");
			// add eplist
			let eplistUrl = getEplistUrl[url[0]](url[1]);
			dataStream.append("<a class='eplist' target='_blank' href='" + eplistUrl + "'>" + properties.ep + " list</a>");
			// add favicon
			let domain = getDomainById(url[0]);
			if (domain) {
				let src = "https://www.google.com/s2/favicons?domain=" + domain;
				dataStream.append("<img class='favicon' src='" + src + "' style='position: relative; top: 3px; padding-left: 4px'>");
			}
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
		if (dataStream.find(".nextep, .loading, .error").length > 0) {
			// do nothing if timer is not needed
			return;
		}
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

