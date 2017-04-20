/**
 * Created by sonste on 20.04.2017.
 */

var srtPlayer = srtPlayer || {};

srtPlayer.InitService = srtPlayer.InitService || (async () => {
        await srtPlayer.VTTInjectService();
        srtPlayer.VideoMetaService();
        srtPlayer.CSSInjectService();
        srtPlayer.FindVideoService();
    })();