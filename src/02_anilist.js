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
		putTimeMillis(dataStream, t.timeMillis, false, t.ep);
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

