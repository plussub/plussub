/**
 * Created by sonste on 27.02.2016.
 */
var srtPlayer = srtPlayer || {};

srtPlayer.VideoMetaService = srtPlayer.VideoMetaService || (() => {
        "use strict";

        const CONTENT_SERVICE_CHANNEL = messageBus.channel(srtPlayer.Descriptor.CHANNEL.CONTENT_SERVICE);
        const SERVICE_CONST = srtPlayer.Descriptor.CONTENT_SERVICE.VIDEO_META;

        const listOfDetectedVideos = [];

        CONTENT_SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND,
            callback: (video)=>{

                const previous = listOfDetectedVideos.pop();
                if(previous) {
                     previous.video.removeEventListener("timeupdate",previous.updateFn);
                }

                const updateFn = () => {
                    const seconds = video.currentTime;
                    const ms = (seconds * 1000) | 0;
                    CONTENT_SERVICE_CHANNEL.publish({
                        topic: SERVICE_CONST.PUB.TIME,
                        data: ms
                    });
                };

                listOfDetectedVideos.push({
                    video:video,
                    updateFn: updateFn
                });

                video.addEventListener("timeupdate", updateFn, false);
            }
        });



    })();