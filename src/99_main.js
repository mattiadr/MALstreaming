/* main */
/*******************************************************************************************************************************************************************/
// associates an url with properties and pageLoad function
let pages = [
	{ url: "https://myanimelist.net/animelist/",     prop: "anime", load: "list" },
	{ url: "https://myanimelist.net/mangalist/",     prop: "manga", load: "list" },
	{ url: "https://myanimelist.net/ownlist/anime/", prop: "anime", load: "edit" },
	{ url: "https://myanimelist.net/ownlist/manga/", prop: "manga", load: "edit" },
];

(function($) {
	// check on which page we are
	for (let i = 0; i < pages.length; i++) {
		if (window.location.href.indexOf(pages[i].url) != -1) {
			properties = properties[pages[i].prop];
			pageLoad[pages[i].load]();
			return;
		}
	}

	// check if we are on a load cookies page
	for (let i = 0; i < cookieServices.length; i++) {
		if (window.location.href.indexOf(cookieServices[i].url) != -1) {
			pageLoad["loadCookies"](cookieServices[i]);
			return;
		}
	}
})(jQuery);
