# +Sub Chrome Extension
![build(chrome)](https://github.com/plussub/plussub/workflows/build%20and%20deploy(chrome)/badge.svg)
![build(firefox)](https://github.com/plussub/plussub/workflows/build%20and%20deploy(firefox)/badge.svg)

is an extension which adds subtitle to HTML <video> tags via file or subtitle search powered by tmbd & opensubtitles.org.

### Build Project

```
# install dependencies
npm install

# build chrome
npm run start

# build firefoy
npm run start:firefox
```


### Install local build in Chrome 
1) Type in Chrome address bar: chrome://extensions/
2) Active developer mode
3) Load unpacked extension...
4) Select plussub-root-folder/dist-chrome

## Run tests
```
npm run test
```
