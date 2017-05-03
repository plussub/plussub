/**
 * Created by sbreitenstein on 19/01/17.
 */
Polymer({
    is: "current-loaded-subtitle-info",
    behaviors: [tms.ServiceChannelBehavior, tms.MetaChannelBehavior, tms.ChannelBasedInitializeBehavior],
    properties: {
        title: {
            type: String,
            value: '-'
        },
        type: {
            type: String,
            value: ''
        },
        currentSelectionElement: {
            type: Object,
            value: () => Object.assign({})
        }
    },
    channelBasedInit : {
        type:tms.MetaChannelBehavior,
        topic:"last_selected.entry",
    },
    listeners: {
        "refreshSubtitle": "onRefreshSubtitle",
        "resetSubtitle": "onResetSubtitle"

    },
    _channelBasedInitCallback:function(lastSelected) {
        if (!lastSelected || Object.keys(lastSelected).length===0) {
            return;
        }
        this.setInformation(lastSelected);
        this.$.paperExpansionPanel.opened=true;

    },

    onRefreshSubtitle: function (event, data) {
        this.setInformation(data);
    },

    setInformation:function(data){
        if(data.type==='selection') {
            this.title = data.subtitle.movieTitle;
            this.poster= data.movie.Poster;
            this.type="Selection";
        }
        else if(data.type==='fileinput'){
            this.title=data.title;
            this.poster=null;
            this.type="File input";

        }
    },

    onResetSubtitle: function (event, data) {
        if (!this.currentSelectionElement || this.currentSelectionElement !== data.selectionElement) {
            return;
        }

        this._reset();
    },

    manualReset:function(){
       this._reset();
    },

    _reset:function(){
        this.currentSelectionElement = null;
        this.type = '';
        this.title = '-';
        this.poster= null;
        this.servicePublish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
            data: 'last_selected'
        });
    }
});