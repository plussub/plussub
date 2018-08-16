/**
 * Created by sonste on 20.04.2017.
 */

var srtPlayer = srtPlayer || {};

srtPlayer.InitService = srtPlayer.InitService || (async () => {

        await srtPlayer.Redux.store.ready();
        srtPlayer.VTTInjectService();
        srtPlayer.VideoMetaService();
        srtPlayer.CSSInjectService();
        //workaround for polymer :(
        setTimeout(() => {
            srtPlayer.FindVideoService();
        }, 500);
    })();