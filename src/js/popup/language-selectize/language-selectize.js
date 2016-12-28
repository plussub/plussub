/**
 * Created by sonste on 28.12.2016.
 */
Polymer({

    is: 'language-selectize',
    behaviors: [ServiceChannelBehavior, MetaChannelBehavior],
    properties: {
        currentSelected: {
            type: Object,
            value: () => {
            },
            observer: '_currentSelectedChanged'
        },
    },


    ready: function () {
        this.async(() => {
            this.$.languageSelection.load(iso639LanguageList);

            this.metaSubscribeOnce({
                topic: 'subtitle.language',
                callback: (language) => {
                    var languageAsString = JSON.stringify(language);
                    this.$.languageSelection.addOption(Object.assign({}, language, {valueField: languageAsString}));
                    this.$.languageSelection.addItem(languageAsString);
                }
            });

            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
                data: 'subtitle.language'
            });
        });
    },

    _currentSelectedChanged: function (language) {
        "use strict";

        if (!language || Object.keys(language).length===0) {
            //todo do not delete all subtitle information (e.g selected movie)
            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.RESET,
                data: 'subtitle'
            });
            return;
        }

        this.metaPublish({
            topic: 'subtitle.language',
            data:language
        });
    }
});