/**
 * Created by sbreitenstein on 19/01/17.
 */
Polymer({
    is: "current-loaded-subtitle-info",
    properties:{
        title:{
            type:String,
            value:'-'
        },
        type:{
            type:String,
            value:''
        }
    },
    listeners: {
        "refreshSubtitle": "onRefreshSubtitle"
    },
    ready: function () {

    },
    onRefreshSubtitle:function(event,data){
        this.type=data.selectionElement ? data.selectionElement.simpleName : '';
        this.title=data.title ? data.title : '-';
    }
});