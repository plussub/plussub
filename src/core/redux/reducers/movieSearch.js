import initial from "../initial.js";
import type from "../const.js";

export default {
    reduce(state, action) {

        if (action.error) {
            return {...state, ...initial.state.movieSearch};
        }

        switch (action.type) {
            case type.movie_search_query:
                return {...state, query: action.payload, isLoading: true, result: [], resultId: -1, selected: -1};
            case type.movie_search_result:
                return {
                    ...state,
                    isLoading: false,
                    result: action.payload.result,
                    resultId: action.payload.resultId,
                    selected: -1
                };
            case type.movie_search_selected:
                return {
                    ...state,
                    selected: action.payload
                };
            case type.movie_search_reset:
                return {...state, ...initial.state.movieSearch};
            default:
                return state;
        }
    }
}