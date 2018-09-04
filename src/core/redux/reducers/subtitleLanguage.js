import type from "../const.js";

export default {
    reduce(state, action) {
        switch (action.type) {
            case type.subtitle_language_iso639:
                return {...state, iso639: action.payload};
            default:
                return state;
        }
    }
}