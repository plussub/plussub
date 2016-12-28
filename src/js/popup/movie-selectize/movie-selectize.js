/**
 * Created by sonste on 27.12.2016.
 */
Polymer({

    is: 'movie-selectize',

    properties: {
        currentSelected:{
            type:Object,
            value:()=>{},
            observer: '_currentSelectedChanged'
        },
    },

    _computeLoadFn:function(){
        return this.load;
    },

    load: function (query, fn) {
        "use strict";
        if (!query.length) {
            return fn();
        }

        this.clearOptions();


        var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);

        SERVICE_CHANNEL.publish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE.SUB.SEARCH,
            data: query
        });

        SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE.PUB.SEARCH_RESULT,
            callback: (result) => fn(result),
            once: true
        });
    },

    ready: function () {


        let SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        let META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);

        //set initial
        META_CHANNEL.subscribe({
            topic: 'subtitle.metadata.movie',
            callback: (data)=> {
                if(!data){
                    this.$.movieSelection.clearOptions();
                    return;
                }

                var valueField = JSON.stringify(data);
                this.$.movieSelection.addOption(Object.assign({}, data, {valueField: valueField}));
                this.$.movieSelection.addItem(valueField);
            },
            once:true
        });

        SERVICE_CHANNEL.publish({
            topic:srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
            data:'subtitle.metadata.movie'
        });

        console.log("ready movie");
    },


    _currentSelectedChanged: function (data) {
        "use strict";
        //todo löschen der eingabe geht noch nicht so ganz
        console.log(data);
        if (!data) {
            return;
        }
        //notify

        var META_WRITE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);

        META_WRITE_CHANNEL.publish({
            topic: 'subtitle.metadata.movie',
            data: data
        });

        // console.log('todo but not here: selectizeSubtitle.clearOptions()');
        // selectizeSubtitle.clearOptions();
    }
});