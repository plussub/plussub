import bridge from '../bridge/slave.js'

window.ReduxConfig = {
    loadState: () => null,
    shouldStoreState: false,
    createStore: (reducers, initialState) => bridge
};

export default window.ReduxConfig;