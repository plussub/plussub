/**
 * Created by stefa on 06.03.2017.
 */
Polymer({
    is: "notification-service",
    behaviors: [tms.ServiceChannelBehavior],
    properties: {
        _placeholderMessage: {
            type: String,
            value: '<placeholder>'
        },
        _currentMessage: {
            type: String,
            value: 'intial'
        },
        duration:{
            type: Number,
            value:3000
        }
    },
    listeners:{
        "iron-overlay-closed":"onToastClose"
    },
    serviceSubscriptions: [
        {
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.NOTIFICATION.SUB.NOTIFY,
            callback: "onNotify"
        }
    ],

    ready: function () {
        this._currentMessage = this._placeholderMessage;
    },

    onNotify:function(payload){
      this._currentMessage= payload.msg;
      this.$.toast.show();
    },

    onToastClose:function(){
        this._currentMessage = this._placeholderMessage;
    }
});