/**
 * Created by sonste on 27.12.2016.
 */
Polymer({

    is: 'movie-selectize',
    behaviors: [tms.ServiceChannelBehavior, tms.MetaChannelBehavior, tms.ChannelBasedInitializeBehavior],
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
            topic: srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: query
        });

        this.serviceSubscribeOnce({
            topic: srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: fn
        });
    },
    _currentSelectedChanged: function (movieMeta) {
        "use strict";
        if (!movieMeta || Object.keys(movieMeta).length === 0) {
            this.$.movieSelection.clearOptions();
            this.$.movieSelection.setTextboxValue("");
            this.servicePublish({
                topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
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