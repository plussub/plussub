import initial from "../initial.js";
import type from "../const.js";

export default {
    reduce(state, action) {

        if (action.error) {
            return {...state, ...initial.state.subtitleDownload};
        }

        switch (action.type) {
            case type.subtitle_download_link:
                return {...state,
                    downloadLink: action.payload.link,
                    requestId: action.payload.requestId,
                    isLoading: false,
                    isStopping: false,
                    stopped: false,

                    result: [],
                    resultId: -1,
                };
            case type.subtitle_download_requested:
                return {
                    ...state,
                    isLoading: true,
                    isStopping: false,
                    stopped: false,
                    prevRequestId: state.requestId
                };
            case type.subtitle_download_stop:
                return {...state, isStopping: true};
            case type.subtitle_download_stopped:
                return {
                    ...state,
                    stopped: true,
                    isLoading: false,
                    isStopping: false
                };
            case type.subtitle_download_result:
                return {
                    ...state,
                    isLoading: false,
                    isStopping: false,
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