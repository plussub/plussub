import axios from 'axios';
import pako from 'pako';
import {subscribe, dispatch, getState} from "../../redux/redux.js";
import {
    requestSubtitleDownload,
    stopSubtitleDownload,
    setSubtitleDownloadResult,
    parseRawSubtitle
} from "../../redux/actionCreators.js";

class SubtitleDownloadService {
    constructor() {
        this.source = null;
        this.unsubscribe = subscribe(() => {
            let {
                downloadLink,
                requestId,
                prevRequestId,
                isLoading,
                isStopping
            } = getState().subtitleDownload;

            if (prevRequestId !== requestId && downloadLink !== "") {
                dispatch(requestSubtitleDownload());
                this.download(downloadLink);
            }

            if (isStopping && isLoading) {
                console.log('stop');
                if (this.source) {
                    this.source.cancel('Stop event');
                    dispatch(stopSubtitleDownload());
                }
            }
        });
        console.log("SubtitleDownloadService ready");
    }

    async download(downloadLink) {
        if (this.source) {
            this.source.cancel('New request');
        }

        return axios.get(downloadLink.replace('http://', 'https://'), {
            responseType: 'arraybuffer',
            transformResponse: [...axios.defaults.transformResponse,
                (data) => pako.inflate(data, {to: "string"})
            ]
        }).then(response => {
            dispatch(setSubtitleDownloadResult({}));
            dispatch(parseRawSubtitle(response.data));
        }).catch((error) => dispatch(setSubtitleDownloadResult({
                message: `Failed to download subtitle. (${error})`,
                src: "subtitleDownloadService"
            }, true))
        );
    }

    shutdown() {
        this.unsubscribe();
    }

}

export default () => new SubtitleDownloadService();