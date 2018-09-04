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
                    queryTmdbId: action.payload.queryTmdbId,
                    queryLanguage: action.payload.queryLanguage,
                    isLoading: true,
                    result: [],
                    resultId: -1,
                    downloadLink: "",
                    selected: -1
                };
            case type.subtitle_search_result:
                return {
                    ...state,
                    previousQueryTmdbId: state.queryTmdbId,
                    previousQueryLanguage: state.queryLanguage,
                    isLoading: false,
                    resultId: action.payload.resultId,
                    result: action.payload.result,
                    selected: -1
                };
            case type.subtitle_search_selected:
                return {...state, selected: action.payload};
            case type.subtitle_search_reset:
                return {...state, ...initial.state.subtitleSearch};
            default:
                return state;
        }
    }
}