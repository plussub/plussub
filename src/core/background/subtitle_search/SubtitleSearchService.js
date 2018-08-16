var srtPlayer = srtPlayer || {};

if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.Descriptor = require('../../descriptor/Descriptor.js').srtPlayer.Descriptor;
    srtPlayer.Redux = require('../../redux/redux').srtPlayer.Redux;
    srtPlayer.ActionCreators = require('../../redux/actionCreators').srtPlayer.ActionCreators;        
}

srtPlayer.SubtitleSearchService = srtPlayer.SubtitleSearchService || ((fetch = window.fetch) => {

        let previousImdbId = srtPlayer.Redux.getState().subtitleSearch.imdbId;
        let previousLanguage = srtPlayer.Redux.getState().subtitleSearch.language;

        let unsubscribe = srtPlayer.Redux.subscribe(() => {
            let subtitleSearch = srtPlayer.Redux.getState().subtitleSearch;
            if (previousImdbId !== subtitleSearch.imdbId || previousLanguage !== subtitleSearch.language) {
                previousImdbId = subtitleSearch.imdbId;
                previousLanguage = subtitleSearch.language;

                if(subtitleSearch.imdbId !== "" && subtitleSearch.language!==""){
                    search(subtitleSearch.imdbId, subtitleSearch.language);
                }
            }
        });


        /**
         * imdbid -> movie id from imdb
         * language -> language iso639 code for subtitle
         */
        async function search(imdbId, language = "en") {

            if (!imdbId) {
                console.log(`invalid imdbid parameter: ${imdbId}`);
                return;
            }

            try {
                const response = await fetch(`https://app.plus-sub.com/v2/subtitle/${imdbId}/${language}`);
                if (response.status !== 200) {
                    srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setSubtitleSearchResult({
                        message:`Failed to search subtitle. Status ${response.status}`,
                        src:"subtitleSearchService"
                    },true));
                    return;
                }
                const responseObject = await response.json();
                const result = responseObject.map(entry =>
                    Object.assign({}, {
                        movieTitle: entry.MovieName,
                        subtitleLanguage: entry.LanguageName,
                        idSubtitleFile: entry.IDSubtitleFile,
                        subtitleRating: entry.SubRating,
                        downloadLink: entry.SubDownloadLink
                    }));

                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setSubtitleSearchResult(result.map(entry => Object.assign({}, entry, {valueField: JSON.stringify(entry)}))));

            } catch (err) {
                srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setSubtitleSearchResult({
                     message:`Failed to search subtitle. Are you Disconnected? Err: (${err})`,
                     src:"subtitleSearchService"
                 },true));
            }
        }

        return {
            shutdown:unsubscribe
        }

    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.SubtitleSearchService === 'function') {
    srtPlayer.SubtitleSearchService = srtPlayer.SubtitleSearchService();
}