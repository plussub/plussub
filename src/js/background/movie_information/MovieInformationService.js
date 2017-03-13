var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.Descriptor = require('./../../Descriptor.js').srtPlayer.Descriptor;
}

srtPlayer.MovieInformationService = srtPlayer.MovieInformationService || ((messageBusLocal = messageBus, fetch = window.fetch) => {

        var SERVICE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.SERVICE);
        var SERVICE_CONST = srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION;
        // var console = srtPlayer.LogService.getLoggerFor(SERVICE_CONST.NAME);

        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.SEARCH,
            callback: loadData
        });

        function loadData(query) {

            fetch('http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=' + decodeURIComponent(query))
                .then((response) => {
                    if (response.status !== 200) {
                        console.log('Invalid Status Code: ' + response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.json().then((data) => createOmdbInformationFrom(createImbdInformationFrom(data)));
                })
                .catch((err) => SERVICE_CHANNEL.publish({
                    topic: srtPlayer.Descriptor.SERVICE.NOTIFICATION.SUB.NOTIFY,
                    data: {
                        msg: "Something goes wrong with(IMDB)."
                    }
                }));
        }

        function createImbdInformationFrom(imdbResponse) {
            return Object.keys(imdbResponse).map((k) => imdbResponse[k]).reduce((p, c) => {
                p.push(...c);
                return p;
            }, []);
        }

        function createOmdbInformationFrom(imdbResult) {

            var maxRequestedImdb = 10;
            var imdbResultPartial = imdbResult.slice(0, imdbResult.length > maxRequestedImdb ? maxRequestedImdb : imdbResult.length);

            Promise.all(imdbResultPartial.map((rawImdb) =>
                fetch('http://www.omdbapi.com/?i=' + rawImdb.id)
                    .then(response => response.json())
                    .catch((err) => SERVICE_CHANNEL.publish({
                        topic: srtPlayer.Descriptor.SERVICE.NOTIFICATION.SUB.NOTIFY,
                        data: {
                            msg: "Something goes wrong with (OMDB)."
                        }
                    }))
            )).then((responses) =>
                responses
                    .map(entry => entry.Poster == 'N/A' ? Object.assign(entry, {Poster: "posterError.png"}) : entry)
                    .map(entry => Object.assign(entry, {
                        valueField: JSON.stringify(entry)
                    }))
            ).then((values) => SERVICE_CHANNEL.publish({
                topic: SERVICE_CONST.PUB.SEARCH_RESULT,
                data: values
            }));
        }
    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.MovieInformationService === 'function') {
    srtPlayer.MovieInformationService = srtPlayer.MovieInformationService();
}
