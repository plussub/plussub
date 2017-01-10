/**
 * Created by sonste on 28.12.2016.
 */
Polymer({

    is: 'subtitle-selectize',
    behaviors: [ServiceChannelBehavior, MetaChannelBehavior],
    properties: {
        currentSelected: {
            type: Object,
            value: () => Object.assign({}),
            observer: '_currentSelectedChanged'
        },
        _currentMovie: {
            type: Object,
            value: () => Object.assign({})
        },
        _currentLanguage: {
            type: Object,
            value: () => Object.assign({})
        }
    },
    metaSubscriptions: [
        {
            topic: "subtitle.metadata.movie",
            callback: "movieChanged",
            notifyWhenWriteOnChannel: true
        },
        {
            topic: "subtitle.language",
            callback: "languageChanged",
            notifyWhenWriteOnChannel: true
        }
    ],


    ready: function () {
        this.async(() => {
            this.metaSubscribeOnce({
                topic: 'subtitle.metadata.subtitle',
                callback: (data) => {
                    this.$.subtitleSelection.addItem(JSON.stringify(data));
                }
            });

            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
                data: 'subtitle.metadata.subtitle'
            });

            this.serviceSubscribe({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.DOWNLOAD.PUB.SEARCH_RESULT,
                callback: (result) => {
                    this.$.subtitleSelection.clearOptions();

                    if(!Array.isArray(result)){
                        return;
                    }
                    var _result = result.map(entry =>  Object.assign(entry, {valueField: JSON.stringify(entry)}));
                    this.$.subtitleSelection.load(_result)
                }
            });
        });
    },

    //todo store stuff
    _currentSelectedChanged: function (data) {
        "use strict";
        console.log(data);
    },

    movieChanged: function (movieMeta) {
        this._currentMovie = movieMeta;
        this._refreshItems();
    },

    languageChanged: function (language) {
        this._currentLanguage = language;
        this._refreshItems();
    },

    _refreshItems: function () {
        this.debounce('_subtitle_refresh', () => {
            if (!this._currentLanguage || Object.keys(this._currentLanguage).length === 0 || !this._currentMovie || Object.keys(this._currentMovie).length === 0) {
                console.log("whoops");
                return;
            }

            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.DOWNLOAD.SUB.SEARCH,
                data: {
                    imdbid: this._currentMovie.imdbID,
                    iso639: this._currentLanguage.iso639
                }
            });
        }, 300);
    }

});