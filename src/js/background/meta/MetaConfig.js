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


            subtitle: {
                current: {},
                fallback: {
                    store: 'subtitle',
                    parsedSubtitle: '',
                    isParsed: false,
                    title: '',
                    language: 'eng',
                    metadata: {
                        movie: '',
                        subtitle: ''
                    }
                }
            },
            option: {
                current: {},
                fallback: {
                    store: 'option',
                    css: "#editCSS{ font-size:20px;} \n ::cue(.srtPlayer){ \/* background-color:black; color:white; font-size:20px; *\/}",
                    position: {
                        line: 13,
                        position: 50,
                        size: 100,
                        align: "middle",
                        vertical: undefined
                    },
                    errorReport:true
                }
            }
        };
    })();