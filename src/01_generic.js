/*
	HOW TO ADD A NEW STREAMING SERVICE:
	- add a new object to the streamingServices array with attributes id (unique id, must be a valid identifier) and name (display name)
	- create a new function in getEplistUrl that will simply return the full url from the partial url (saved in comments)
	- create a new function in getEpisodes that will accept dataStream and url,
	  the function needs to callback to putEpisodes(dataStream, episodes, timeMillis)
	  url is the url of the episode list provoded by getEplistUrl
	  episodes needs to be an array of object with text and href attributes
	  timeMillis can optionally be the unix timestamp of the next episode
	- create a new function in search that will accept id and title
	  the function needs to callback to putResults(id, results)
	  results needs to be an array of object with title (display title), href (the url that will be put in the comments) attributes
	  and epsiodes (optional number of episodes)
	- if other utility is needed, add it in the service section and if you need to run a script on specific pages add another object to the pages array
*/

/* generic */
/*******************************************************************************************************************************************************************/
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
// is an array of valid streaming services names
const streamingServices = [
	// anime
	{ id: "kissanime", type: "anime", name: "Kissanime",    domain: "http://kissanime.ru/"      },
	{ id: "nineanime", type: "anime", name: "9anime",       domain: "https://www1.9anime.to/"   },
	{ id: "masterani", type: "anime", name: "Masterani.me", domain: "https://www.masterani.me/" },
	// manga
	{ id: "kissmanga", type: "manga", name: "Kissmanga",    domain: "https://kissmanga.com/"    },
	{ id: "mangadex",  type: "manga", name: "MangaDex",     domain: "https://mangadex.org/"     },
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

