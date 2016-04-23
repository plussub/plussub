/**
 * Created by sonste on 27.02.2016.
 */


srtPlayer.VTTInjectService = srtPlayer.VTTInjectService || (() => {
        "use strict";


        var BACKEND_SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        var CONTENT_SERVICE = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.CONTENT_SERVICE);
        var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);

        var cues, video, track,vttSettings;


        var currentDelayedTime=0;


        META_CHANNEL.subscribe({
            topic: "user.play.offsetTime",
            callback: (delayedTime)=>{
                if(currentDelayedTime === delayedTime){
                    return;
                }

                if(cues){
                    cues.forEach(cue=>{
                        cue.startTime +=((delayedTime-currentDelayedTime)/1000);
                        cue.endTime += ((delayedTime-currentDelayedTime)/1000);
                    });
                }
                currentDelayedTime = delayedTime;
            }
        });

        META_CHANNEL.subscribe({
            topic: "option.position",
            callback: (_vttSettings)=>vttSettings = _vttSettings
        });



        META_CHANNEL.subscribe({
            topic: 'subtitle.parsedSubtitle',
            callback: (parsedSubtitle)=> {
                if (parsedSubtitle) {
                    cues = JSON.parse(parsedSubtitle).map((srt)=> {
                        var vtt = new VTTCue((srt.from+currentDelayedTime) / 1000, (srt.to+currentDelayedTime) / 1000, "<c.srtPlayer>"+srt.text+"</c.srtPlayer>");
                        Object.assign(vtt,vttSettings);
                        return vtt;
                    });
                    addVttToVid();
                }

            }
        });

        META_CHANNEL.subscribe({
            topic: 'subtitle.isParsed',
            callback: (isParsed)=> {
                if (!isParsed && track) {
                    track.mode='disabled';
                }
            }
        });

        CONTENT_SERVICE.subscribe({
            topic: srtPlayer.ServiceDescriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.RELEASE,
            callback: ()=> {
                if(track){
                    track.mode='disabled';
                }
            }
        });

        BACKEND_SERVICE_CHANNEL.publish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
            data: 'user.play.offsetTime'
        });

        BACKEND_SERVICE_CHANNEL.publish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
            data: 'option.position'
        });

        BACKEND_SERVICE_CHANNEL.publish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
            data: 'subtitle.parsedSubtitle'
        });


        CONTENT_SERVICE.subscribe({
            topic: srtPlayer.ServiceDescriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND,
            callback: (_video)=> {
                video = _video;
                addVttToVid();
            }
        });



        function addVttToVid() {
            if (!cues || !video) {
                return;
            }
            if(track){
                track.mode='disabled';
            }
            track = video.addTextTrack("subtitles", "Plugin Subtitle", "en");
            cues.forEach((vtt)=> {
                track.addCue(vtt);
            });
            track.mode = 'showing';
        }


    })();