/* cookies */
/*******************************************************************************************************************************************************************/
// array with services that require cookies to make requests
const cookieServices = [
	// anime
	// manga
];

// checks if i need/can load cookies and returns the cookieService
function needsCookies(id, status) {
	for (let i = 0; i < cookieServices.length; i++) {
		if (cookieServices[i].id == id && cookieServices[i].status == status) return cookieServices[i];
	}
	return false;
}

// load cookies for specified service, then calls back
function loadCookies(cookieService, callback) {
	let lc = GM_getValue("loadCookies", {});
	if (lc[cookieService.id] === undefined || lc[cookieService.id] + 30*1000 < Date.now()) {
		lc[cookieService.id] = Date.now();
		GM_setValue("loadCookies", lc);
		GM_openInTab(cookieService.url, true);
	}
	if (callback) {
		setTimeout(function() {
			callback();
		}, cookieService.timeout);
	}
}

// function to execute when script is run on website to load cookies from
pageLoad["loadCookies"] = function(cookieService) {
	let lc = GM_getValue("loadCookies", {});
	if (lc[cookieService.id] && cookieService.loaded()) {
		lc[cookieService.id] = false;
		GM_setValue("loadCookies", lc);
		window.close();
	}
}

