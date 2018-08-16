/**
 * Created by sonste on 27.02.2016.
 */
var srtPlayer = srtPlayer || {};

srtPlayer.VideoMetaService = srtPlayer.VideoMetaService || (() => {
        "use strict";

        const listOfDetectedVideos = [];
        const cssTag = "plussubTimeUpdateLister";

        srtPlayer.Redux.subscribe(()=>{
            let videos = srtPlayer.Redux.getState().videoMeta.currentVideos;
            if(videos.length){
                addTimeUpdateListener(videos[videos.length-1]);
            }
        });

        function addTimeUpdateListener (video){
            if(video.classList.contains(cssTag)){
                return;
            }

            const previous = listOfDetectedVideos.pop();
            if (previous) {
                previous.video.removeEventListener("timeupdate", previous.updateFn);
                previous.video.classList.remove(cssTag);
            }

            var lastSecond = -1;
            const updateFn = () => {
                let inSecond = parseInt(video.currentTime);
                if(inSecond === lastSecond){
                    return;
                }
                lastSecond = inSecond;
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.videoTick(inSecond*1000));
            };

            listOfDetectedVideos.push({
                video: video,
                updateFn: updateFn
            });

            video.classList.add(cssTag);
            video.addEventListener("timeupdate", updateFn, false);
        }

    });