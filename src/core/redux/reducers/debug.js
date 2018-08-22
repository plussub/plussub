import type from "../const.js";

export default {
    reduce(state, action) {
        switch (action.type) {
            case type.debug_toggle_console:
                return {...state, showDebugConsole: !state.showDebugConsole};
            case type.debug_enable_console:
                return {...state, enableDebugConsole: action.payload};
            default:
                return state;
        }
    }
}