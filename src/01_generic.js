/* generic */
/*******************************************************************************************************************************************************************/
// array of all streaming services
const streamingServices = [
	// anime
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
	commentsRegex: /Notes: ([\S ]+)&nbsp;/,
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

