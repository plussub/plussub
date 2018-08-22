import initial from "../initial.js";
import type from "../const.js";

export default {
    reduce(state, action) {
        switch (action.type) {
            case type.option_css:
                return {...state, css: action.payload};
            case type.option_subtitle_properties:
                return {...state, subtitleProperties: action.payload};
            case type.option_reset:
                return {...state, ...initial.state.option};
            default:
                return state;
        }
    }
}