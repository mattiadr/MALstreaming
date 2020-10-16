/* erai-raws */
/*******************************************************************************************************************************************************************/
const erairaws = {};
erairaws.base = "https://www.erai-raws.info/";
erairaws.anime = erairaws.base + "anime-list/";
erairaws.api = erairaws.base + "wp-admin/admin-ajax.php";
erairaws.regexEpisode = /A|F/i;

getEpisodes["erairaws"] = function(dataStream, url) {
	// prepare data
	let query = {
		"anime-list": url,
		"nopaging": true
	};
	let data = "action=load_more_0&query=" + encodeURI(JSON.stringify(query));

	// request
	GM_xmlhttpRequest({
		method: "POST",
		url: erairaws.api,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		data: data,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];

				jqPage.find(".post-inner").each(function() {
					// get episode number
					let title = $(this).find("div:first-child > h1 > font > a:last-child > font").text();
					let ep = parseInt(title.match(/\d+/)[0]);
					// get max resolution magnet
					let div = $(this).find("div:nth-child(3) > div:nth-child(2) > div");
					let res = div.find("i:first-child").text().slice(1, -1);
					let magnet = div.find(":last-child > :first-child").attr("href");
					// put episode into array
					episodes[ep - 1] = {
						text: "Ep " + ep + " (" + res + ")",
						href: magnet
					};
				});

				// callback
				putEpisodes(dataStream, episodes, undefined);

				// get batch episodes if any
				GM_xmlhttpRequest({
					method: "GET",
					url: erairaws.anime + url,
					onload: function(resp) {
						if (resp.status == 200) {
							// OK
							let jqPage = $(resp.response);
							// get first batch post and stop if no batch is available
							let postInner = jqPage.find(".show-batch > article:first-child > .post-inner");
							if (postInner.length <= 0) return;
							// get batch title
							let title = postInner.find("div:first-child > h1 > a:nth-child(3) > font > font > font").text();
							// get max resolution magnet
							let div = postInner.find("div:nth-child(3) > div:nth-child(2) > div");
							let magnet = div.find(":last-child > :first-child").attr("href");
							// get first and last episodes of batch
							let m = title.match(/(\d+)\D+(\d+)/);
							let first = parseInt(m[1]);
							let last = parseInt(m[2]);

							// add missing episodes
							let obj = {
								text: "Batch " + first + " ~ " + last,
								href: magnet
							};
							for (let i = first - 1; i < last; i++) {
								if (!episodes[i]) {
									episodes[i] = obj;
								}
							}

							// callback
							putEpisodes(dataStream, episodes, undefined);
						}
					}
				});
			} else {
				// error
				errorEpisodes(dataStream, "Erai-raws: " + resp.status);
			}
		}
	});
}

getEplistUrl["erairaws"] = function(partialUrl) {
	return erairaws.anime + partialUrl;
}

searchSite["erairaws"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: erairaws.anime,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];
				// get all anime as list
				let list = jqPage.find("#main > div.shows-wrapper > .ind-show > a");
				// map and filter list to results
				list.each(function () {
					results.push({
						title: $(this).text().trim(),
						href:  $(this).attr("href")
					});
				});
				results = results.filter(item => matchResult(item, title));
				// callback
				putResults(id, results);
			} else {
				// error
				errorResults(id, "Erai-raws: " + resp.status);
			}
		}
	});
}

