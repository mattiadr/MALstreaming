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
		if (GM_getValue("anichartLoading", false) + 30*1000 < Date.now()) {
			// set value then open anichart
			GM_setValue("anichartLoading", Date.now());
			GM_openInTab(anichartUrl, true);
		}
	}
}

// function to execute when script is run on anichart
pageLoad["anichart"] = function() {
	// get xsrf token from cookies
	let xsrf_tok = document.cookie.match(/(?<=XSRF-TOKEN=)\w+/)[0];
	// request data
	GM_xmlhttpRequest({
		method:  "GET",
		url:     "http://anichart.net/api/airing",
		headers: { "X-CSRF-TOKEN": xsrf_tok },
		onload:  function(resp) {
			// parse response
			let res = JSON.parse(resp.response);
			let times = {};
			// iterate over day of week
			for (let day in res) {
				if (res.hasOwnProperty(day)) {
					// iterate over array
					for (let i = 0; i < res[day].length; i++) {
						let entry = res[day][i];
						// get id from mal_link
						let id = entry.mal_link.match(/\d+$/)[0];
						let ep = entry.airing.next_episode;
						let timeMillis = entry.airing.time * 1000;
						// set time, ep is episode the timer is referring to
						times[id] = {
							ep: ep,
							timeMillis: timeMillis
						}
					}
				}
			}
			// put times in GM value
			GM_setValue("anichartTimes", times);
			// finished loading, close only if opened by script
			if (GM_getValue("anichartLoading", false)) {
				GM_setValue("anichartLoading", false);
				window.close();
			}
		}
	});
}

