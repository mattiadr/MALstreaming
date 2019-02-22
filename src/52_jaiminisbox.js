/* kissmanga */
/*******************************************************************************************************************************************************************/
const jbox = {};
jbox.base = "https://jaiminisbox.com/";
jbox.manga = jbox.base + "reader/series/";
jbox.search = jbox.base + "reader/search/";
// regex
jbox.dateRegex = /(\w+|[\d\.]+)(?= $)/;

getEpisodes["jaiminisbox"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: jbox.manga + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get chapter divs
				let divs = jqPage.find("#content > .panel > .list > .group > .element");

				divs.each(function() {
					// get title, href and chapter number
					let a = $(this).find(".title > a");
					let t = a.text();
					// chapter number - 1 is used as index
					let n = parseInt(t.match(/\d+/)[0]) - 1;
					// get date
					let date = $(this).find(".meta_r").text().match(jbox.dateRegex)[0];
					if (date == "Today" || date == "Yesterday") {
						let d = new Date();
						d.setHours(0);
						d.setMinutes(0);
						d.setSeconds(0);
						d.setMilliseconds(0);
						date = +d;
						// remove 24h if yesterday
						if (date == "Yesterday") date -= 24*60*60*1000;
					} else {
						date = Date.parse(date);
					}
					// add chapter to array
					episodes[n] = {
						text:      t,
						href:      a.attr("href"),
						timestamp: date,
					};
				});
				// estimate timeMillis
				let timeMillis = estimateTimeMillis(episodes, 5);
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
			}
		}
	});
}

getEplistUrl["jaiminisbox"] = function(partialUrl) {
	return jbox.manga + partialUrl;
}

searchSite["jaiminisbox"] = function(id, title) {
	GM_xmlhttpRequest({
		method:  "POST",
		url:     jbox.search,
		data:    "search=" + encodeURIComponent(title),
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];

				let as = jqPage.find("#content > .panel > .list > .group > .title > a");
				as.each(function() {
					results.push({
						title: this.text,
						href:  this.href.split("/")[5],
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

