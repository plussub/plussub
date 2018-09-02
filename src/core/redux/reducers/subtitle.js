import initial from "../initial.js";
import type from "../const.js";

export default {
    reduce(state, action) {

        if (action.error) {
            return {...state, ...initial.state.subtitle};
        }

        switch (action.type) {
            case type.subtitle_parser_parse:
                return {
                    ...state,
                    id: -1,
                    raw: action.payload,
                    parsed: [],
                    offsetTimeApplied: true,
                    pastOffsetTime: 0
                };
            case type.subtitle_parser_parsed:
                return {
                    ...state,
                    id: action.payload.resultId,
                    parsed: action.payload.result,
                    pastOffsetTime: 0,
                    offsetTimeApplied: true
                };
            case type.subtitle_offset_time:
                if (isNaN(action.payload)) {
                    throw "OffsetTime is not a number (NaN)";
                }

                if (action.payload === state.offsetTime) {
                    return state;
                }

                return {
                    ...state,
                    offsetTime: action.payload,
                    pastOffsetTime: state.offsetTime,
                    offsetTimeApplied: false
                };
            case type.subtitle_remove:
                return {...state, id: -1, raw: "", parsed: [], pastOffsetTime: 0, offsetTimeApplied: true};
            default:
                return state;
        }
    }

}