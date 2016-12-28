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
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE.SUB.SEARCH,
            data: query
        });

        this.serviceSubscribeOnce({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE.PUB.SEARCH_RESULT,
            callback: fn
        });
    },

    ready: function () {

        this.metaSubscribeOnce({
            topic: 'subtitle.metadata.movie',
            callback: (data) => {
                if (!data) {
                    this.$.movieSelection.clearOptions();
                    return;
                }

                var valueField = JSON.stringify(data);
                this.$.movieSelection.addOption(Object.assign({}, data, {valueField: valueField}));
                this.$.movieSelection.addItem(valueField);
            }
        });

        this.servicePublish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
            data: 'subtitle.metadata.movie'
        });
    },


    _currentSelectedChanged: function (data) {
        "use strict";
        if (!data || Object.keys(data).length===0) {
            //todo do not delete all subtitle information (e.g language)
            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.RESET,
                data: 'subtitle'
            });
            return;
        }
        //notify
        this.metaPublish({
            topic: 'subtitle.metadata.movie',
            data: data
        });

        // console.log('todo but not here: selectizeSubtitle.clearOptions()');
        // selectizeSubtitle.clearOptions();
    }
});