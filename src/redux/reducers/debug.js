import type from "../const.js";

export default {
    reduce(state, action) {
        switch (action.type) {
            case type.debug_set:
                return {...state, ...action.payload};
            default:
                return state;
        }
    }
}