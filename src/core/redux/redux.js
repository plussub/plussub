var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../descriptor/Descriptor').srtPlayer.Descriptor;
    srtPlayer.ReduxConfig = require('./configForTest').srtPlayer.ReduxConfig;
}


srtPlayer.ReduxImpl = srtPlayer.ReduxImpl || ((initialState,config) => {

        function reducers(state = initialState, action) {

            if (state.debug.redux) {
                console.log(action.type);
            }

            state = {...state, errors: globalErrorHandler(state.errors, action)};

            switch (action.type) {

                case srtPlayer.Descriptor.RESET.RESET.PUB.ALL:
                    return {...state, ...initialState};
                case srtPlayer.Descriptor.APP_STATE.APP_STATE.PUB.SELECT_MODE:
                    return {...state, appState: appStateReducers(state.appState, action)};
                case srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND:
                case srtPlayer.Descriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME:
                    return {...state, videoMeta: contentReducers(state.videoMeta, action)};
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.CSS:
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.SUBTITLE_PROPERTIES:
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.RESET:
                    return {...state, option: optionReducers(state.option, action)};
                case srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSED:
                case srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSE:
                case srtPlayer.Descriptor.SUBTITLE.OFFSET_TIME.PUB.VALUE:
                case srtPlayer.Descriptor.SUBTITLE.REMOVE.PUB.CURRENT_SUBTITLE:
                    return {...state, subtitle: subtitleReducers(state.subtitle, action)};
                case srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.SET:
                case srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.RESET:
                    return {...state, movieInfo: movieInformationReducers(state.movieInfo, action)};
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SEARCH:
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESULT:
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SET_SELECTED:
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESET:
                    return {...state, movieSearch: movieSearchReducers(state.movieSearch, action)};
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_IMDB:
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_LANGUAGE:
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESULT:
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SET_SELECTED:
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESET:
                    return {...state, subtitleSearch: subtitleSearchReducers(state.subtitleSearch, action)};
                case srtPlayer.Descriptor.SUBTITLE_DOWNLOAD.SUBTITLE_DOWNLOAD.PUB.DOWNLOAD_LINK:
                case srtPlayer.Descriptor.SUBTITLE_DOWNLOAD.SUBTITLE_DOWNLOAD.PUB.RESULT:
                case srtPlayer.Descriptor.SUBTITLE_DOWNLOAD.SUBTITLE_DOWNLOAD.PUB.RESET:
                    return {...state, subtitleDownload: subtitleDownloadReducers(state.subtitleDownload, action)};
                case srtPlayer.Descriptor.DEBUG.DEBUG.PUB.TOGGLE_CONSOLE:
                case srtPlayer.Descriptor.DEBUG.DEBUG.PUB.ENABLE_CONSOLE:
                    return {...state, debug: debugReducers(state.debug, action)};
                default:
                    return state
            }
        }

        function globalErrorHandler(state, action) {

            if (!action.error) {
                return state;
            }
            return [...state, {
                timestamp: action.payload.reduxTimestamp,
                message: action.payload.message,
                src: action.payload.src
            }];
        }

        function appStateReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.APP_STATE.APP_STATE.PUB.SELECT_MODE:
                    return {...state, selectedMode: action.payload};
                default:
                    return state
            }
        }

        function contentReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND:
                    return {...state, foundVideo: true, currentVideos: [...state.currentVideos, action.payload]};
                case srtPlayer.Descriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME:
                    return {...state, tickInMs: action.payload};
                default:
                    return state
            }
        }

        function optionReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.CSS:
                    return {...state, css: action.payload};
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.SUBTITLE_PROPERTIES:
                    return {...state, subtitleProperties: action.payload};
                case srtPlayer.Descriptor.OPTION.OPTION.PUB.RESET:
                    return {...state, ...initialState.option};
                default:
                    return state;
            }
        }

        function subtitleReducers(state, action) {

            if (action.error) {
                return {...state, ...initialState.subtitle};
            }

            switch (action.type) {
                case srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSE:
                    return {
                        ...state,
                        id: -1,
                        raw: action.payload,
                        parsed: [],
                        offsetTimeApplied: true,
                        pastOffsetTime: 0
                    };
                case srtPlayer.Descriptor.SUBTITLE.PARSER.PUB.PARSED:
                    return {
                        ...state,
                        id: action.payload.resultId,
                        parsed: action.payload.result,
                        pastOffsetTime: 0,
                        offsetTimeApplied: true
                    };
                case srtPlayer.Descriptor.SUBTITLE.OFFSET_TIME.PUB.VALUE:
                    if (isNaN(action.payload)) {
                        throw "OffsetTime is not a number (NaN)";
                    }
                    if (action.payload === state.offsetTime) {
                        return state;
                    }

                    return {
                        ...state,
                        offsetTime: action.payload,
                        pastOffsetTime: state.offsetTime,
                        offsetTimeApplied: false
                    };
                case srtPlayer.Descriptor.SUBTITLE.REMOVE.PUB.CURRENT_SUBTITLE:
                    return {...state, id: -1, raw: "", parsed: [], pastOffsetTime: 0, offsetTimeApplied: true};
                default:
                    return state;
            }
        }

        function movieInformationReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.SET:
                    return {...state, ...action.payload};
                case srtPlayer.Descriptor.MOVIE_INFO.MOVIE_INFO.PUB.RESET:
                    return {...state, ...initialState.movieInfo};
                default:
                    return state;
            }
        }

        function movieSearchReducers(state, action) {

            if (action.error) {
                return {...state, ...initialState.movieSearch};
            }

            switch (action.type) {
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SEARCH:
                    return {...state, query: action.payload, isLoading: true, result: [], resultId: -1, selected: -1};
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESULT:
                    return {
                        ...state,
                        isLoading: false,
                        result: action.payload.result,
                        resultId: action.payload.resultId,
                        selected: -1
                    };
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.SET_SELECTED:
                    return {
                        ...state,
                        selected: action.payload
                    };
                case srtPlayer.Descriptor.MOVIE_SEARCH.MOVIE_SEARCH.PUB.RESET:
                    return {...state, ...initialState.movieSearch};
                default:
                    return state;
            }
        }

        function subtitleSearchReducers(state, action) {

            if (action.error) {
                return {...state, ...initialState.subtitleSearch};
            }


            switch (action.type) {
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_IMDB:
                    if (state.imdbId === action.payload) {
                        return state;
                    }

                    return {
                        ...state,
                        imdbId: action.payload,
                        isLoading: true,
                        result: [],
                        resultId: -1,
                        downloadLink: "",
                        selected: -1
                    };
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SEARCH_VIA_LANGUAGE:
                    if (state.language === action.payload) {
                        return state;
                    }

                    return {
                        ...state,
                        language: action.payload,
                        isLoading: true,
                        result: [],
                        resultId: -1,
                        selected: -1
                    };
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESULT:
                    return {
                        ...state,
                        isLoading: false,
                        resultId: action.payload.resultId,
                        result: action.payload.result,
                    };
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.SET_SELECTED:
                    return {...state, selected: action.payload};
                case srtPlayer.Descriptor.SUBTITLE_SEARCH.SUBTITLE_SEARCH.PUB.RESET:
                    return {...state, ...initialState.subtitleSearch};
                default:
                    return state;
            }
        }

        function subtitleDownloadReducers(state, action) {

            if (action.error) {
                return {...state, ...initialState.subtitleDownload};
            }

            switch (action.type) {
                case srtPlayer.Descriptor.SUBTITLE_DOWNLOAD.SUBTITLE_DOWNLOAD.PUB.DOWNLOAD_LINK:
                    if(state.downloadLink === action.payload){
                        return state;
                    }
                    return {...state, downloadLink: action.payload, isLoading: true};
                case srtPlayer.Descriptor.SUBTITLE_DOWNLOAD.SUBTITLE_DOWNLOAD.PUB.RESULT:
                    return {
                        ...state,
                        isLoading: false,
                        resultId: action.payload.resultId,
                        result: action.payload.result,
                    };
                case srtPlayer.Descriptor.SUBTITLE_DOWNLOAD.SUBTITLE_DOWNLOAD.PUB.RESET:
                    return {...state, ...initialState.subtitleDownload};
                default:
                    return state;
            }
        }

        function debugReducers(state, action) {
            switch (action.type) {
                case srtPlayer.Descriptor.DEBUG.DEBUG.PUB.TOGGLE_CONSOLE:
                    return {...state, showDebugConsole: !state.showDebugConsole};
                case srtPlayer.Descriptor.DEBUG.DEBUG.PUB.ENABLE_CONSOLE:
                    return {...state, enableDebugConsole: action.payload};
                default:
                    return state;
            }
        }

        //move load fn to own js
        //use json schema for validation? use strategy pattern to test different approaches
        let loadedState = config.loadState();

        if(!loadedState || loadedState.schemaVersion < initialState.schemaVersion) {
            loadedState = initialState;
        }

        if (loadedState.debug.reduxStore) {
            console.log(`load state: ${loadedState}`);
        }

        let store = config.createStore(reducers, loadedState);
        //fake ready event
        if (typeof store.ready === 'undefined') {
            store.ready = () => ((async () => ""))();
        }

        // let store = wrapStore(Redux.createStore(reducers, _initialState));
        store.subscribe(() => {
            let state = Object.assign({}, store.getState());
            if (!config.shouldStoreState || state.debug.disableStoreReduxState) {
                return;
            }
            //It makes no sense to safe founded videos or the current time of the video
            //because, when the app will reloaded, entirely other pages could be loaded.
            //Also currentVideos contains circular dependencies because it is a video-html5 instance;
            state.videoMeta = initialState.videoMeta;

            if (state.debug.reduxStore) {
                console.log(JSON.stringify(state));
            }

            localStorage.setItem('reduxState', JSON.stringify(state));
        });

        return {
            reducers: reducers,
            store: store,
            subscribe: store.subscribe,
            dispatch: store.dispatch,
            getState: () => store.getState()
        }
    });

srtPlayer.Redux = srtPlayer.Redux || srtPlayer.ReduxImpl( {

        schemaVersion: 252,

        appState: {
            selectedMode: 0
        },

        option: {
            css: "#editCSS{ font-size:20px;} \n ::cue(.srtPlayer){ \/* background-color:black; \n color:white; \n font-size:20px; *\/}",
            subtitleProperties: {
                position:50
            } //cue properties
        },

        subtitle: {
            id: -1,
            parsed: [],
            pastOffsetTime: 0,
            offsetTime: 0,
            offsetTimeApplied: true,
            raw: ""
        },

        movieSearch: {
            query: "",
            isLoading: false,
            resultId: -1,
            result: [],
            selected: -1,
        },

        movieInfo: {
            id: -1,
            title: "-",
            poster: null,
            src: ""
        },

        subtitleSearch: {
            imdbId: "",
            language: "eng",
            isLoading: false,
            resultId: -1,
            result: [],
            selected: -1,
        },

        subtitleDownload: {
            downloadLink: "",
            isLoading: false,
            resultId: -1,
            result: ""
        },

        //videoMeta is transient
        videoMeta: {
            tickInMs: 0,
            foundVideo: false,
            currentVideos: []
        },

        errors: [],

        debug: {
            messageBridge: true,
            showDebugConsole: false,
            enableDebugConsole:false,
            redux: false,
            reduxStore: false,
            disableStoreReduxState: false
        }
    },srtPlayer.ReduxConfig);