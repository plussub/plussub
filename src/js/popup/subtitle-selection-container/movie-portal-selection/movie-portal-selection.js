/**
 * Created by sbreitenstein on 19/01/17.
 */

Polymer({
    is: 'movie-portal-selection',
    behaviors: [SubtitleSelectionBehavior],
    properties:{
      simpleName:{
          type:String,
          value:'Movie Portal Selection'
      }
    },
    listeners:{
        "refreshSubtitle":"onRefreshSubtitle"
    },
    //retargeting selectionType
    onRefreshSubtitle:function(event,data){
        Object.assign(data,{selectionElement:this});
    },

    reset(){
        this.$.movieSelectize.currentSelected=null;
        this.$.subtitleSelectize.currentSelected=null;
    }
});