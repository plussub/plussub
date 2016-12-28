/**
 * Created by sonste on 28.12.2016.
 */
Polymer({

    is: 'subtitle-selectize',
    behaviors: [ServiceChannelBehavior, MetaChannelBehavior],
    properties: {
        currentSelected: {
            type: Object,
            value: () => {
            },
            observer: '_currentSelectedChanged'
        },
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
                data: 'subtitle.language'
            });
        });
    },

    _currentSelectedChanged: function (data) {
        "use strict";
        console.log(data);
    },

    movieChanged: function (movieMeta) {
        console.log(movieMeta);
    },

    languageChanged:function(language){
        console.log(language);
    }
});