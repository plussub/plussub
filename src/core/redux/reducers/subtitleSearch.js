import initial from "../initial.js";
import type from "../const.js";

export default {
    reduce(state, action) {

    if (action.error) {
        return {...state, ... initial.state.subtitleSearch};
    }


    switch (action.type) {
        case type.subtitle_search_via_imdb:
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
        case type.subtitle_search_via_language:
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
        case type.subtitle_search_result:
            return {
                ...state,
                isLoading: false,
                resultId: action.payload.resultId,
                result: action.payload.result,
            };
        case type.subtitle_search_selected:
            return {...state, selected: action.payload};
        case type.subtitle_search_reset:
            return {...state, ... initial.state.subtitleSearch};
        default:
            return state;
    }
}
}