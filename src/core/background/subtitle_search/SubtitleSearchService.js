import {subscribe, dispatch, getState} from "../../redux/redux.js";
import {setSubtitleSearchResult, requestSubtitleSearch, stopSubtitleSearch} from "../../redux/actionCreators.js";

class SubtitleSearchService {
    constructor() {
        this.source = null;

        this.unsubscribe = subscribe(() => {
            let {
                queryTmdbId,
                queryLanguage,
                requestId,
                prevRequestId,
                isLoading,
                isStopping
            } = getState().subtitleSearch;


            if (prevRequestId !== requestId && queryTmdbId !== "" && queryLanguage !== "") {
                console.warn(`load query tmdb: ${queryTmdbId} lang: ${queryLanguage}`);
                dispatch(requestSubtitleSearch());
                this.search(queryTmdbId, queryLanguage);
            }

            if (isStopping && isLoading) {
                console.log('stop');
                if (this.source) {
                    this.source.cancel('Stop event');
                    dispatch(stopSubtitleSearch());
                }
            }
        });
        console.log("SubtitleSearchService ready");
    }

    async search(tmdbId, language) {
        if (this.source) {
            this.source.cancel('New request');
        }
        this.source = axios.CancelToken.source();
        let info = await axios.get(`https://app.plus-sub.com/v2/movie/information/${decodeURIComponent(tmdbId)}`, {cancelToken: this.source.token})
            .catch((error) => dispatch(setSubtitleSearchResult({
                    message: `Failed to search subtitle (imdb id). (${error})`,
                    src: "movieSearchService"
                }, true))
            );

        if (!info.data.imdbId) {
            info = await axios.get(`https://app.plus-sub.com/v2/tv/information/${decodeURIComponent(tmdbId)}`, {cancelToken: this.source.token})
                .catch((error) => dispatch(setSubtitleSearchResult({
                    message: `Failed to search subtitle (imdb id). (${error})`,
                    src: "movieSearchService"
                }, true)));
        }


        return axios.get(`https://app.plus-sub.com/v2/subtitle/${info.data.imdbId}/${language}`, {
            cancelToken: this.source.token
        }).then((response) => dispatch(setSubtitleSearchResult(response.data)))
            .catch((error) => dispatch(setSubtitleSearchResult({
                    message: `Failed to search subtitle. (${error})`,
                    src: "SubtitleSearchService"
                }, true))
            );
    }

    shutdown() {
        this.unsubscribe();
    }
}

export default new SubtitleSearchService();