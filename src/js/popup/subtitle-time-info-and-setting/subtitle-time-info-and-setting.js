/**
 * Created by sbreitenstein on 23/01/17.
 */

Polymer({
    is: "subtitle-time-info-and-setting",
    behaviors: [tms.ServiceChannelBehavior,
        tms.MetaChannelBehavior,
        tms.ContentServiceChannelBehavior,
        tms.ChannelBasedInitializeBehavior
    ],
    properties: {
        delay: {
            type: Number,
            value: 0,
            observer: '_delayChanged'
        },
        isInit: {
            type: Boolean,
            value: false
        }
    },

    channelBasedInit: {
        type: tms.MetaChannelBehavior,
        topic: "user.play.offsetTime",
    },
    contentServiceSubscriptions: [
        {
            topic: srtPlayer.Descriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME,
            callback: "onVideoTimeUpdate"
        }
    ],
    _channelBasedInitCallback: function (delay) {
        this.$.scheduling.selected=delay>=0? "behind" :"ahead";
        this.delay = Math.abs(delay);
        this.isInit = true;
    },

    onVideoTimeUpdate: function (time) {
        var currentVideoPoint = moment.duration(time);


        this.$.current.value = this._normalize(currentVideoPoint.hours())
            + ':'
            + this._normalize(currentVideoPoint.minutes())
            + ':'
            + this._normalize(currentVideoPoint.seconds());
    },

    clear:function(){
      this.delay=0;
    },

    _normalize: function (unit) {
        return unit < 10 ? "0" + unit : unit.toString();
    },

    _delayChanged: function (newVal) {
        if (!this.isInit) {
            return;
        }
        this.debounce('_offsetChanged', () => {

                var multi = this.$.scheduling.selected === 'behind' ? 1 : -1;
                this.metaPublish({
                    topic: 'user.play.offsetTime',
                    data: multi * parseInt(newVal, 10)
                });
            }
        );
    }
});