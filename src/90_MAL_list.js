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
	if (episodeList && episodeList.length > 0 && !forceReload) {
		// episode list exists
		updateList_exists(dataStream);
	} else if (canReload) {
		// episode list doesn't exist or needs to be reloaded
		updateList_doesntExist(dataStream);
	} else {
		// broken link
		dataStream.prepend($("<div class='error'>No Episodes<br></div>").css("color", "red"));
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
			// get time from data
			let timeMillis = dataStream.data("timeMillis");
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
	dataStream.data("episodeList", episodes);
	dataStream.data("timeMillis", timeMillis);
	updateList(dataStream, false, false);
}

