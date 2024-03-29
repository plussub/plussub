<div align="center">
<img width="33%" height="125" src="https://via.placeholder.com/15/5bc0de/000000?text=+">
<img width="130" height="125" src="https://github.com/plussub/plussub/blob/master/logo.png?raw=true">
<img width="33%" height="125" src="https://via.placeholder.com/15/5bc0de/000000?text=+">
</div>


# +Sub
![build(chrome)](https://github.com/plussub/plussub/workflows/build%20and%20deploy(chrome)/badge.svg)
![build(firefox)](https://github.com/plussub/plussub/workflows/build%20and%20deploy(firefox)/badge.svg)

> is an browser extension which adds subtitle to HTML `<video>` tags via file or subtitle search powered by [tmbd](https://www.themoviedb.org/) & [opensubtitles](https://opensubtitles.org).

### [Chrome Web Store](https://chrome.google.com/webstore/detail/%20sub/lpobdmdfgjokempajoobgfdnhjbjlnpm)

![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/lpobdmdfgjokempajoobgfdnhjbjlnpm?color=%235bc0de)
![Chrome Web Store](https://img.shields.io/chrome-web-store/users/lpobdmdfgjokempajoobgfdnhjbjlnpm?color=%235bc0de)

### [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/plussub/)
![Mozilla Add-on](https://img.shields.io/amo/stars/plussub?color=%235bc0de)
![Mozilla Add-on](https://img.shields.io/amo/users/plussub?color=%235bc0de)


### Feature list
![format](https://img.shields.io/badge/format-.vtt_.srt_.ssa_.ass-5bc0de) <br>
![add subtitle](https://img.shields.io/badge/add_subtitle_via-file--dialog_file--dropzone_search-5bc0de) <br>
![transcript](https://img.shields.io/badge/transcript-jump--to--timepoint_copy--subtitle--with--shift--left--click_highlight--current--showed--subtitle-5bc0de) <br>
![subtitle customizing](https://img.shields.io/badge/subtitle_customizing-offset--time_font--size_font--color_background--color_position-5bc0de) <br>
![search features](https://img.shields.io/badge/search_features-hearing--impaired--filter_episode--filter_season--filter-5bc0de) <br>

### Install local build in Chrome
```
# install dependencies
npm install
npm run gen

# build chrome (dev)
npm run start:chrome
```

1) Type in Chrome address bar: `chrome://extensions/`
2) Activate developer mode
3) Load unpacked extension...
4) Select `plussub-root-folder/dist-chrome`

### Install local build in Firefox
```
# install dependencies
npm install
npm run gen

# build firefox (dev)
npm run start:firefox
```

1) Type in Firefox address bar: `about:debugging`
2) Click "This Firefox"
3) Load Temporary Add-on...
4) Select `plussub-root-folder/dist-firefox`


### Test pages
[Simple test page](https://plussub-test-page.netlify.app/)

[Test page with iframes](https://plussub-test-iframe.netlify.app/)


