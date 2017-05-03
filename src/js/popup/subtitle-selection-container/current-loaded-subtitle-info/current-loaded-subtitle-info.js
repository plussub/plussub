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
        if(lastSelected.type==='selection') {
            this.title = lastSelected.subtitle.movieTitle;
            this.poster= lastSelected.movie.Poster;
            this.type="Selection";
            this.$.paperExpansionPanel.opened=true;
        }
        else if(lastSelected.type==='fileinput'){
            this.title=lastSelected.filename;
            this.type="File input";
            this.poster=null;
            this.$.paperExpansionPanel.opened=true;
        }

    },

    onRefreshSubtitle: function (event, data) {
        this.currentSelectionElement = data.selectionElement ? data.selectionElement : null;
        this.type = data.selectionElement ? data.selectionElement.simpleName : '';
        this.title = data.title ? data.title : '-';
        this.poster = data.poster;
    },

    onResetSubtitle: function (event, data) {

        if (!this.currentSelectionElement ||
            this.currentSelectionElement != data.selectionElement) {
            return;
        }

        this.currentSelectionElement = null;
        this.type = '';
        this.title = '-';
        this.servicePublish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
            data: 'last_selected'
        });
    },

    manualReset:function(){
        this.servicePublish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
            data: 'last_selected'
        });
    }
});