/**
 * Created by sbreitenstein on 19/01/17.
 */
Polymer({
    is: "current-loaded-subtitle-info",
    properties:{
        title:{
            type:String,
            value:'Pulp fiction.srt'
        },
        type:{
            type:String,
            value:'File'
        }
    },
    listeners: {
        "refreshSubtitle": "onRefreshSubtitle"
    },
    ready: function () {

    },
    onRefreshSubtitle:function(event,data){
        console.log(data);

       // this.type=data.selectionTypeSimpleName;
    }
});