import {createStore} from 'redux'

window.ReduxConfig = {
    loadState: () => localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : null,
    shouldStoreState: true,
    createStore: (reducers, initialState) => createStore(reducers, initialState)
};

export default window.ReduxConfig;