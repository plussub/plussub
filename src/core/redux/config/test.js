/**
 * Created by stefa on 26.08.2017.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var Redux = require('redux');
}

srtPlayer.ReduxConfig = srtPlayer.ReduxConfig || (() => {

    return {
        loadState: () => null,
        shouldStoreState:false,
        createStore:(reducers,initialState)=>Redux.createStore(reducers, initialState),
    }
})();