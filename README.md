# MALstreaming
Adds anime streaming links to the next available episode to your Currently Watching page on [MAL](https://myanimelist.net/).

Since version 5.0 it also adds next available manga chapter to your Currently Reading list.

## Preview
![Preview Image](images/list_page.png)

Supported anime websites:
- [x] [Kissanime](http://kissanime.ru/)
- [x] [9anime](https://9anime.is/)
- [x] [Masterani.me](https://www.masterani.me/)

Supported manga websites:
- [x] [Kissmanga](http://kissmanga.com/)
- [x] [MangaDex](https://mangadex.org/)
- [ ] [NovelPlanet](http://novelplanet.com/)

## Usage
The functionality is the same for both anime and manga.

This script is only active if you are logged in and in your currently watching page.
It provides the link to the next available episode, if there are multiple episodes their number will be in parenthesis.
The link will be green for currently airing anime or orange for non airing.
If there are no episodes available a countdown will shown (if provided by the streaming website).
Ep. list will link to the full episode list.

This script will work for both series and movies and will automatically skip episodes based on certain rules (usually recaps and special episodes are skipped).

The Comments section for the anime is used to store the streaming website name and url for each anime you want to link to (this will also allow you to choose from the subbed or dubbed version if available), you can use the Tags freely.
The Comment must contain the name of the website followed by the partial url for the anime (Example: "kissanime Boku-no-Hero-Academia-3rd-Season").
To easily set the comment, in the edit page a search function is provided (shown below).

<details><summary>Show/Hide Image</summary>
<img src="images/edit_page.png" alt="Edit Page">
</details>
<br>

Some anime services do not give an estimate for the time until next episode, so I use [anichart](http://anichart.net) to get the time remaining. The script will automatically open, load and finally close the anichart tab whenever needed.

On MangaDex the timer estimate is often inaccurate, especially if a chapter is "locked" for the next days

## How to Install
1. Install [Tampermonkey (Chrome)](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Greasemonkey (Firefox)](https://addons.mozilla.org/firefox/addon/greasemonkey/)
2. Click [here to install the script](https://raw.githubusercontent.com/mattiadr/MALstreaming/master/MALstreaming.user.js) or visit the [GreasyFork page](https://greasyfork.org/en/scripts/369605-malstreaming)

## Post Install
Since this script adds another column to the list, an alternate css is recommended to make the list wider.
You can get mine [here](https://pastebin.com/NEnDujGY), the only things that have been modified are the width, added trasparency and a custom background image.
You change the background image just by substituting the default background-url on the top of the stylesheet with a custom one (you need to link the image directly).

This script will work with most anime, but since there can be exceptions there might be some errors in the episode count.
If you want to report a bug or request a feature you can:
- [Submit an issue on github](https://github.com/mattiadr/MALstreaming/issues)
- [Start a discussion on GreasyFork](https://greasyfork.org/en/scripts/369605-malstreaming/feedback)
- Message me directly on [reddit](https://www.reddit.com/user/mattiadr96/) or [MAL](https://myanimelist.net/profile/mattiadr)
- Email me at <mattiadr96@gmail.com>