import initial from "../initial.js";
import type from "../const.js";

export default {
    reduce(state, action) {

        if (action.error) {
            return {...state, ...initial.state.subtitleSearch};
        }


        switch (action.type) {
            case type.subtitle_search_query:
                return {
                    ...state,
                    type: type.subtitle_search_query,
                    queryTmdbId: action.payload.queryTmdbId,
                    queryLanguage: action.payload.queryLanguage,
                    requestId: action.payload.requestId,

                    isLoading: false,
                    isStopping: false,
                    stopped: false,

                    result: [],
                    resultId: -1,
                    selected: -1
                };
            case type.subtitle_search_requested:
                return {
                    ...state,
                    type: type.subtitle_search_requested,
                    isLoading: true,
                    isStopping: false,
                    stopped: false,
                    prevRequestId: state.requestId
                };
            case type.subtitle_search_stop:
                return {
                    ...state,
                    type: type.subtitle_search_stop,
                    isStopping: true
                };
            case type.subtitle_search_stopped:
                return {
                    ...state,
                    type: type.subtitle_search_stopped,
                    stopped: true,
                    isLoading: false,
                    isStopping: false
                };
            case type.subtitle_search_result:
                return {
                    ...state,
                    type: type.subtitle_search_result,
                    previousQueryTmdbId: state.queryTmdbId,
                    previousQueryLanguage: state.queryLanguage,
                    isLoading: false,
                    resultId: action.payload.resultId,
                    result: action.payload.result,
                    selected: -1
                };
            case type.subtitle_search_selected:
                return {
                    ...state,
                    type: type.subtitle_search_selected,
                    selected: action.payload
                };
            case type.subtitle_search_reset:
                return {...state, ...initial.state.subtitleSearch};
            default:
                return state;
        }
    }
}