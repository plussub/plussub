var srtPlayer = srtPlayer || {};

if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../../descriptor/Descriptor.js').srtPlayer.Descriptor;
    srtPlayer.Redux = require('../../redux/redux').srtPlayer.Redux;
    srtPlayer.ActionCreators = require('../../redux/actionCreators').srtPlayer.ActionCreators;
}

srtPlayer.SubtitleDownloadService = srtPlayer.SubtitleDownloadService || ((fetch = window.fetch) => {

        let previousLink = srtPlayer.Redux.getState().subtitleDownload.downloadLink;
        let previousResultId = srtPlayer.Redux.getState().subtitleSearch.resultId;

        let unsubscribe = srtPlayer.Redux.subscribe(() => {
            let subtitleDownload = srtPlayer.Redux.getState().subtitleDownload;

            if (previousLink !== subtitleDownload.downloadLink && subtitleDownload.downloadLink !== "") {
                previousLink = subtitleDownload.downloadLink;
                download(subtitleDownload.downloadLink);
            }

            if (previousResultId !== subtitleDownload.resultId && subtitleDownload.resultId !== -1) {
                previousResultId = subtitleDownload.resultId;
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.parseRawSubtitle(subtitleDownload.result));
            }
        });

        async function download(downloadLink) {
            let link = downloadLink.replace('http://', 'https://');
            try {
                const response = await fetch(link);
                if (response.status !== 200) {
                    srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setSubtitleDownloadResult({
                        message: `Failed to download subtitle. Status ${response.status}`,
                        src: "subtitleDownloadService"
                    }, true));
                    return;
                }
                const raw = await srtPlayer.Inflater().inflate(response);
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setSubtitleDownloadResult(raw));

            } catch (err) {
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setSubtitleDownloadResult({
                    message: `Failed to download subtitle. Are you Disconnected? Err: (${err})`,
                    src: "subtitleDownloadService"
                }, true));
            }
        }

        return {
            shutdown: unsubscribe
        }

    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.SubtitleDownloadService === 'function') {
    srtPlayer.SubtitleDownloadService = srtPlayer.SubtitleDownloadService();
}