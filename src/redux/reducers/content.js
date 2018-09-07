import type from "../const.js";

export default {
    reduce(state, action) {
        switch (action.type) {
            case type.content_found_video:
                return {...state, foundVideo: true, currentVideos: [...state.currentVideos, action.payload]};
            case type.content_video_timestamp:
                return {...state, tickInMs: action.payload};
            default:
                return state
        }
    }
}