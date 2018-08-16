var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../../descriptor/Descriptor.js').srtPlayer.Descriptor;
    srtPlayer.Redux = require('../../redux/redux').srtPlayer.Redux;
    srtPlayer.ActionCreators = require('../../redux/actionCreators').srtPlayer.ActionCreators;
}

srtPlayer.MovieSearchService = srtPlayer.MovieSearchService || ((fetch = window.fetch) => {

        let previousQuery = srtPlayer.Redux.getState().movieSearch.query;
        let unsubscribe = srtPlayer.Redux.subscribe(() => {
            let movieSearch = srtPlayer.Redux.getState().movieSearch;
            if (previousQuery !== movieSearch.query && movieSearch.query !== "") {
                previousQuery = movieSearch.query;
                loadData(movieSearch.query);
            }
        });

        async function loadData(query) {
            try {
                const response = await fetch('https://app.plus-sub.com/v2/movie/search/' + decodeURIComponent(query));
                if (response.status !== 200) {
                    srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setMovieSearchResult({
                        message:`Failed to search movie. Status (${response.status})`,
                        src:"movieSearchService"
                    },true));
                    return;
                }

                const result = (await response.json()).results.map(e =>   Object.assign(e, {valueField: JSON.stringify(e)}));
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setMovieSearchResult(result));
            } catch (err) {
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setMovieSearchResult({
                    message:`Failed to search movie. Are you Disconnected? Err: (${err})`,
                    src:"movieSearchService"
                },true));
            }
        }

        return {
            shutdown:unsubscribe
        }
    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.MovieSearchService === 'function') {
    srtPlayer.MovieSearchService = srtPlayer.MovieSearchService();
}
