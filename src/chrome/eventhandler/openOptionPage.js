import {store} from "../../redux/redux.js";
import {openOptionPage} from "../../redux/actionCreators.js";

store.subscribe(() => {
    if (store.getState().appState.openOptionPage === 'open') {
        store.dispatch(openOptionPage(''));
        chrome.tabs.create({url: "/src/chrome/option.html"});
    }
});

export default {}