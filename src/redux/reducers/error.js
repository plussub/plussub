export default {
    reduce(state, action) {

        if (!action.error) {
            return state;
        }
        return [...state, {
            timestamp: action.payload.reduxTimestamp,
            message: action.payload.message,
            src: action.payload.src
        }];
    }
}