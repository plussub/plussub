var srtPlayer = srtPlayer || {};

srtPlayer.DownloadService = srtPlayer.DownloadService || (($,credential)=> {
        "use strict";

        var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        var SERVICE_CONST = srtPlayer.ServiceDescriptor.BACKEND_SERVICE.DOWNLOAD;
        var console2 = srtPlayer.LogService.getLoggerFor(SERVICE_CONST.NAME);

        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.SEARCH,
            callback: search
        });

        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.DOWNLOAD,
            callback: download
        });

        function login() {
            return new Promise((resolve, reject)=> {
                $.xmlrpc({
                    url: 'http://api.opensubtitles.org/xml-rpc',
                    methodName: 'LogIn',
                    params: [credential.username, credential.password, 'en', 'OSTestUserAgentTemp'],
                    success: function (response, status, jqXHR) {
                        resolve(response[0].token);
                    },
                    error: function (jqXHR, status, error) {
                        console2.error(error);
                        console2.error(status);

                        reject(error);
                    }
                }, {}, window);
            });
        }

        function search(data) {
            if(data.imdbid.startsWith('tt')){
                data.imdbid=data.imdbid.slice(2);
            }
            login().then((token) =>
                new Promise((resolve, reject)=>
                    $.xmlrpc({
                        url: 'http://api.opensubtitles.org/xml-rpc',
                        methodName: 'SearchSubtitles',
                        params: [token, [{'sublanguageid': data.iso639, 'imdbid': data.imdbid}]],
                        success: function (response, status, jqXHR) {
                            resolve(response[0].data);
                        },
                        error: function (jqXHR, status, error) {
                            console2.error(status);
                            reject(status);
                        }
                    }, {}, window)
                )
            ).then((data=[]) =>
                data.map(entry =>
                    Object.assign({}, {
                        rating: entry.SubRating,
                        movieTitle: entry.MovieName,
                        subtitleLanguage: entry.LanguageName,
                        idSubtitleFile: entry.IDSubtitleFile,
                        subtitleRating: entry.SubRating
                    })
                )
            ).then((result)=>
                SERVICE_CHANNEL.publish({
                        topic: SERVICE_CONST.PUB.SEARCH_RESULT,
                        data: result
                    })
            );
        }

        function download(idSubtitleFile) {
            login().then((token) => new Promise((resolve,reject)=>
                $.xmlrpc({
                    url: 'http://api.opensubtitles.org/xml-rpc',
                    methodName: 'DownloadSubtitles',
                    params: [token, [idSubtitleFile]],
                    success: function (response, status, jqXHR) {
                        resolve(response[0].data[0].data);
                    },
                    error: function (jqXHR, status, error) {
                        console2.error(status);
                        reject(error);
                    }
                }, {}, window)
            )).then(result=>{
                var gunzipData = new Zlib.Gunzip(srtPlayer.convertUtils.stringToUint8Array(atob(result)));
                var decompressedData = gunzipData.decompress();
                return srtPlayer.convertUtils.utf8ArrayToString(decompressedData);
            }).then(result=>
                SERVICE_CHANNEL.publish({
                    topic: SERVICE_CONST.PUB.DOWNLOAD_RESULT,
                    data: result
                })
            );
        }


    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.DownloadService === 'function') {
    srtPlayer.DownloadService = srtPlayer.DownloadService($,credential.opensubtitle);
}