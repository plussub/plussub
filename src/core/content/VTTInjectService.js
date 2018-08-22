import {store} from "../redux/redux";

class VTTInjectService {
    constructor() {
        this.processedCssTag = "containsPlusSubSubtitle";
        this.allCreatedTracks = [];

        store.subscribe(() => {
            let {
                subtitle,
                videoMeta: {
                    currentVideos
                }
            } = store.getState();
            this.processVideos(subtitle,currentVideos);
        });

        if (store.getState().debug.content) {
            console.log('VTTInjectService ready');
        }
    }

    processVideos(subtitle, videos) {
        if (subtitle.id === -1) {
            this.disableAllCreatedTracks();
            return;
        }

        let neverProcessed = (v) => !v.classList.contains(this.processedCssTag);
        let withCurrentSubtitle = (v) => v.classList.contains(subtitle.id);
        let not = (cond) => !cond;

        let processVideos = videos.filter(v => neverProcessed(v) || not(withCurrentSubtitle(v)));

        if (processVideos.length === 0) {
            return;
        }

        let cues = this.generateCuesFrom(subtitle.parsed);
        let tracks = processVideos.map(video => {
            if (!video.classList.contains(this.processedCssTag)) {
                video.classList.add(this.processedCssTag);
            }
            video.classList.add(subtitle.id);

            Array.from(video.textTracks).forEach(track => track.mode = "hidden");

            return this.addCuesToVideo(video, cues);
        });

        this.allCreatedTracks = this.allCreatedTracks.concat(tracks);

        return {
            processVideos,
            cues,
            tracks
        }
    }

    generateCuesFrom(parsedSubtitle, vttSettings = {}) {
        return parsedSubtitle.map((srt) => {
            const cue = new VTTCue((srt.from) / 1000, (srt.to) / 1000, `<c.srtPlayer>${srt.text}</c.srtPlayer>`);
            return Object.assign(cue, vttSettings);
        });
    }

    disableAllCreatedTracks() {
        this.allCreatedTracks.forEach(track => track.mode = 'disabled');
        this.allCreatedTracks = [];
    }

    addCuesToVideo(video, cues, title = "?") {
        if (store.getState().debug.content) {
            console.warn("add cues");
        }
        const track = video.addTextTrack("subtitles", `Plugin: Plussub (${title})`, "en");
        cues.forEach(cue => track.addCue(cue));
        track.mode = 'showing';
        return track;
    }
}

export default () => new VTTInjectService();
