/* MAL edit */
/*******************************************************************************************************************************************************************/
pageLoad["edit"] = function() {
	// get title
	let title = $("#main-form > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > strong > a")[0].text;
	// add titleBox with default title
	title = title.replace(/'/g, "&apos;");
	let titleBox = $("<input type='text' value='" + title + "' size='36' style='font-size: 11px; padding: 3px;'>");
	// add #search div
	let search = $("<div id='search'><b style='font-size: 110%; line-height: 180%;'>Search: </b></div>");
	$(properties.editPageBox).after("<br>", titleBox, "<br>", search);
	// add streamingServices
	let first = true;
	streamingServices.forEach(function(ss) {
		if (ss.type != properties.mode) return;
		// don't append ", " before first ss
		if (first) {
			first = false;
		} else {
			search.append(", ");
		}
		// new anchor
		let a = $("<a></a>");
		a.text(ss.name);
		a.attr("href", "#");
		// on anchor click
		a.on("click", function() {
			// remove old results
			search.find(".site").remove();
			// add new result box
			search.append("<div class='site " + ss.id + "'><div id='searching'>Searching...</div></div>");
			// execute search
			searchSite[ss.id](ss.id, titleBox.val());
			// return
			return false;
		});
		search.append(a);
	});
	search.append("<br>");

	// offset textarea
	let offsetBox = $("<input type='text' size='1' style='font-size: 11px; padding: 3px; margin-left: 8px;'>");
	let o = $(properties.editPageBox).val().split(" ")[2];
	if (o) offsetBox.val(o);
	// Set Offset button
	let a = $("<a>Set Offset</a>");
	a.attr("href", "#");
	a.on("click", function() {
		// get offset from offsetBox
		let o = parseInt(offsetBox.val());
		// replace or append to commentBox
		let val = $(properties.editPageBox).val().split(" ");
		if (!o || o == 0) {
			val[2] = undefined;
		} else {
			val[2] = o;
		}
		$(properties.editPageBox).val(val.join(" "));
		return false;
	});
	// offset div
	let offset = $("<div id='offset'>");
	offset.append(a, offsetBox);
	search.after(offset);
}

function putResults(id, results) {
	let siteDiv = $("#search").find("." + id);
	// if div with current id cant be found then don't add results
	if (siteDiv.length !== 0) {
		siteDiv.find("#searching").remove();

		if (results.length === 0) {
			siteDiv.append("No Results. Try changing the title in the search box above.");
			return;
		}
		// add results
		for (let i = 0; i < results.length; i++) {
			let r = results[i];
			let a = $("<a href='#'>Select</a>");
			a.on("click", function() {
				$(properties.editPageBox).val(id + " " + r.href);
				return false;
			});
			siteDiv.append("(").append(a).append(") ").append("<a target='_blank' href='" + getEplistUrl[id](r.href) + "'>" + r.title + "</a>");
			if (r.episodes) {
				siteDiv.append(" (" + r.episodes + ")");
			}
			siteDiv.append("<br>");
		}
	}
}

function errorResults(id, error) {
	let siteDiv = $("#search").find("." + id);
	// if div with current id cant be found then don't add error
	if (siteDiv.length !== 0) {
		siteDiv.find("#searching").remove();
		siteDiv.append(error || mal.genericErrorRequest);
	}
}

