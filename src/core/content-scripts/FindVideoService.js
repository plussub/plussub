/**
 * Created by sonste on 27.02.2016.
 */

var srtPlayer = srtPlayer || {};

srtPlayer.FindVideoService = srtPlayer.FindVideoService || (() => {
        "use strict";

        const options = Object.assign({
            collectNodeListOfFoundedVideos:() => document.querySelectorAll("video"),
            observedNodeToDetectedAddedVideos:() => document.querySelector("body")
        },srtPlayer.FindVideoServiceOptions);

        const cssTag = "plussubDetectedVideo";

        const detectNotTaggedVideos = function () {
            const videoList = Array.from(options.collectNodeListOfFoundedVideos());
            videoList
                .filter(video => !video.classList.contains(cssTag))
                .forEach(video => {
                    video.classList.add(cssTag);
                    srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.foundVideo(video));
                });
        };
        detectNotTaggedVideos();

        new MutationObserver(detectNotTaggedVideos).observe(options.observedNodeToDetectedAddedVideos(), {childList: true, subtree: true});

    });