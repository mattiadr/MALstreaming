# MALstreaming
Adds anime streaming links to the next available episode to your Currently Watching page on [MAL](https://myanimelist.net/).

Since version 5.0 it also adds next available manga chapter to your Currently Reading list.

## Preview
![Preview Image](images/list_page.png)

Supported anime websites:
- [x] [Kissanime](http://kissanime.ru/)
- [x] [9anime](https://9anime.is/)
- [x] ~~[Masterani](https://www.masterani.me/)~~
- [x] [Anime Twist](https://twist.moe/)
- [x] [HorribleSubs](https://horriblesubs.info/)

Supported manga websites:
- [x] [Kissmanga](http://kissmanga.com/)
- [x] [MangaDex](https://mangadex.org/)
- [x] [Jaimini's Box](https://jaiminisbox.com/)
- [x] [MANGA Plus](https://mangaplus.shueisha.co.jp/)

## Usage
The usage is the same for both anime and manga.

This script is only active if you are logged in and in your currently watching page.
It provides the link to the next available episode and if there are multiple episodes their number will be in parenthesis.
The link will be green for currently airing anime or orange for non airing.
If there are no episodes available, a countdown will be shown.
Ep. list will link to the full episode list.

This script will work for both series and movies and will automatically skip episodes based on certain rules (usually recaps and special episodes are ignored).

The script uses the Comments section on MAL to store the streaming website name and url for each anime you want to link to (this will also allow you to choose from the subbed or dubbed version if available), you can use the Tags freely.
The Comment must contain the name of the website followed by the partial url for the anime (Example: "kissanime Boku-no-Hero-Academia-3rd-Season").
To easily set the comment, the script provides a search functionality in the edit page (shown below).

<details><summary>Show/Hide Image</summary>
<img src="images/edit_page.png" alt="Edit Page">
</details>

### Notes:
- You can click on the "Watch" column to refresh all episodes or on the cell to refresh for a single anime.
- You can ctrl-click after editing the anime to force a recheck on the comment, without needing to reload the page.
- Some anime services do not give an estimate for the time until next episode, so the script uses [anilist](https://anilist.co/) to get the time remaining.
- On MangaDex the timer estimate is often inaccurate, especially if a chapter is "locked" for the next days.
- This script will work with most anime, but since there can be exceptions there might be some errors in the episode count. Please report them.

## How to Install
1. Install Tampermonkey for [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [other browsers](http://www.tampermonkey.net/)
2. Click [here to install the script](https://raw.githubusercontent.com/mattiadr/MALstreaming/master/MALstreaming.user.js) or visit the [GreasyFork page](https://greasyfork.org/en/scripts/369605-malstreaming)

## Post Install
Since this script adds another column to the list, an wider style is recommended for the list.
You can get mine [here](https://pastebin.com/NEnDujGY), the only things that have been modified are the width, added trasparency and a custom background image.
You change the background image just by substituting the default `background-url` on the top of the stylesheet with a custom one (you need to link the image directly).

If you want to report a bug or request a feature you can:
- [Submit an issue on github](https://github.com/mattiadr/MALstreaming/issues)
- [Start a discussion on GreasyFork](https://greasyfork.org/en/scripts/369605-malstreaming/feedback)
- Message me directly on [reddit](https://www.reddit.com/user/mattiadr96/) or [MAL](https://myanimelist.net/profile/mattiadr)
- Email me at `mattiadr96 (at) gmail (dot) com`
