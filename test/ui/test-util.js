/**
 * Created by sbreitenstein on 30/01/17.
 */

var TestUtil = TestUtil || (function () {

        var entryCondition = (result) => result && result.entry && Object.keys(result.entry).length > 0;
        var parsedSubtitleCondition = (result) => result && result.isParsed;
        var clearParsedSubtitle = (result) => result && result.isParsed;


        return {
            dbPollConditions: {
                parsedSubtitle: parsedSubtitleCondition,
                clearParsedSubtitle: clearParsedSubtitle,
                entry: entryCondition
            },
            /**
             * Result condition -> result && result.entry && result.entry contains properties
             * @param keypath
             * @returns {Promise}
             */
            pollDbUntilResult: function (keypath, condition = entryCondition) {
                return new Promise((resolve) => {
                    var intervalId = setInterval(() => {
                        console.log("try load keypath: " + keypath);
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

            triggerRemoveMoviePortalSelected:function(){
                document.querySelector('movie-selectize selectize-wrapper paper-fab').click();
            }

        };
    })();