/**
 * Created by stefa on 26.08.2017.
 */

srtPlayer.ReduxConfig = srtPlayer.ReduxConfig || (()=>{

    return {
        loadState:() => null,
        shouldStoreState:false,
        createStore:(reducers,initialState) => {
            //Store2
            return srtPlayer.AppBridge(null);
        }
    }
})();