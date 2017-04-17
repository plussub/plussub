/**
 * Created by sbreitenstein on 30/01/17.
 */

var TestUtil = TestUtil || (function () {

        var entryCondition = (result) => result && result.entry && Object.keys(result.entry).length > 0;
        var parsedSubtitleCondition = (result) => result && result.isParsed;
        var clearParsedSubtitle = (result) => result && result.isParsed===false;

        return {
            dbPollConditions: {
                parsedSubtitle: parsedSubtitleCondition,
                clearParsedSubtitle: clearParsedSubtitle,
                entry: entryCondition
            },


            loadContentScript: function () {
                var linkElement = document.createElement('link');
                linkElement.setAttribute("rel","import");
                linkElement.setAttribute("href","content.html");
                document.querySelector('body').appendChild(linkElement);
            },

        //     <video id="exampleVideo" preload="auto" loop autoplay controls muted style="width:500px">
        //     <source src="http://ftp.halifax.rwth-aachen.de/blender/demo/movies/ToS/tears_of_steel_720p.mov"
        // type="video/mp4">
        //     </video>

            addVideo: function () {
                var videoElement = document.createElement('video');
                videoElement.setAttribute("preload","auto");
                videoElement.setAttribute("autoplay","auto");
                videoElement.setAttribute("controls","auto");
                videoElement.setAttribute("muted","auto");
                videoElement.setAttribute("style","width:500px");

                var sourceElement = document.createElement('source');
                sourceElement.setAttribute("src","http://ftp.halifax.rwth-aachen.de/blender/demo/movies/ToS/tears_of_steel_720p.mov");
                sourceElement.setAttribute("type","video/mp4");

                videoElement.appendChild(sourceElement);

                document.querySelector('#videoContainer').appendChild(videoElement);
            },

            /**
             * Result condition -> result && result.entry && result.entry contains properties
             * @param keypath
             * @returns {Promise}
             */
            pollDbUntilResult: function (keypath, condition = entryCondition) {
                return new Promise((resolve) => {
                    var intervalId = setInterval(() => {
                        srtPlayer.StoreService.find(keypath).then((result) => {
                            if (condition(result)) {
                                console.log("successful loaded keypath: " + keypath);
                                clearInterval(intervalId);
                                resolve(result);
                            }
                        });
                    }, 1000);
                });
            },

            triggerMovieSelection: function (movieTitle) {
                document.querySelector('movie-selectize selectize-wrapper').onSearchChange(movieTitle);

                return new Promise((resolve) => {
                    var intervalId = setInterval(() => {
                        var options = document.querySelector('movie-selectize selectize-wrapper').getWrapped().options;
                        var firstOption = options[Object.keys(options)[0]];
                        if (firstOption && firstOption.valueField) {
                            clearInterval(intervalId);
                            resolve(firstOption);
                        }
                    }, 1000);
                }).then((entry) => {
                    document.querySelector('movie-selectize selectize-wrapper').addItem(entry.valueField);
                });
            },

        };
    })();