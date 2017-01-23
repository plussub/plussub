/**
 * Created by sbreitenstein on 23/01/17.
 */
/**
 * Created by sonste on 28.12.2016.
 */


ChannelBasedInitializeBehavior = (function () {

    return {
        ready: function () {
            if (!this.channelBasedInit) {
                console.warn("ChannelBasedInitializeBehavior declared but channelBasedInit is missing ");
                return;
            }

            if (!this._channelBasedInitCallback) {
                throw "channelBasedInitFn is missing";
            }

            if (this.channelBasedInit.type === MetaChannelBehavior) {
                this._initializeWithMetaChannel();
                return;
            }

            console.warn("unkown type")
        },

        _initializeWithMetaChannel: function () {
            if (!this.metaSubscribeOnce) {
                throw "metaSubscribeOnce is missing. Is MetaChannelBehavior declared?"
            }


            this.metaSubscribeOnce({
                topic: this.channelBasedInit.topic,
                callback: this._channelBasedInitCallback.bind(this)
            });

            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
                data: this.channelBasedInit.topic
            });


        }

    };
})();