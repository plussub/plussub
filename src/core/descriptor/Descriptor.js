/**
 * Created by BreitensteinSt on 04.02.2016.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
}

srtPlayer.Descriptor = srtPlayer.Descriptor || (() => {

        function addSubscriberAndPublisherToSingletons(definition) {
            if (definition._SUB) {
                definition.SUB = {};
                Object.keys(definition._SUB).map(key => {
                    var entry = {};
                    entry[key] = definition.NAME + definition._SUB[key];
                    return entry;
                }).forEach(entry => Object.assign(definition.SUB, entry));
            }
            if (definition._PUB) {
                definition.PUB = {};
                Object.keys(definition._PUB).map(key => {
                    var entry = {};
                    entry[key] = definition.NAME + definition._PUB[key];
                    return entry;
                }).forEach(entry => Object.assign(definition.PUB, entry));
            }
        }


        var definition = {

            APP_STATE:{
                APP_STATE:{
                    NAME:"appState",
                    _PUB:{
                        SELECT_MODE:".selectMode"
                    }
                }
            },

            RESET:{
                RESET:{
                    NAME:"reset",
                    _PUB:{
                        ALL:".all"
                    }
                }
            },
            
            OPTION: {
                OPTION: {
                    NAME: 'option',
                    _PUB: {
                        CSS: ".css",
                        SUBTITLE_PROPERTIES: ".subtitleProperty",
                        RESET: ".reset"
                    }
                }
            },

            MOVIE_SEARCH:{
                MOVIE_SEARCH:{
                    NAME:"movieSearch",
                    _PUB:{
                        SEARCH:".search",
                        RESULT:".result",
                        SET_SELECTED:".setSelected",
                        RESET:".reset",
                    }
                }
            },

            SUBTITLE_SEARCH:{
                SUBTITLE_SEARCH:{
                    NAME:"subtitleSearch",
                    _PUB:{
                        SEARCH_VIA_IMDB:".searchImdb",
                        SEARCH_VIA_LANGUAGE:".searchLang",
                        RESULT:".result",
                        SET_SELECTED:".setSelected",
                        RESET:".reset",
                    }
                },

                DOWNLOAD: {
                    NAME: "subtitleDownload",
                    _PUB: {
                        RESULT: ".result"
                    }
                }
            },

            SUBTITLE_DOWNLOAD:{
                SUBTITLE_DOWNLOAD:{
                    NAME: "subtitleDownload",
                    _PUB:{
                        DOWNLOAD_LINK:".downloadLink",
                        RESULT: ".result",
                        RESET:".reset"
                    }
                }

            },


            MOVIE_INFO: {
                MOVIE_INFO: {
                    NAME: "movieInfo",
                    _PUB: {
                        SET: ".set",
                        RESET:".reset"
                    }
                }
            },

            SUBTITLE: {
                PARSER: {
                    NAME: 'parserService',
                    _PUB: {
                        PARSED: '.parsed',
                        PARSE: '.parse'
                    }
                },
                OFFSET_TIME: {
                    NAME: 'subtitleOffset',
                    _PUB: {
                        VALUE: ".value"
                    }
                },
                REMOVE: {
                    NAME: 'remove',
                    _PUB: {
                        CURRENT_SUBTITLE: ".currentSubtitle"
                    }
                }
            },

            CONTENT_SERVICE: {
                FIND_VIDEO: {
                    NAME: 'findVideoService',
                    _PUB: {
                        FOUND: '.found',
                        RELEASE: '.release'
                    }
                },

                VIDEO_META: {
                    NAME: 'videoMetaService',
                    _PUB: {
                        TIME: '.time'
                    }
                }
            },
            DEBUG:{
                DEBUG:{
                    NAME:"debug",
                    _PUB:{
                        TOGGLE_CONSOLE:".toggleConsole",
                        ENABLE_CONSOLE:".enableConsole"
                    }
                }
            },
        };

        Object.keys(definition).forEach(serviceKey =>
            Object.keys(definition[serviceKey]).forEach((key) =>
                addSubscriberAndPublisherToSingletons(definition[serviceKey][key])
            )
        );
        return definition;


    })();

