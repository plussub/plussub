import {store} from "../../core/redux/redux.js";
import {openOptionPage} from "../../core/redux/actionCreators.js";

store.subscribe(() => {
    if (store.getState().appState.openOptionPage === 'open') {
        store.dispatch(openOptionPage(''));
        chrome.tabs.create({url: "/src/chrome/option.html"});
    }
});

export default {}