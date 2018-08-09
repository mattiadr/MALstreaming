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
	  results needs to be an array of object with title (display title), href (the url that will be put in the comments), fullhref (full url of page) attributes
	  and epsiodes (optional number of episodes)
	- if other utility is needed, add it in the service section and if you need to run a script on specific pages add another object to the pages array
*/

/* generic */
/*******************************************************************************************************************************************************************/
// contains variable properties for anime/manga modes
let properties = {};
properties["anime"] = {};
properties["manga"] = {};
properties["anime"].mode = "anime";
properties["manga"].mode = "manga";
properties["anime"].watching = ".list-unit.watching";
properties["manga"].watching = ".list-unit.reading";
properties["anime"].colHeader = "<th class='header-title stream'>Watch</th>";
properties["manga"].colHeader = "<th class='header-title stream'>Read</th>";
properties["anime"].commentsRegex = /Comments: ([\S ]+)(?=&nbsp;)/g;
properties["manga"].commentsRegex = /Comments: ([\S ]+)(?=\n)/g;
properties["anime"].iconAdd = ".icon-add-episode";
properties["manga"].iconAdd = ".icon-add-chapter";
properties["anime"].findProgress = ".data.progress";
properties["manga"].findProgress = ".data.chapter";
properties["anime"].findAiring = "span.content-status:contains('Airing')";
properties["manga"].findAiring = "span.content-status:contains('Publishing')";
properties["anime"].latest = "Latest ep is #";
properties["manga"].latest = "Latest ch is #";
properties["anime"].notAired = "Not Yet Aired";
properties["manga"].notAired = "Not Yet Published";
properties["anime"].ep = "Ep.";
properties["manga"].ep = "Ch.";
properties["anime"].editPageBox = "#add_anime_comments";
properties["manga"].editPageBox = "#add_manga_comments";
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
	{ id: "nineanime", type: "anime", name: "9anime"    },
	{ id: "kissanime", type: "anime", name: "Kissanime" },
	// manga
	{ id: "kissmanga", type: "manga", name: "Kissmanga" },
	{ id: "mangadex",  type: "manga", name: "MangaDex"  },
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
		if (prev && episodes[i].date != prev) {
			let diff = Date.parse(prev) - Date.parse(episodes[i].date);
			if (!min || diff < min && diff > 0) min = diff;
		}
		prev = episodes[i].date;
	}
	return Date.parse(episodes[episodes.length - 1].date) + min;
}

