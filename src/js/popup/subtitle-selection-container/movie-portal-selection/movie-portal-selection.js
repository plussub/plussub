/**
 * Created by sbreitenstein on 19/01/17.
 */

Polymer({
    is: 'movie-portal-selection',
    behaviors: [SubtitleSelectionBehavior],
    listeners:{
        "refreshSubtitle":"onRefreshSubtitle"
    },

    //retargeting selectionType
    onRefreshSubtitle:function(event,data){
        Object.assign(data,{selectionType:this});
    },

    reset(){
        this.$.movieSelectize.currentSelected=null;
        this.$.subtitleSelectize.currentSelected=null;
    }
});