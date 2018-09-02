import initial from "../initial.js";
import type from "../const.js";

export default {
    reduce(state, action) {

        if (action.error) {
            return {...state, ...initial.state.movieSearch};
        }

        switch (action.type) {
            case type.movie_search_query:

                return {
                    ...state,

                    query: action.payload,

                    isLoading: true,
                    isStopping: false,
                    stopped: false,

                    result: [],
                    resultId: -1,
                    selected: -1
                };

            case type.movie_search_stop:
                return {...state, isStopping: true};

            case type.movie_search_stopped:
                return {
                    ...state,
                    previousQuery: '<CANCELD>',
                    stopped: true,
                    isLoading: false,
                    isStopping: false
                };

            case type.movie_search_result:
                console.log(state);
                return {
                    ...state,
                    previousQuery:state.query,
                    isLoading: false,
                    isStopping: false,
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