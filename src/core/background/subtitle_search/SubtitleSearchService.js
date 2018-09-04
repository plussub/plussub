import {subscribe, dispatch, getState} from "../../redux/redux.js";
import {setSubtitleSearchResult} from "../../redux/actionCreators.js";

class SubtitleSearchService {
    constructor() {
        this.source = null;

        this.unsubscribe = subscribe(() => {
            let {
                previousQueryTmdbId,
                queryTmdbId,
                previousQueryLanguage,
                queryLanguage,
                isLoading,
                resultId,
                result,
                selected
            } = getState().subtitleSearch;


            if ((previousQueryTmdbId !== queryTmdbId && queryTmdbId !== "") ||
                (previousQueryLanguage !== queryLanguage && queryLanguage !== "")) {
                console.log(`load query tmdb: ${queryTmdbId} lang: ${queryLanguage}`);
                this.search(queryTmdbId, queryLanguage);
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

        if (!info.data.imdbid) {
            info = await axios.get(`https://app.plus-sub.com/v2/tv/information/${decodeURIComponent(tmdbId)}`, {cancelToken: this.source.token})
                .catch((error) => dispatch(setSubtitleSearchResult({
                    message: `Failed to search subtitle (imdb id). (${error})`,
                    src: "movieSearchService"
                }, true)));
        }


        return axios.get(`https://app.plus-sub.com/v2/subtitle/${info.data.imdbId}/${language}`, {
            cancelToken: this.source.token,
            transformResponse: [...axios.defaults.transformResponse, (data) => {
                console.log('fetch data:');
                console.log(data);
                return data.map(entry => ({
                    movieTitle: entry.MovieName,
                    subtitleLanguage: entry.LanguageName,
                    idSubtitleFile: entry.IDSubtitleFile,
                    subtitleRating: entry.SubRating,
                    downloadLink: entry.SubDownloadLink
                }));
            }]
        }).then((response) => dispatch(setSubtitleSearchResult(response.data))
        ).catch((error) => dispatch(setSubtitleSearchResult({
                message: `Failed to search subtitle. (${error})`,
                src: "movieSearchService"
            }, true))
        );
    }

    shutdown() {
        this.unsubscribe();
    }
}

export default new SubtitleSearchService();