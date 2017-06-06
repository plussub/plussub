var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.Descriptor = require('./../../Descriptor.js').srtPlayer.Descriptor;
}

srtPlayer.SubtitleProvider = srtPlayer.SubtitleProvider || ((messageBusLocal = messageBus, fetch = window.fetch) => {

        const SERVICE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.SERVICE);
        const SERVICE_CONST = srtPlayer.Descriptor.SERVICE.SUBTITLE_PROVIDER;
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
        async function search(data) {

            if (!data.imdbid || !data.iso639) {
                console.log("invalid search parameter:", data);
                return;
            }

            try {
                const response = await fetch('https://0e53p7322m.execute-api.eu-central-1.amazonaws.com/release/subtitle/' + data.imdbid + '/' + data.iso639)
                if (response.status !== 200) {
                    console.log('Invalid Status Code: ' + response.status);
                    return;
                }
                const responseObject = await response.json();
                const subtitleSearchResult = responseObject.map(entry =>
                    Object.assign({}, {
                        movieTitle: entry.MovieName,
                        subtitleLanguage: entry.LanguageName,
                        idSubtitleFile: entry.IDSubtitleFile,
                        subtitleRating: entry.SubRating,
                        downloadLink: entry.SubDownloadLink
                    }));

                SERVICE_CHANNEL.publish({
                    topic: SERVICE_CONST.PUB.SEARCH_RESULT,
                    data: subtitleSearchResult
                });
            } catch (err) {
                SERVICE_CHANNEL.publish({
                    topic: srtPlayer.Descriptor.SERVICE.NOTIFICATION.SUB.NOTIFY,
                    data: {
                        msg: "Something goes wrong with the subtitle search"
                    }
                })
            }
        }

        async function download(link) {
            link = link.replace('http://','https://');
            try {
                const response = await fetch(link);
                if (response.status !== 200) {
                    console.log('Invalid Status Code: ' + response.status);
                    return;
                }
                const result = await pako.inflate(new Uint8Array(await response.arrayBuffer()), {to: "string"});
                SERVICE_CHANNEL.publish({
                    topic: SERVICE_CONST.PUB.DOWNLOAD_RESULT,
                    data: result
                });
            } catch (err) {
                SERVICE_CHANNEL.publish({
                    topic: srtPlayer.Descriptor.SERVICE.NOTIFICATION.SUB.NOTIFY,
                    data: {
                        msg: "Something goes wrong with the subtitle download"
                    }
                });
            }
        }


    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.SubtitleProvider === 'function') {
    srtPlayer.SubtitleProvider = srtPlayer.SubtitleProvider();
}