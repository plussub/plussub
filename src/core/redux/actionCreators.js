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
    payload: delay
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

let triggerSearchMovie = (query) => ({
    type: type.movie_search_query,
    payload: query
});

let setMovieSearchResult = (searchResultOrError, isError = false) => ({
    type: type.movie_search_result,
    payload: isError ? timestampFilter(searchResultOrError) : resultFilter(searchResultOrError),
    error: isError
});

let setSelectedMovieSelection = (index) => ({
    type: type.movie_search_selected,
    payload: index
});

let triggerMovieSearchReset = () => ({type: type.movie_search_reset});

let setMovieInfo = (movieInfo) => ({
    type: type.movie_info_set,
    payload: Object.assign(movieInfo, {
        id: createGuid()
    })
});

let removeMovieInfo = () => ({type: type.movie_info_remove});

let triggerSubtitleSearchViaImdbId = (imdbId) => ({
    type: type.subtitle_search_via_imdb,
    payload: imdbId
});

let triggerSubtitleSearchViaLanguage = (language) => ({
    type: type.subtitle_search_via_language,
    payload: language
});

let setSelectedSubtitleSelection = (index) => ({
    type: type.subtitle_search_selected,
    payload: index
});

let setSubtitleSearchResult = (searchResultOrError, isError = false) => ({
    type: type.subtitle_search_result,
    payload: isError ? timestampFilter(searchResultOrError) : resultFilter(searchResultOrError),
    error: isError
});

let triggerSubtitleSearchReset = () => ({type: type.subtitle_search_reset});

let triggerSubtitleDownload = (link) => ({
    type: type.subtitle_download_link,
    payload: link
});

let setSubtitleDownloadResult = (rawSubtitleOrError, isError = false) => ({
    type: type.subtitle_download_result,
    payload: isError ? timestampFilter(rawSubtitleOrError) : resultFilter(rawSubtitleOrError),
    error: isError
});

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
    triggerSearchMovie,
    setMovieSearchResult,
    setSelectedMovieSelection,
    triggerMovieSearchReset,
    setMovieInfo,
    removeMovieInfo,
    triggerSubtitleSearchViaImdbId,
    triggerSubtitleSearchViaLanguage,
    setSelectedSubtitleSelection,
    setSubtitleSearchResult,
    triggerSubtitleSearchReset,
    triggerSubtitleDownload,
    setSubtitleDownloadResult,
    resetSubtitleDownload,
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