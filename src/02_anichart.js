/* anichart */
/*******************************************************************************************************************************************************************/
const anichartUrl = "http://anichart.net/airing";

// puts timeMillis into dataStream, then calls back
function anichart_setTimeMillis(dataStream, callback, canReload) {
	let times = GM_getValue("anichartTimes", false);
	// get anime id
	let id = dataStream.parents(".list-item").find(".data.title > .link").attr("href").split("/")[2];
	// get next episode
	let nextEp = parseInt(dataStream.parents(".list-item").find(properties.findProgress).find(".link").text()) + 1;
	let t = times ? times[id] : false;

	if (times && (!t || Date.now() < t.timeMillis)) {
		// time doesn't need to update
		// set timeMillis, this is used to check if anichart timer is referring to next episode
		dataStream.data("timeMillis", (t && t.ep == nextEp) ? t.timeMillis : undefined);
		// callback
		callback();
	} else if (!GM_getValue("anichartLoading", false)) {
		// load times from anichart
		// add value change listener
		let listenerId = GM_addValueChangeListener("anichartTimes", function(name, old_value, new_value, remote) {
			// set anichart.times
			times = new_value;
			// call back
			if (canReload){
				anichart_setTimeMillis(dataStream, callback, false);
			}
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
			if (canReload) {
				anichart_setTimeMillis(dataStream, callback, false);
			}
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
				let ep = $(e).find(".airing > span:first-child").text().match(/\d+/)[0];
				// get time array days, hours, mins
				let time = $(e).find("timer").text().match(/\d+/g);
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

