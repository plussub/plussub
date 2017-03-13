/**
 * Created by BreitensteinSt on 04.02.2016.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
}

srtPlayer.Descriptor = srtPlayer.Descriptor || (()=> {

        function addSubscriberAndPublisherToSingletons(definition){
            if(definition._SUB) {
                definition.SUB = {};
                Object.keys(definition._SUB).map(key=> {
                    var entry = {};
                    entry[key] = definition.NAME + definition._SUB[key];
                    return entry;
                }).forEach(entry => Object.assign(definition.SUB, entry));
            }
            if(definition._PUB) {
                definition.PUB = {};
                Object.keys(definition._PUB).map(key=> {
                    var entry = {};
                    entry[key] = definition.NAME + definition._PUB[key];
                    return entry;
                }).forEach(entry => Object.assign(definition.PUB, entry));
            }
        }

        var channels =  {
            META: 'meta',
            META_WRITE: 'metaWrite',
            GENERAL_SERVICE: 'general',
            SERVICE: 'backend',
            CONTENT_SERVICE: 'content'
        };

        var definition = {
            GENERAL_SERVICE:{
                CHANNEL_LOG_SERVICE: {
                    NAME: 'channelLogService'
                }
            },
            SERVICE: {
                META: {
                    NAME: 'metaService',
                    _SUB: {
                        PUBLISH:'.publish',
                        PUBLISH_ALL: '.publishAll',
                        RESET: '.reset',
                        FULL_TOPIC_RESET: '.fullTopicReset'
                    },
                    _PUB: {
                        READY: '.ready'
                    }
                },

                MOVIE_INFORMATION: {
                    NAME: 'movieInformationService',
                    _SUB: {
                        SEARCH: '.search'
                    },
                    _PUB: {
                        SEARCH_RESULT: '.searchResult'
                    }
                },

                SUBTITLE_PROVIDER: {
                    NAME: 'SubtitleProvider',
                    _SUB: {
                        SEARCH: '.search',
                        DOWNLOAD: '.download'
                    },
                    _PUB: {
                        SEARCH_RESULT: '.searchResult',
                        DOWNLOAD_RESULT: '.downloadResult'
                    }
                },

                PARSER: {
                    NAME: 'parserService',
                    _SUB: {
                        PARSE: '.parse',
                        RESET: '.reset'
                    }
                },
                NOTIFICATION:{
                    NAME: 'notificationService',
                    _SUB: {
                        NOTIFY: '.notify',
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
                },

                CSS_INJECT:{
                    NAME: 'cssInjectService'
                },

                VTT_INJECT:{
                    NAME: 'vttInjectService'
                },

                BACKGROUND_AVAILABILITY:{
                    NAME:'backgroundAvailabilityService'
                }
            }
        };

        Object.keys(definition).forEach(serviceKey =>
            Object.keys(definition[serviceKey]).forEach((key) =>
                addSubscriberAndPublisherToSingletons(definition[serviceKey][key])
            )
        );
        definition['CHANNEL']=channels;

        return definition;


    })();

