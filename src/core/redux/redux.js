import type from './const.js';
import initial from './initial.js'

import errorReducer from './reducers/error.js'
import appStateReducer from './reducers/appstate.js'
import contentReducer from './reducers/content.js'
import optionReducer from './reducers/option.js'
import subtitleReducer from './reducers/subtitle.js'
import movieInformationReducer from './reducers/movieInformation.js'
import movieSearchReducer from './reducers/movieSearch.js'
import subtitleSearchReducer from './reducers/subtitleSearch.js'
import subtitleDownloadReducer from './reducers/subtitleDownload.js'
import debugReducer from './reducers/debug.js'

//use this workaround to inject different redux configs
let config = window.ReduxConfig;

function reducers(state = initial.state, action) {
    if (state.debug.redux) {
        console.log(action.type);
    }

    state = {...state, errors: errorReducer.reduce(state.errors, action)};

    switch (action.type) {

        case type.reset_all:
            return {...state, ...initial.state};
        case type.app_state_select_mode:
            return {...state, appState: appStateReducer.reduce(state.appState, action)};
        case type.content_found_video:
        case type.content_video_timestamp:
            return {...state, videoMeta: contentReducer.reduce(state.videoMeta, action)};
        case type.option_css:
        case type.option_subtitle_properties:
        case type.option_reset:
            return {...state, option: optionReducer.reduce(state.option, action)};
        case type.subtitle_parser_parse:
        case type.subtitle_parser_parsed:
        case type.subtitle_offset_time:
        case type.subtitle_remove:
            return {...state, subtitle: subtitleReducer.reduce(state.subtitle, action)};
        case type.movie_info_set:
        case type.movie_info_reset:
            return {...state, movieInfo: movieInformationReducer.reduce(state.movieInfo, action)};
        case type.movie_search_query:
        case type.movie_search_result:
        case type.movie_search_selected:
        case type.movie_search_reset:
            return {...state, movieSearch: movieSearchReducer.reduce(state.movieSearch, action)};
        case type.subtitle_search_via_imdb:
        case type.subtitle_search_via_language:
        case type.subtitle_search_result:
        case type.subtitle_search_selected:
        case type.subtitle_search_reset:
            return {...state, subtitleSearch: subtitleSearchReducer.reduce(state.subtitleSearch, action)};
        case type.subtitle_download_link:
        case type.subtitle_download_result:
        case type.subtitle_download_reset:
            return {...state, subtitleDownload: subtitleDownloadReducer.reduce(state.subtitleDownload, action)};
        case type.debug_enable_console:
        case type.debug_toggle_console:
            return {...state, debug: debugReducer.reduce(state.debug, action)};
        default:
            return state
    }
}


//move load fn to own js
//use json schema for validation? use strategy pattern to test different approaches
let loadedState = config.loadState();

if (!loadedState || loadedState.schemaVersion < initial.state.schemaVersion) {
    loadedState = initial.state;
}

if (loadedState.debug.reduxStore) {
    console.log(`load state: ${loadedState}`);
}

let store = config.createStore(reducers, loadedState);
//fake ready event
if (typeof store.ready === 'undefined') {
    store.ready = () => ((async () => ""))();
}

//todo: move to redux config
// let store = wrapStore(Redux.createStore(reducers, _ initial.state));
store.subscribe(() => {
    let state = Object.assign({}, store.getState());
    if (!config.shouldStoreState || state.debug.disableStoreReduxState) {
        return;
    }
    //It makes no sense to safe founded videos or the current time of the video
    //because, when the app will reloaded, entirely other pages could be loaded.
    //Also currentVideos contains circular dependencies because it is a video-html5 instance;
    state.videoMeta = initial.state.videoMeta;

    if (state.debug.reduxStore) {
        console.log(JSON.stringify(state));
    }

    localStorage.setItem('reduxState', JSON.stringify(state));
});

let dispatch = store.dispatch;
let subscribe = store.subscribe;
let getState = store.getState;

export {store, dispatch, subscribe, getState};

console.log("Redux loaded");