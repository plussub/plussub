import {subscribe, dispatch, getState} from "../../redux/redux.js";
import {requestSubtitleDownload, stopSubtitleDownload, setSubtitleSearchResult, parseRawSubtitle} from "../../redux/actionCreators.js";

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
            transformResponse: [...axios.defaults.transformResponse, (data) => {
                console.log(data);
                // const raw = await srtPlayer.Inflater().inflate(response);
                return data;
            }]
        }).then(response =>{
            dispatch(setSubtitleSearchResult(response.data));
            dispatch(parseRawSubtitle(response.data));
        }).catch((error) => dispatch(setSubtitleSearchResult({
            message: `Failed to download subtitle. (${error})`,
            src: "subtitleDownloadService"
        }, true)));
    }

    shutdown() {
        this.unsubscribe();
    }

}
export default new SubtitleDownloadService();