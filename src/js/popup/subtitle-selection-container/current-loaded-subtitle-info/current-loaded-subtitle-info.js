/**
 * Created by sbreitenstein on 19/01/17.
 */
Polymer({
    is: "current-loaded-subtitle-info",
    properties:{
        type:{
            type:String,
            value:'-'
        }
    },
    listeners: {
        "refreshSubtitle": "onRefreshSubtitle"
    },
    ready: function () {

    },
    onRefreshSubtitle:function(event,data){
        console.log(data);

        this.type=data.selectionTypeSimpleName;
    }
});