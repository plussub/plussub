import Bridge from '../bridge/slave.js'

let bridge = Bridge();

window.ReduxConfig = {
    loadState: () => null,
    shouldStoreState: false,
    createStore: (reducers, initialState) => bridge
};

export default window.ReduxConfig;