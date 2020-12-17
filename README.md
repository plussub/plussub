# +Sub Browser Extension
![build(chrome)](https://github.com/plussub/plussub/workflows/build%20and%20deploy(chrome)/badge.svg)
![build(firefox)](https://github.com/plussub/plussub/workflows/build%20and%20deploy(firefox)/badge.svg)

is an extension which adds subtitle to HTML <video> tags via file or subtitle search powered by tmbd & opensubtitles.org.

### Install local build in Chrome
```
# install dependencies
npm install

# build chrome (dev)
npm run start:chrome
```

1) Type in Chrome address bar: chrome://extensions/
2) Activate developer mode
3) Load unpacked extension...
4) Select plussub-root-folder/dist-chrome

### Install local build in Firefox
```
# install dependencies
npm install

# build firefox (dev)
npm run start:firefox
```

1) Type in Firefox address bar: about:debugging
2) Click "This Firefox"
3) Load Temporary Add-on...
4) Select plussub-root-folder/dist-firefox

## Run tests
```
npm run test
```
