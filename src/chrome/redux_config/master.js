window.ReduxConfig = {
    loadState: () => localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : null,
    shouldStoreState: true,
    createStore: (reducers, initialState) => window.Redux.createStore(reducers, initialState)
};

export default window.ReduxConfig;