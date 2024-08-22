# msn-show-source

A browser userscript to show the source article on MSN News, because Duckduckgo _really_ likes to show MSN News links

Intended for my personal use with [Violent Monkey](https://violentmonkey.github.io/) and [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)

## Install

1. Install a userscript manager (like the two listed above)
2. Grab a release:

   | Tag    | Links                                                                                                                                                                      | Notes         |
   | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
   | Latest | [Github](https://github.com/elanora96/msn-show-source/releases/latest/download/userscript.js)<br />[Greasy Fork](https://greasyfork.org/en/scripts/504602-msn-show-source) | \*Recommended |

   **_Or_**

   Clone this project and...

## Build From Source

Requirements:

- Node.js (written and tested on v22.6.0)

In the cloned repo:

1. Install dependencies with `npm install`
2. Run the provided `build` script with `npm run build`

Then you may use your userscript manager to install `./dist/userscript.js`
