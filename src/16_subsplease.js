/* subsplease */
/*******************************************************************************************************************************************************************/
const subsplease = {};
subsplease.base = "https://subsplease.org/";
subsplease.anime = subsplease.base + "shows/";
subsplease.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
subsplease.api = subsplease.base + "api/?f=show&tz=" + subsplease.timezone + "&sid=";
subsplease.schedule = subsplease.base + "api/?f=schedule&h=true&tz=" + subsplease.timezone

getEpisodes["subsplease"] = function(dataStream, url) {
	let ids = GM_getValue("subspleaseIDS", {});
	if (ids[url]) {
		// found id, request episodes
		subsplease_getEpisodesFromAPI(dataStream, ids[url], url);
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
					subsplease_getEpisodesFromAPI(dataStream, id, url);
				} else {
					// error
					errorEpisodes(dataStream, "SubsPlease: " + resp.status);
				}
			}
		});
	}
}

function subsplease_getEpisodesFromAPI(dataStream, id, url) {
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
					episodes[parseInt(ep.episode) - 1] = {
						text: `Ep ${ep.episode} (${dwn.res}p)`,
						href: dwn.magnet
					};
				});
				// callback
				putEpisodes(dataStream, episodes, undefined);
				subsplease_getAirTime(dataStream, url);
			} else {
				// error
				errorEpisodes(dataStream, "SubsPlease: " + resp.status);
			}
		}
	});
}

function subsplease_getAirTime(dataStream, url) {
	let date = GM_getValue("subspleaseScheduleDate", "0000-00-00");
	let today = new Date().toISOString().slice(0, 10);

	if (date < today) {
		// we request schedule and set the date immediately to avoid other dataStream requesting it too
		GM_setValue("subspleaseScheduleDate", today);
		// and we start the request for the schedule
		GM_xmlhttpRequest({
			method: "GET",
			url: subsplease.schedule,
			onload: function(resp) {
				let timeMillis = undefined;
				if (resp.status == 200) {
					// OK
					let res = JSON.parse(resp.response);
					let schedule = {};
					res.schedule.forEach(s => {
						let t = +new Date(today + " " + s.time);
						schedule[s.page] = t;
					});
					// set time
					let time = schedule[url];
					if (time) {
						putTimeMillis(dataStream, time, true);
					}
					// save schedule
					GM_setValue("subspleaseSchedule", schedule);
				} else {
					// error, remove date so we may retry the request
					GM_deleteValue("subspleaseScheduleDate");
				}
			}
		});
	} else {
		let schedule = GM_getValue("subspleaseSchedule", {});
		let time = schedule[url];
		if (time) {
			// time is valid, just callback
			putTimeMillis(dataStream, time, true);
		} else {
			// time is not available, can happen if we already sent a request from another dataStream and we are waiting for results
			// or if the time is actually not available (usually because it's the wrong day of week)
			// we set the listener in case we are waiting on another request
			let listenerId = GM_addValueChangeListener("subspleaseSchedule", function(name, old_value, new_value, remote) {
				let time = new_value[url];
				if (time) {
					putTimeMillis(dataStream, time, true);
				}
				// remove listener
				GM_removeValueChangeListener(listenerId);
			});
		}
	}
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

