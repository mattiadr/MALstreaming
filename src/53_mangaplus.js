/* manga plus */
/*******************************************************************************************************************************************************************/
const mangaplus = {}
mangaplus.base = "https://mangaplus.shueisha.co.jp/";
mangaplus.manga = mangaplus.base + "titles/";
mangaplus.base_api = "https://jumpg-webapi.tokyo-cdn.com/api/";
mangaplus.manga_api = mangaplus.base_api + "title_detail?title_id=";
mangaplus.chapter = mangaplus.base + "viewer/";
mangaplus.search = mangaplus.base_api + "title_list/all";
mangaplus.lang_table = {
	undefined: "english",
	0:         "english",
	1:         "spanish",
}

/* =============== *\
   protobuf config
\* =============== */
let Root = protobuf.Root;
let Type = protobuf.Type;
let Field = protobuf.Field;
let Enum = protobuf.Enum;
let OneOf = protobuf.OneOf;

let Response = new Type("Response")
	.add(new OneOf("data")
		.add(new Field("success", 1, "SuccessResult"))
		.add(new Field("error", 2, "ErrorResult"))
	);

let ErrorResult = new Type("ErrorResult")
	.add(new Field("action", 1, "Action"))
	.add(new Field("englishPopup", 2, "Popup"))
	.add(new Field("spanishPopup", 3, "Popup"));

let Action = new Enum("Action")
	.add("DEFAULT", 0)
	.add("UNAUTHORIZED", 1)
	.add("MAINTAINENCE", 2)
	.add("GEOIP_BLOCKING", 3);

let Popup = new Type("Popup")
	.add(new Field("subject", 1, "string"))
	.add(new Field("body", 2, "string"));

let SuccessResult = new Type("SuccessResult")
	.add(new Field("isFeaturedUpdated", 1, "bool"))
	.add(new OneOf("data")
		.add(new Field("allTitlesView", 5, "AllTitlesView"))
		.add(new Field("titleRankingView", 6, "TitleRankingView"))
		.add(new Field("titleDetailView", 8, "TitleDetailView"))
		.add(new Field("mangaViewer", 10, "MangaViewer"))
		.add(new Field("webHomeView", 11, "WebHomeView"))
	);

let TitleRankingView = new Type("TitleRankingView")
	.add(new Field("titles", 1, "Title", "repeated"));

let AllTitlesView = new Type("AllTitlesView")
	.add(new Field("titles", 1, "Title", "repeated"));

let WebHomeView = new Type("WebHomeView")
	.add(new Field("groups", 2, "UpdatedTitleGroup", "repeated"));

let TitleDetailView = new Type("TitleDetailView")
	.add(new Field("title", 1, "Title"))
	.add(new Field("titleImageUrl", 2, "string"))
	.add(new Field("overview", 3, "string"))
	.add(new Field("backgroundImageUrl", 4, "string"))
	.add(new Field("nextTimeStamp", 5, "uint32"))
	.add(new Field("updateTiming", 6, "UpdateTiming"))
	.add(new Field("viewingPeriodDescription", 7, "string"))
	.add(new Field("firstChapterList", 9, "Chapter", "repeated"))
	.add(new Field("lastChapterList", 10, "Chapter", "repeated"))
	.add(new Field("isSimulReleased", 14, "bool"))
	.add(new Field("chaptersDescending", 17, "bool"));

let UpdateTiming = new Enum("UpdateTiming")
	.add("NOT_REGULARLY", 0)
	.add("MONDAY", 1)
	.add("TUESDAY", 2)
	.add("WEDNESDAY", 3)
	.add("THURSDAY", 4)
	.add("FRIDAY", 5)
	.add("SATURDAY", 6)
	.add("SUNDAY", 7)
	.add("DAY", 8);

let MangaViewer = new Type("MangaViewer")
	.add(new Field("pages", 1, "Page", "repeated"));

let Title = new Type("Title")
	.add(new Field("titleId", 1, "uint32"))
	.add(new Field("name", 2, "string"))
	.add(new Field("author", 3, "string"))
	.add(new Field("portraitImageUrl", 4, "string"))
	.add(new Field("landscapeImageUrl", 5, "string"))
	.add(new Field("viewCount", 6, "uint32"))
	.add(new Field("language", 7, "Language", {"default": 0}));

let Language = new Enum("Language")
	.add("ENGLISH", 0)
	.add("SPANISH", 1);

let UpdatedTitleGroup = new Type("UpdatedTitleGroup")
	.add(new Field("groupName", 1, "string"))
	.add(new Field("titles", 2, "UpdatedTitle", "repeated"));

let UpdatedTitle = new Type("UpdatedTitle")
	.add(new Field("title", 1, "Title"))
	.add(new Field("chapterId", 2, "uint32"))
	.add(new Field("chapterName", 3, "string"))
	.add(new Field("chapterSubtitle", 4, "string"));

let Chapter = new Type("Chapter")
	.add(new Field("titleId", 1, "uint32"))
	.add(new Field("chapterId", 2, "uint32"))
	.add(new Field("name", 3, "string"))
	.add(new Field("subTitle", 4, "string", "optional"))
	.add(new Field("startTimeStamp", 6, "uint32"))
	.add(new Field("endTimeStamp", 7, "uint32"));

let Page = new Type("Page")
	.add(new Field("page", 1, "MangaPage"));

let MangaPage = new Type("MangaPage")
	.add(new Field("imageUrl", 1, "string"))
	.add(new Field("width", 2, "uint32"))
	.add(new Field("height", 3, "uint32"))
	.add(new Field("encryptionKey", 5, "string", "optional"));

let root = new Root()
	.define("mangaplus")
	.add(Response)
	.add(ErrorResult)
	.add(Action)
	.add(Popup)
	.add(SuccessResult)
	.add(TitleRankingView)
	.add(AllTitlesView)
	.add(WebHomeView)
	.add(TitleDetailView)
	.add(UpdateTiming)
	.add(MangaViewer)
	.add(Title)
	.add(Language)
	.add(UpdatedTitleGroup)
	.add(UpdatedTitle)
	.add(Chapter)
	.add(Page)
	.add(MangaPage);

/* =================== *\
   protobuf config end
\* =================== */

getEpisodes["mangaplus"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangaplus.manga_api + url,
		responseType: "arraybuffer",
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				// decode response
				let buf = resp.response;
				let message = Response.decode(new Uint8Array(buf));
				let respJSON = Response.toObject(message);
				// check if response is valid
				if (!respJSON || !respJSON.success || !respJSON.success.titleDetailView) {
					// error
					putError(dataStream, "MANGA Plus: Bad Response");
					return;
				}

				let episodes = [];
				let titleDetailView = respJSON.success.titleDetailView;
				// insert episodes into list
				for (let i = 0; i < (titleDetailView.firstChapterList || []).length; i++) {
					let ch = titleDetailView.firstChapterList[i];
					let n = parseInt(ch.name.slice(1) - 1);
					episodes[n] = {
						text:      ch.subTitle,
						href:      mangaplus.chapter + ch.chapterId,
						timestamp: ch.startTimeStamp * 1000,
					};
				}
				for (let i = 0; i < (titleDetailView.lastChapterList || []).length; i++) {
					let ch = titleDetailView.lastChapterList[i];
					let n = parseInt(ch.name.slice(1) - 1);
					episodes[n] = {
						text:      ch.subTitle,
						href:      mangaplus.chapter + ch.chapterId,
						timestamp: ch.startTimeStamp * 1000,
					};
				}
				// get time of next episode
				let time = titleDetailView.nextTimeStamp * 1000;
				// callback
				putEpisodes(dataStream, episodes, time);
			} else {
				// error
				putError(dataStream, "MANGA Plus: " + resp.status);
			}
		}
	});
}

getEplistUrl["mangaplus"] = function(partialUrl) {
	return mangaplus.manga + partialUrl;
}

searchSite["mangaplus"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangaplus.search,
		responseType: "arraybuffer",
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				// decode response
				let buf = resp.response;
				let message = Response.decode(new Uint8Array(buf));
				let respJSON = Response.toObject(message);
				// check if response is valid
				if (!respJSON || !respJSON.success || !respJSON.success.allTitlesView) {
					// error
					return;
				}

				let titles = respJSON.success.allTitlesView.titles;
				let list = [];
				// insert results into list
				for (let i = 0; i < titles.length; i++) {
					let lang = mangaplus.lang_table[titles[i].language];
					list.push({
						title: titles[i].name + " (" + lang + ")",
						href:  titles[i].titleId,
					});
				}
				// filter results
				let results = list.filter(item => matchResult(item, title));
				// callback
				putResults(id, results);
			}
		}
	});
}

