/* main */
/*******************************************************************************************************************************************************************/
// associates an url with properties and pageLoad function
let pages = [
	{ url: nineanime.base,                           prop: null,    load: "nineanime"  },
	{ url: animetwist.base,                          prop: null,    load: "animetwist" },
	{ url: "https://myanimelist.net/animelist/",     prop: "anime", load: "list"       },
	{ url: "https://myanimelist.net/mangalist/",     prop: "manga", load: "list"       },
	{ url: "https://myanimelist.net/ownlist/anime/", prop: "anime", load: "edit"       },
	{ url: "https://myanimelist.net/ownlist/manga/", prop: "manga", load: "edit"       },
];

(function($) {
	for (let i = 0; i < pages.length; i++) {
		if (window.location.href.indexOf(pages[i].url) != -1) {
			properties = properties[pages[i].prop];
			pageLoad[pages[i].load]();
			break;
		}
	}
})(jQuery);
