/**
 * Created by sbreitenstein on 19/01/17.
 */
Polymer({
    is: "current-loaded-subtitle-info",
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
    listeners: {
        "refreshSubtitle": "onRefreshSubtitle",
        "resetSubtitle": "onResetSubtitle"
    },

    onRefreshSubtitle: function (event, data) {
        this.currentSelectionElement = data.selectionElement ? data.selectionElement : null;
        this.type = data.selectionElement ? data.selectionElement.simpleName : '';
        this.title = data.title ? data.title : '-';
    },

    onResetSubtitle: function (event, data) {

        if (!this.currentSelectionElement ||
            this.currentSelectionElement != data.selectionElement) {
            return;
        }
        this.currentSelectionElement = null;
        this.type = '';
        this.title = '-';
    },

    onEject:function(){
        this.fire('resetAllSubtitleSelections');
    }
});