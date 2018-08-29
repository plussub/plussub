import initial from "../initial.js";
import type from "../const.js";

export default {
    reduce(state, action) {
        switch (action.type) {
            case type.movie_info_set:
                return {...state, ...action.payload};
            case type.movie_info_remove:
                return {...state, ...initial.state.movieInfo};
            default:
                return state;
        }
    }
}