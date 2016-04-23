/**
 * Created by sonste on 27.02.2016.
 */
var srtPlayer = srtPlayer || {};

srtPlayer.VideoMetaService = srtPlayer.VideoMetaService || (() => {
        "use strict";

        var CONTENT_SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.CONTENT_SERVICE);
        var SERVICE_CONST = srtPlayer.ServiceDescriptor.CONTENT_SERVICE.VIDEO_META;
        var console = srtPlayer.LogService.getLoggerFor(srtPlayer.ServiceDescriptor.CONTENT_SERVICE.VIDEO_META.NAME);
        var video;

        CONTENT_SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.ServiceDescriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND,
            callback: (_video)=>{
                console.log('bind video');
                if(video){
                    console.log('video already bounded');
                    return;
                }
                console.log(_video);
                video = $(_video);
                video.bind('timeupdate', (evt)=> {
                    var seconds = video[0].currentTime;
                    var ms = (seconds * 1000) | 0;
                    CONTENT_SERVICE_CHANNEL.publish({
                        topic: SERVICE_CONST.PUB.TIME,
                        data: ms
                    });
                });
            }
        });

        CONTENT_SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.ServiceDescriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.RELEASE,
            callback: ()=>{
                console.log('unbind video');
                if(video){
                    video.unbind();
                }
                video = null;
            }
        });



    })();