/**
 * Created by sonste on 27.02.2016.
 */


srtPlayer.VTTInjectService = srtPlayer.VTTInjectService || (async () => {
        "use strict";


        // const vttSettings = await new Promise(resolve => {
        //     META_CHANNEL.subscribe({
        //         topic: "option.position",
        //         callback: (vttSettings) => {
        //             resolve(vttSettings);
        //         }
        //     });
        //
        //     SERVICE_CHANNEL.publish({
        //         topic: srtPlayer.Descriptor.SERVICE.META.SUB.PUBLISH,
        //         data: 'option.position'
        //     });
        // });

        const processedCssTag = "containsPlusSubSubtitle";
        let allCreatedTracks = [];

        srtPlayer.Redux.subscribe(() => {
            processVideos(srtPlayer.Redux.getState().subtitle, srtPlayer.Redux.getState().videoMeta.currentVideos);
        });

        function processVideos(subtitle, videos) {
            if (subtitle.id === -1) {
                disableAllCreatedTracks();
                return;
            }

            let neverProcessed = (v) => !v.classList.contains(processedCssTag);
            let withCurrentSubtitle = (v) => v.classList.contains(subtitle.id);
            let not = (cond) => !cond;

            let toProcess = videos.filter(v => neverProcessed(v) || not(withCurrentSubtitle(v)));

            if (toProcess.length === 0) {
                return;
            }

            let cues = generateCuesFrom(subtitle.parsed);
            let tracks = toProcess.map(video => {
                if (!video.classList.contains(processedCssTag)) {
                    video.classList.add(processedCssTag);
                }
                video.classList.add(subtitle.id);

                Array.from(video.textTracks).forEach(track => track.mode = "hidden");

                return addCuesToVideo(video, cues);
            });

            allCreatedTracks = allCreatedTracks.concat(tracks);

            return {
                processVideos: toProcess,
                cues: cues,
                tracks: tracks
            }
        }


        function generateCuesFrom(parsedSubtitle, vttSettings = {}) {
            return parsedSubtitle.map((srt) => {
                const cue = new VTTCue((srt.from) / 1000, (srt.to) / 1000, "<c.srtPlayer>" + srt.text + "</c.srtPlayer>");
                return Object.assign(cue, vttSettings);
            });
        }

        function addCuesToVideo(video, cues, title = "?") {
            console.warn("add cues");
            const track = video.addTextTrack("subtitles", `Plugin: Plussub (${title})`, "en");
            cues.forEach(cue => track.addCue(cue));
            track.mode = 'showing';
            return track;
        }


        function disableAllCreatedTracks() {
            allCreatedTracks.forEach(track => track.mode = 'disabled');
            allCreatedTracks = [];
        }
    });