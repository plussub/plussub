import {store} from "../redux/redux";
import {videoTick} from "../redux/actionCreators";

class VideoMetaService {
    constructor() {
        this.listOfDetectedVideos = [];
        this.cssTag = "plussubTimeUpdateLister";

        store.subscribe(() => {
            let videos = store.getState().videoMeta.currentVideos;
            if (videos.length) {
                this.addTimeUpdateListener(videos[videos.length - 1]);
            }
        });

        if (store.getState().debug.content) {
            console.log('VideoMetaService ready');
        }
    }

    addTimeUpdateListener(video) {
        if (video.classList.contains(this.cssTag)) {
            return;
        }

        const previous = this.listOfDetectedVideos.pop();
        if (previous) {
            previous.video.removeEventListener("timeupdate", previous.updateFn);
            previous.video.classList.remove(this.cssTag);
        }

        let lastSecond = -1;
        const updateFn = () => {
            let inSecond = parseInt(video.currentTime);
            if (inSecond === lastSecond) {
                return;
            }
            lastSecond = inSecond;
            store.dispatch(videoTick(inSecond * 1000));
        };

        this.listOfDetectedVideos.push({
            video,
            updateFn
        });

        video.classList.add(this.cssTag);
        video.addEventListener("timeupdate", updateFn, false);
    }
}

export default () => new VideoMetaService();