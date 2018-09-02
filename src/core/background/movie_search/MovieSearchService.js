import {subscribe, dispatch, getState} from "../../redux/redux.js";
import {setMovieSearchResult, stopMovieSearch} from "../../redux/actionCreators.js";

class MovieSearchService {

    constructor() {
        this.source = null;

        this.unsubscribe = subscribe(() => {
            let {
                query,
                previousQuery,
                isLoading,
                isStopping,
                stopped,
                resultId,
                result,
                selected
            } = getState().movieSearch;

            if (previousQuery !== query && query !== "") {
                console.log(`load query ${query}`);
                this.loadData(query);
            }

            if (isStopping && isLoading) {
                console.log('stop');
                if (this.source) {
                    this.source.cancel('Stop event');
                    dispatch(stopMovieSearch());
                }
            }

        });
        console.log("MovieSearchService ready");
    }

    async loadData(query) {

        if (this.source) {
            this.source.cancel('New request');
        }
        this.source = axios.CancelToken.source();
        return axios.get(`https://app.plus-sub.com/v2/movie/search/${decodeURIComponent(query)}`, {cancelToken: this.source.token})
            .then((response) => dispatch(setMovieSearchResult(response.data.results)))
            .catch((error) => dispatch(setMovieSearchResult({
                    message: `Failed to search movie. (${error})`,
                    src: "movieSearchService"
                }, true))
            );
    }

    shutdown() {
        this.unsubscribe();
    }

}

export default new MovieSearchService();