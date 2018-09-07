import type from './const.js';
import {createGuid} from "../guid/guid.js";

let timestampFilter = (payload) => Object.assign(payload, {reduxTimestamp: new Date()});
let resultFilter = (payload) => Object.assign({}, {result: payload, resultId: createGuid()});

let parseRawSubtitle = (raw) => ({
    type: type.subtitle_parser_parse,
    payload: raw
});

let setOffsetTime = (delay = 0) => ({
    type: type.subtitle_offset_time,
    payload: (delay === null || isNaN(delay)) ? 0 : delay
});

let removeSubtitle = () => ({
    type: type.subtitle_remove,
    meta: "appPage"
});
let parsedSubtitle = (subtitleOrError = "", isError = false) => ({
    type: type.subtitle_parser_parsed,
    payload: isError ? timestampFilter(subtitleOrError) : resultFilter(subtitleOrError),
    error: isError
});

let triggerMovieSearch = (query) => ({
    type: type.movie_search_query,
    payload: {
        query: query,
        requestId: createGuid()
    }
});

let requestMovieSearch = () => ({type: type.movie_search_requested});

let triggerMovieSearchStop = () => ({type: type.movie_search_stop});

let stopMovieSearch = () => ({type: type.movie_search_stopped});

let setMovieSearchResult = (searchResultOrError, isError = false) => ({
    type: type.movie_search_result,
    payload: isError ? timestampFilter(searchResultOrError) : resultFilter(searchResultOrError),
    error: isError
});

let selectMovie = (index) => ({
    type: type.movie_search_selected,
    payload: index
});

let triggerMovieSearchReset = () => ({type: type.movie_search_reset});

let selectSubtitleLanguage = (iso639) => ({
    type: type.subtitle_language_iso639,
    payload: iso639
});


let triggerSubtitleSearch = (payload) => ({
    type: type.subtitle_search_query,
    payload: {
        queryLanguage: payload.queryLanguage,
        queryTmdbId: payload.queryTmdbId,
        requestId: createGuid()
    }
});

let requestSubtitleSearch = () => ({type: type.subtitle_search_requested});

let triggerSubtitleSearchStop = () => ({type: type.subtitle_search_stop});

let stopSubtitleSearch = () => ({type: type.subtitle_search_stopped});

let setSubtitleSearchResult = (searchResultOrError, isError = false) => ({
    type: type.subtitle_search_result,
    payload: isError ? timestampFilter(searchResultOrError) : resultFilter(searchResultOrError),
    error: isError
});

let selectSubtitle = (index) => ({
    type: type.subtitle_search_selected,
    payload: index
});

let triggerSubtitleSearchReset = () => ({type: type.subtitle_search_reset});

let triggerSubtitleDownload = (link) => ({
    type: type.subtitle_download_link,
    payload: {
        link,
        requestId: createGuid()
    }
});

let requestSubtitleDownload = () => ({type: type.subtitle_download_requested});

let triggerSubtitleDownloadStop = () => ({type: type.subtitle_download_stop});

let stopSubtitleDownload = () => ({type: type.subtitle_download_stopped});

let setSubtitleDownloadResult = (rawSubtitleOrError, isError = false) => ({
    type: type.subtitle_download_result,
    payload: isError ? timestampFilter(rawSubtitleOrError) : resultFilter(rawSubtitleOrError),
    error: isError
});

let setMovieInfo = (movieInfo) => ({
    type: type.movie_info_set,
    payload: Object.assign(movieInfo, {
        id: createGuid()
    })
});

let removeMovieInfo = () => ({type: type.movie_info_remove});


let resetSubtitleDownload = () => ({type: type.subtitle_download_reset});

let changeCss = (css = "") => ({
    type: type.option_css,
    payload: css
});

let changeSubtitleProperties = (properties = {}) => ({
    type: type.option_subtitle_properties,
    payload: properties
});

let resetOption = () => ({type: type.option_reset});

let foundVideo = (video = null) => ({
    type: type.content_found_video,
    payload: video
});

let videoTick = (ms = 0) => ({
    type: type.content_video_timestamp,
    payload: ms
});

let resetAll = () => ({type: type.reset_all});

let sendHeartBeat = () => ({type: "<does not match>"});

let setDebugSettings = (debugSettings) => ({
    type: type.debug_set,
    payload: debugSettings
});

let selectSubtitleSelectionMode = (selectedMode) => ({
    type: type.app_state_select_mode,
    payload: selectedMode
});

let openOptionPage = (payload) => ({
    type: type.app_state_open_option,
    payload: payload
});

export {
    openOptionPage,
    parseRawSubtitle,
    setOffsetTime,
    removeSubtitle,
    parsedSubtitle,
    triggerMovieSearch,
    requestMovieSearch,
    triggerMovieSearchStop,
    stopMovieSearch,
    setMovieSearchResult,
    selectMovie,
    triggerMovieSearchReset,
    selectSubtitleLanguage,
    triggerSubtitleSearch,
    requestSubtitleSearch,
    triggerSubtitleSearchStop,
    stopSubtitleSearch,
    setSubtitleSearchResult,
    selectSubtitle,
    triggerSubtitleSearchReset,
    triggerSubtitleDownload,
    requestSubtitleDownload,
    triggerSubtitleDownloadStop,
    stopSubtitleDownload,
    setSubtitleDownloadResult,
    resetSubtitleDownload,

    setMovieInfo,
    removeMovieInfo,
    changeCss,
    changeSubtitleProperties,
    resetOption,
    foundVideo,
    videoTick,
    resetAll,
    sendHeartBeat,
    setDebugSettings,
    selectSubtitleSelectionMode
};