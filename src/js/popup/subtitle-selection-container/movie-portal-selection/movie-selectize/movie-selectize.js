/**
 * Created by sonste on 27.12.2016.
 */
Polymer({

    is: 'movie-selectize',
    behaviors: [ServiceChannelBehavior, MetaChannelBehavior],
    properties: {
        currentSelected: {
            type: Object,
            value: () => {
            },
            observer: '_currentSelectedChanged'
        },
    },

    _computeLoadFn: function () {
        return this.load;
    },

    load: function (query, fn) {
        "use strict";
        if (!query.length) {
            return fn();
        }

        this.$.movieSelection.clearOptions();

        this.servicePublish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: query
        });

        this.serviceSubscribeOnce({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: fn
        });
    },

    ready: function () {

        this.metaSubscribeOnce({
            topic: 'selected_movie.entry',
            callback: (movieMeta) => {

                if (!movieMeta || Object.keys(movieMeta).length===0) {
                    this.$.movieSelection.clearOptions();
                    return;
                }

                var movieMetaAsString = JSON.stringify(movieMeta);
                this.$.movieSelection.addOption(Object.assign({}, movieMeta, {valueField: movieMetaAsString}));
                this.$.movieSelection.addItem(movieMetaAsString);
            }
        });

        this.servicePublish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
            data: 'selected_movie.entry'
        });
    },


    _currentSelectedChanged: function (movieMeta) {
        "use strict";
        if (!movieMeta || Object.keys(movieMeta).length === 0) {
            this.$.movieSelection.clearOptions();
            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.FULL_TOPIC_RESET,
                data: 'selected_movie'
            });
            return;
        }

        //notify
        this.metaPublish({
            topic: 'selected_movie.entry',
            data: movieMeta
        });
    }
});