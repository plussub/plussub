/**
 * Created by sbreitenstein on 23/01/17.
 */

Polymer({
    is: "subtitle-time-info-and-setting",
    behaviors: [ServiceChannelBehavior, MetaChannelBehavior, ContentServiceChannelBehavior, ChannelBasedInitializeBehavior],
    properties: {
        delayedSubtitle: {
            type: Number,
            value: 0,
            observer: '_delayedSubtitleChanged'
        },
        isInit: {
            type: Boolean,
            value: false
        }
    },

    channelBasedInit: {
        type: MetaChannelBehavior,
        topic: "user.play.offsetTime",
    },
    contentServiceSubscriptions: [
        {
            topic: srtPlayer.ServiceDescriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME,
            callback: "onVideoTimeUpdate"
        }
    ],
    _channelBasedInitCallback: function (delayedSubtitle) {
        this.delayedSubtitle = delayedSubtitle;
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
      this.delayedSubtitle=0;
    },

    _normalize: function (unit) {
        return unit < 10 ? "0" + unit : unit.toString();
    },

    _delayedSubtitleChanged: function (newVal) {
        if (!this.isInit) {
            return;
        }
        this.debounce('_offsetChanged', () =>
            this.metaPublish({
                topic: 'user.play.offsetTime',
                data: parseInt(newVal, 10)
            })
        );
    }
});