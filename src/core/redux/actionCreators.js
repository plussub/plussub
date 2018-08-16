/**
 * Created by stefa on 25.08.2017.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../descriptor/Descriptor').srtPlayer.Descriptor;
    srtPlayer.GuidService = require('./GuidService').srtPlayer.GuidService;
}


srtPlayer.ActionCreators = srtPlayer.ActionCreators || (() => {

        let timestampFilter = (payload) => Object.assign(payload, {reduxTimestamp: new Date()});
        let resultFilter = (payload) => Object.assign({}, {result: payload, resultId: srtPlayer.GuidService.createGuid() });

        return {

            parseRawSubtitle: (raw) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSE,
                    payload: raw
                }
            },

            setOffsetTimeForSubtitle: (delay = 0) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE.OFFSET_TIME.PUB.VALUE,
                    payload: delay
                };
            },

            removeLoadedSubtitle: () => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE.REMOVE.PUB.CURRENT_SUBTITLE,
                    meta: "appPage"
                };
            },

            parsedSubtitle: (subtitleOrError = "", isError = false) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSED,
                    payload: isError ? timestampFilter(subtitleOrError) : resultFilter(subtitleOrError),
                    error: isError
                };
            },

            triggerSearchMovie: (query) => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SEARCH,
                    payload: query
                };
            },

            setMovieSearchResult: (searchResultOrError, isError = false) => {

                return {
                    type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESULT,
                    payload: isError ? timestampFilter(searchResultOrError) : resultFilter(searchResultOrError),
                    error: isError
                };
            },

            setSelectedMovieSelection: (index) => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SET_SELECTED,
                    payload: index
                };
            },

            triggerMovieSearchReset: () => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESET
                };
            },

            setMovieInfo: (movieInfo) => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.SET,
                    payload: Object.assign(movieInfo,{
                        id:srtPlayer.GuidService.createGuid()
                    })
                };
            },

            resetMovieInfo: () => {
                return {
                    type: srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.RESET
                };
            },


            triggerSubtitleSearchViaImdbId: (imdbId) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_IMDB,
                    payload: imdbId
                };
            },


            triggerSubtitleSearchViaLanguage: (language) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_LANGUAGE,
                    payload: language
                };
            },

            setSelectedSubtitleSelection: (index) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SET_SELECTED,
                    payload: index
                };
            },

            setSubtitleSearchResult: (searchResultOrError, isError=false) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESULT,
                    payload: isError ? timestampFilter(searchResultOrError) : resultFilter(searchResultOrError),
                    error: isError
                };
            },

            triggerSubtitleSearchReset: () => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESET
                };
            },

            triggerSubtitleDownload: (link) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_DOWNLOAD.SUBTITLE_DOWNLOAD.PUB.DOWNLOAD_LINK,
                    payload: link
                };
            },

            setSubtitleDownloadResult: (rawSubtitleOrError,isError=false) => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_DOWNLOAD.SUBTITLE_DOWNLOAD.PUB.RESULT,
                    payload: isError ? timestampFilter(rawSubtitleOrError) : resultFilter(rawSubtitleOrError),
                    error: isError
                };
            },

            resetSubtitleDownload: () => {
                return {
                    type: srtPlayer.Descriptor.SUBTITLE_DOWNLOAD.SUBTITLE_DOWNLOAD.PUB.RESET
                };
            },

            changeCss: (css = "") => {
                return {
                    type: srtPlayer.Descriptor.OPTION.OPTION.PUB.CSS,
                    payload: css
                };
            },

            changeSubtitleProperties: (properties = {}) => {
                return {
                    type: srtPlayer.Descriptor.OPTION.OPTION.PUB.SUBTITLE_PROPERTIES,
                    payload: properties
                };
            },

            resetOption: () => {
                return {
                    type: srtPlayer.Descriptor.OPTION.OPTION.PUB.RESET
                };
            },

            foundVideo: (video = null) => {
                return {
                    type: srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND,
                    payload: video
                };
            },

            videoTick: (ms = 0) => {
                return {
                    type: srtPlayer.Descriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME,
                    payload: ms
                }
            },

            resetAll: () => {
                return {
                    type: srtPlayer.Descriptor.RESET.RESET.PUB.ALL
                }
            },

            sendHeartBeat: () => {
                return {
                    type: "<does not match>"
                }
            },

            toggleShowDebugConsole: () => {
                return {
                    type: srtPlayer.Descriptor.DEBUG.DEBUG.PUB.TOGGLE_CONSOLE
                }
            },

            enableDebugConsole: (enabled) => {
                return {
                    type: srtPlayer.Descriptor.DEBUG.DEBUG.PUB.ENABLE_CONSOLE,
                    payload: enabled
                }
            },

            selectSubtitleSelectionMode: (selectedMode) => {
                return {
                    type: srtPlayer.Descriptor.APP_STATE.APP_STATE.PUB.SELECT_MODE,
                    payload: selectedMode
                }
            }
        }


    })();
