$(document).ready(function () {

    var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
    var META_WRITE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);
    var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);


    $('#movieSelect').selectize({
        valueField: 'valueField',
        labelField: 'Title',
        searchField: 'Title',
        highlight: false,
        persist: false,
        maxOptions: 20,
        loadThrottle: 1000,
        render: srtPlayer.PopupInputSelectionRenderer.movie,
        loadingClass: 'loading',
        onChange: function (metadata) {
            if (metadata === '') {
                return;
            }
            META_WRITE_CHANNEL.publish({
                topic: 'subtitle.metadata.movie',
                data: JSON.parse(metadata)
            });
            selectizeSubtitle.clearOptions();
        },
        load: function (query, callback) {
            if (!query.length) return callback();
            this.clearOptions();

            SERVICE_CHANNEL.publish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE.SUB.SEARCH,
                data: query
            });

            SERVICE_CHANNEL.subscribe({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE.PUB.SEARCH_RESULT,
                callback: (result)=>callback(result)
            });
        }
    });

    var selectizeMovie = $('#movieSelect')[0].selectize;

    var initMovie = {
        topic: 'subtitle.metadata.movie',
        callback: (metadata)=> {
            var valueField = JSON.stringify(metadata);
            selectizeMovie.addOption(Object.assign({}, metadata, {valueField: valueField}));
            selectizeMovie.addItem(valueField);
            META_CHANNEL.unsubscribe(initMovie);
        }
    };
    META_CHANNEL.subscribe(initMovie);

    $('#languageSelect').selectize({
        valueField: 'iso639',
        labelField: 'iso639Name',
        searchField: 'iso639Name',
        highlight: true,
        persist: false,
        onChange: function (language) {
            "use strict";
            if (language === '') {
                return;
            }

            META_WRITE_CHANNEL.publish({
                topic: 'subtitle.language',
                data: language
            });
        },
        render: srtPlayer.PopupInputSelectionRenderer.language
    });
    var selectizeLanguage = $('#languageSelect')[0].selectize;
    selectizeLanguage.load(function (callback) {
        callback(iso639List);
    });
    var initLanguage = {
        topic: 'subtitle.language',
        callback: (language)=> {
            "use strict";
            selectizeLanguage.setValue(language);
            META_CHANNEL.unsubscribe(initLanguage);
        }
    };
    META_CHANNEL.subscribe(initLanguage);


    $('#subtitleSelect').selectize({
        valueField: 'valueField',
        labelField: 'movieTitle',
        searchField: 'movieTitle',
        sortField: [{
            field: 'rating',
            direction: 'desc'
        }],
        render: srtPlayer.PopupInputSelectionRenderer.subtitle,
        onChange: function (rawMetadata) {
            if (rawMetadata === '') {
                return;
            }

            var metadata = JSON.parse(rawMetadata);
            if (typeof metadata.idSubtitleFile === 'undefined') {
                return;
            }

            META_WRITE_CHANNEL.publish({
                topic: 'subtitle.metadata.subtitle',
                data: metadata
            });

            META_WRITE_CHANNEL.publish({
                topic: 'subtitle.title',
                data: metadata.movieTitle
            });


            SERVICE_CHANNEL.publish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.DOWNLOAD.SUB.DOWNLOAD,
                data: metadata.idSubtitleFile
            });
        }
    });
    var selectizeSubtitle = $('#subtitleSelect')[0].selectize;
    var initSubtitle = {
        topic: 'subtitle.metadata.subtitle',
        callback: (metadata)=> {
            var valueField = JSON.stringify(metadata);
            selectizeSubtitle.addOption(Object.assign({}, metadata, {valueField: valueField}));
            selectizeSubtitle.addItem(valueField);
            META_CHANNEL.unsubscribe(initSubtitle);
        }
    };
    META_CHANNEL.subscribe(initSubtitle);

    SERVICE_CHANNEL.subscribe({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.DOWNLOAD.PUB.DOWNLOAD_RESULT,
        callback: (result)=> {
            "use strict";
            SERVICE_CHANNEL.publish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.PARSER.SUB.PARSE,
                data: {
                    type: 'srt',
                    raw: result
                }
            });
        }
    });

    SERVICE_CHANNEL.subscribe({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.DOWNLOAD.PUB.SEARCH_RESULT,
        callback: (result)=> {
            selectizeSubtitle.load(function (callback) {
                callback(result);
            });
        }
    });


    META_CHANNEL.subscribe({
        topic: 'subtitle.metadata.movie',
        callback: (metadata)=> {
            conditionForSubSelect.movieSelect = metadata !== '' && typeof metadata !== 'undefined';
            checkCondition();
        }
    });

    META_CHANNEL.subscribe({
        topic: 'subtitle.language',
        callback: (metadata)=> {
            conditionForSubSelect.langSelect = metadata !== '' && typeof metadata !== 'undefined';
            checkCondition();
        }
    });

    selectizeSubtitle.disable();

    var conditionForSubSelect = {
        movieSelect: false,
        langSelect: false
    };

    function checkCondition() {
        "use strict";
        if (Object.keys(conditionForSubSelect).find((k)=>!conditionForSubSelect[k])) {
            selectizeSubtitle.disable();
        } else {
            selectizeSubtitle.enable();
            SERVICE_CHANNEL.publish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.DOWNLOAD.SUB.SEARCH,
                data: {
                    imdbid: JSON.parse(selectizeMovie.getValue()).imdbID,
                    iso639: selectizeLanguage.getValue()
                }
            });
        }
    }

    SERVICE_CHANNEL.subscribe({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.RESET,
        callback: (data)=> {
            if (data === 'subtitle') {
                selectizeMovie.clearOptions();
                selectizeSubtitle.clearOptions();
                conditionForSubSelect.movieSelect = false;
                checkCondition();
            }
        }
    });

    META_CHANNEL.subscribe({
        topic: 'user.standby',
        callback: (isStandby)=> {
            if (isStandby) {
                selectizeMovie.disable();
                selectizeLanguage.disable();
                selectizeSubtitle.disable();
            } else {
                selectizeMovie.enable();
                selectizeLanguage.enable();
                checkCondition();
            }
        }
    });
});