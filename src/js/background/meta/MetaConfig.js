/**
 * Created by sonste on 17.04.2016.
 */

var srtPlayer = srtPlayer || {};

var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
}

srtPlayer.MetaConfig = srtPlayer.MetaConfig || (()=> {
        "use strict";
        return {
            user: {
                current: {},
                fallback: {
                    store: 'user',
                    standby: false,
                    play: {
                        offsetTime: 0,
                        offsetTimeEnabled: true
                    },
                    test: {
                        deep: {
                            prop: 'testTxt'
                        }
                    }
                }
            },

            selected_movie:{
                current:{},
                fallback:{
                    store:'selected_movie',
                    entry:{}
                }
            },

            selected_subtitle_language:{
                current:{},
                fallback: {
                    store:'selected_subtitle_language',
                    entry: {
                        iso639: 'eng',
                        iso639Name: 'English',
                        iso639_2: 'en'
                    }
                }
            },

            selected_subtitle:{
                current:{},
                fallback: {
                    store:'selected_subtitle',
                    entry:{}
                }
            },

            selected_subtitle_file:{
                current:{},
                fallback: {
                    store:'selected_subtitle_file',
                    entry:{}
                }
            },

            parsed_subtitle:{
                current:{},
                fallback: {
                    store:'parsed_subtitle',
                    parsedSubtitle: '',
                    isParsed: false,
                    title: '',
                }
            },

            last_selected:{
                current:{},
                fallback: {
                    store:'last_selected',
                    entry:{}
                }
            },

            option: {
                current: {},
                fallback: {
                    store: 'option',
                    css: "#editCSS{ font-size:20px;} \n ::cue(.srtPlayer){ \/* background-color:black; \n color:white; \n font-size:20px; *\/}",
                    position: {
                        line: 13,
                        position: 50,
                        size: 100,
                        align: "center",
                        vertical: undefined
                    },
                    errorReport:true
                }
            },

            subtitle:{
                current:{},
                fallback:{
                    store:'subtitle'
                }
            },

        };
    })();