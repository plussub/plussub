import {store} from "../redux/redux";
import {foundVideo} from "../redux/actionCreators";

class FindVideoService {
    constructor() {

        this.options = Object.assign({
            collectNodeListOfFoundedVideos: () => document.querySelectorAll("video"),
            observedNodeToDetectedAddedVideos: () => document.querySelector("body")
        });
        this.cssTag = "plussubDetectedVideo";
        this.detectNotTaggedVideos();

        new MutationObserver(this.detectNotTaggedVideos).observe(this.options.observedNodeToDetectedAddedVideos(), {
            childList: true,
            subtree: true
        });

        if (store.getState().debug.content) {
            console.log('FindVideoService ready');
        }
    }

    detectNotTaggedVideos() {
        const videoList = Array.from(this.options.collectNodeListOfFoundedVideos());
        videoList
            .filter(video => !video.classList.contains(this.cssTag))
            .forEach(video => {
                video.classList.add(this.cssTag);
                store.dispatch(foundVideo(video));
            });
    };
}

export default () => new FindVideoService();