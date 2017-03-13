var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.ServiceDescriptor = require('./../../ServiceDescriptor.js').srtPlayer.ServiceDescriptor;
}

srtPlayer.SubtitleProvider = srtPlayer.SubtitleProvider || (($, messageBusLocal = messageBus, fetch = window.fetch) => {

        var SERVICE_CHANNEL = messageBusLocal.channel(srtPlayer.ServiceDescriptor.CHANNEL.SERVICE);
        var SERVICE_CONST = srtPlayer.ServiceDescriptor.SERVICE.SUBTITLE_PROVIDER;
        // var console = srtPlayer.LogService.getLoggerFor(SERVICE_CONST.NAME);

        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.SEARCH,
            callback: search
        });

        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.DOWNLOAD,
            callback: download
        });

        /**
         * data.imdbid -> movie id from imdb
         * data.iso639 -> language code for subtitle
         * @param data
         */
        function search(data) {

            if (!data.imdbid || !data.iso639) {
                console.log("invalid search parameter:", data);
                return;
            }

            fetch('https://0e53p7322m.execute-api.eu-central-1.amazonaws.com/release/subtitle/' + data.imdbid + '/' + data.iso639)
                .then(function (response) {
                    if (response.status !== 200) {
                        console.log('Invalid Status Code: ' + response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.json()
                        .then((data) => data.map(entry =>
                            Object.assign({}, {
                                movieTitle: entry.MovieName,
                                subtitleLanguage: entry.LanguageName,
                                idSubtitleFile: entry.IDSubtitleFile,
                                subtitleRating: entry.SubRating,
                                downloadLink: entry.SubDownloadLink
                            }))
                        ).then(result => SERVICE_CHANNEL.publish({
                        topic: SERVICE_CONST.PUB.SEARCH_RESULT,
                        data: result
                    }));
                })
                .catch(function (err) {
                    console.log('Fetch Error', err);
                });
        }

        function download(link) {
            fetch(link).then(function (response) {
                if (response.status !== 200) {
                    console.log('Invalid Status Code: ' + response.status);
                    return;
                }

                response.arrayBuffer().then((data) => pako.inflate(new Uint8Array(data), {to: "string"}))
                    .then(result => {
                        SERVICE_CHANNEL.publish({
                            topic: SERVICE_CONST.PUB.DOWNLOAD_RESULT,
                            data: result
                        })
                    })
                    .catch(function (err) {
                        console.log('Fetch Error', err);
                    });
            });
        }


    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.SubtitleProvider === 'function') {
    srtPlayer.SubtitleProvider = srtPlayer.SubtitleProvider($);
}