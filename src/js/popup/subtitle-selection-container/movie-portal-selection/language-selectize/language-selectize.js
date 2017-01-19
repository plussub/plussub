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
                topic: 'selected_subtitle_language.entry',
                callback: (language) => {
                    var languageAsString = JSON.stringify(language);
                    this.$.languageSelection.addOption(Object.assign({}, language, {valueField: languageAsString}));
                    this.$.languageSelection.addItem(languageAsString);
                }
            });

            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
                data: 'selected_subtitle_language.entry'
            });
        });
    },

    _currentSelectedChanged: function (language) {
        "use strict";

        if (!language || Object.keys(language).length===0) {
            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.FULL_TOPIC_RESET,
                data: 'selected_subtitle_language'
            });
            return;
        }

        this.metaPublish({
            topic: 'selected_subtitle_language.entry',
            data:language
        });
    }
});