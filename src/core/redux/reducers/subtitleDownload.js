import initial from "../initial.js";
import type from "../const.js";

export default {
    reduce(state, action) {

        if (action.error) {
            return {...state, ...initial.state.subtitleDownload};
        }

        switch (action.type) {
            case type.subtitle_download_link:
                if (state.downloadLink === action.payload) {
                    return state;
                }
                return {...state, downloadLink: action.payload, isLoading: true};
            case type.subtitle_download_result:
                return {
                    ...state,
                    isLoading: false,
                    resultId: action.payload.resultId,
                    result: action.payload.result,
                };
            case type.subtitle_download_reset:
                return {...state, ...initial.state.subtitleDownload};
            default:
                return state;
        }
    }
}