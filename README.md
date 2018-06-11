# MALstreaming
Adds streaming links to the next available episode to your Currently Watching page on <a href='https://myanimelist.net' target='_blank'>MAL</a>.

## Preview
![Preview Image](images/preview.png)

Supported streaming websites:
- [x] <a href='http://kissanime.ru' target='_blank'>Kissanime</a>
- [x] <a href='https://9anime.is' target='_blank'>9anime</a>

## Usage
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

## How to Install
1. Install <a href='https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo' target='_blank'>Tampermonkey (Chrome)</a> or <a href='https://addons.mozilla.org/firefox/addon/greasemonkey/' target='_blank'>Greasemonkey (Firefox)</a>
2. Click <a href='https://raw.githubusercontent.com/mattiadr/MALstreaming/master/MALstreaming.user.js'>here to install the script</a>

## Post Install
Since this script adds another column to the list, an alternate css is recommended to make the list wider.
You can get mine <a href='https://pastebin.com/A2WgHbYc' target='_blank'>here</a>, the only things that have been modified are the width, added trasparency and a custom background image.
You change the background image just by substituting the default background-url on the top of the stylesheet with a custom one (you need to link the image directly).

This script will work with most anime, but since there can be exceptions there might be some errors in the episode count.
If you want to report a bug or request a feature you can:
- <a href='https://github.com/mattiadr/MALstreaming/issues' target='_blank'>Submit an issue on github</a>
- Message me directly on <a href='https://www.reddit.com/user/mattiadr96/' target='_blank'>reddit</a> or <a href='https://myanimelist.net/profile/mattiadr' target='_blank'>MAL</a>
- Email me at mattiadr96@gmail.com
