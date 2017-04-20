/**
 * Created by sonste on 27.02.2016.
 */


srtPlayer.VTTInjectService = srtPlayer.VTTInjectService || (async () => {
        "use strict";


        const SERVICE_CHANNEL = messageBus.channel(srtPlayer.Descriptor.CHANNEL.SERVICE);
        const CONTENT_SERVICE = messageBus.channel(srtPlayer.Descriptor.CHANNEL.CONTENT_SERVICE);
        const META_CHANNEL = messageBus.channel(srtPlayer.Descriptor.CHANNEL.META);


        let cues = [];
        let delayedTime = 0;
        let videoList = [];
        let trackList = [];

        const cssTag = "containsPlusSubSubtitle";

        const vttSettings = await new Promise(resolve => {
            META_CHANNEL.subscribe({
                topic: "option.position",
                callback: (vttSettings) => {
                    console.log(vttSettings);
                    resolve(vttSettings);
                }
            });

            SERVICE_CHANNEL.publish({
                topic: srtPlayer.Descriptor.SERVICE.META.SUB.PUBLISH,
                data: 'option.position'
            });
        });


        META_CHANNEL.subscribe({
            topic: "user.play.offsetTime",
            callback: (_delayedTime) => {
                if (delayedTime === _delayedTime) {
                    return;
                }
                removeAll(cues);
                delayedTime = _delayedTime;
                addCuesToVideos(videoList, cues, delayedTime);

            }
        });


        META_CHANNEL.subscribe({
            topic: 'parsed_subtitle.parsedSubtitle',
            callback: (parsedSubtitle) => {
                if (!parsedSubtitle) {
                    return;
                }

                removeAll(cues);

                cues = JSON.parse(parsedSubtitle).map((srt) => {
                    const cue = new VTTCue((srt.from) / 1000, (srt.to) / 1000, "<c.srtPlayer>" + srt.text + "</c.srtPlayer>");
                    return Object.assign(cue, vttSettings);
                });

                addCuesToVideos(videoList, cues, delayedTime);
            }
        });

        CONTENT_SERVICE.subscribe({
            topic: srtPlayer.Descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND,
            callback: (video) => {
                removeAll();
                videoList.push(video);
                addCuesToVideos(videoList, cues, delayedTime);
            }
        });


        function addCuesToVideos(videoList, cues, delayedTime) {

            videoList
                .forEach(video => {
                    if(!video.classList.contains(cssTag)) {
                        video.classList.add(cssTag);
                    }
                    const track = video.addTextTrack("subtitles", "Plugin: Plussub", "en");
                    trackList.push(track);

                    cues.forEach(cue => {
                        let newCue = new VTTCue(cue.startTime + (delayedTime / 1000), cue.endTime + (delayedTime / 1000), cue.text);
                        Object.assign(newCue, vttSettings);
                        track.addCue(newCue);
                    });
                    track.mode = 'showing';
                });

        }

        function removeAll() {
            trackList.forEach(track => track.mode = 'disabled');
            trackList = [];
        }

        META_CHANNEL.subscribe({
            topic: 'parsed_subtitle.isParsed',
            callback: (isParsed) => {
                if (!isParsed) {
                    removeAll();
                }
            }
        });

        SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.RESET,
            callback: () => removeAll
        });

        SERVICE_CHANNEL.publish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.PUBLISH,
            data: 'user.play.offsetTime'
        });


        SERVICE_CHANNEL.publish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.PUBLISH,
            data: 'parsed_subtitle.parsedSubtitle'
        });
    })
    ();