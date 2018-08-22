var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var Redux = require('../../redux/index');
}


srtPlayer.ReduxConfig = srtPlayer.ReduxConfig || (()=>{
    
        return {
            loadState:() => localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : null,
            shouldStoreState:true,
            createStore:(reducers,initialState)=>Redux.createStore(reducers, initialState)
        }
    })();