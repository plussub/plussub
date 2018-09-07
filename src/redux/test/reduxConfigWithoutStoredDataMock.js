import {createStore} from 'redux'

window.ReduxConfig = {
    loadState: () =>  null,
    shouldStoreState: false,
    createStore: (reducers, initialState) => createStore(reducers, initialState)
};