import {subscribe, dispatch, getState} from "../../redux/redux.js";
import axios from 'axios';
import {requestMovieSearch, setMovieSearchResult, stopMovieSearch} from "../../redux/actionCreators.js";

class MovieSearchService {

    constructor() {
        this.source = null;

        this.unsubscribe = subscribe(() => {
            let {
                query,
                requestId,
                prevRequestId,
                isLoading,
                isStopping
            } = getState().movieSearch;

            if (prevRequestId !== requestId && query !== "") {
                console.log(`load query ${query}`);
                dispatch(requestMovieSearch());
                this.search(query);
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

    async search(query) {

        if (this.source) {
            this.source.cancel('New request');
        }
        this.source = axios.CancelToken.source();
        return axios.get(`https://app.plus-sub.com/v2/movie/search/${decodeURIComponent(query)}`, {cancelToken: this.source.token})
            .then((response) => dispatch(setMovieSearchResult(response.data.results.filter((entry, index, self) => self.findIndex(t => t.id === entry.id) === index))))
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

export default () => new MovieSearchService();