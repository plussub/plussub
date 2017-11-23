# +Sub Chrome Extension
[![Build Status](https://travis-ci.org/ste-xx/plussub.svg?branch=master)](https://travis-ci.org/plussub/chrome-extension)

is an extension which adds subtitle to HTML <video> tags

This repository contains code to enable +Sub core used as Chrome extension.
The +Sub core is available under https://github.com/plussub/core

## Quickstart

### Prerequisite
- npm

### Build Project
1) npm install
2) gulp bower_update
3) gulp cspify

### Install local build in Chrome 
1) Type in Chrome address bar: chrome://extensions/
2) Active developer mode
3) Load unpacked extension...
4) Select +Sub Chrome-Extension root folder

## Run tests
- gulp mocha_unit for unit tests
- gulp mocha_integration for integration tests


## Version
Released chrome-extensions are tagged with git tags
e.g:

Webstore +Sub version is 2.50. 

This released version can be found with the git tag 2.50
