/**
 * Created by sonste on 28.12.2016.
 */

BaseChannelBehavior = (function () {


    return {
        initSubscriptions: function (listOfSubscriptions, registerFn, ctx) {
            if (!listOfSubscriptions) {
                return;
            }

            listOfSubscriptions.forEach((entry) => {
                var sub = {
                    topic: entry.topic,
                    callback: ctx[entry.callback].bind(ctx)
                };
                registerFn(sub);
            });
        },

        createPublishFor: function (channel) {
            return (pub) => {
                channel.publish({
                    topic: pub.topic,
                    data: pub.data
                });
            };
        },

        createSubscribeFor: function (channel) {
            return (sub) => {
                channel.subscribe({
                    topic: sub.topic,
                    callback: (result) => sub.callback(result)
                });
            };
        },

        createSubscribeOnceFor: function (channel) {
            return (sub) => {
                channel.subscribe({
                    topic: sub.topic,
                    callback: (result) => sub.callback(result),
                    once: true
                });
            }
        },
    }
})();


ContentServiceChannelBehavior = (function () {

    var CONTENT_SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.CONTENT_SERVICE);
    return {

        ready: function () {

            this.contentServiceSubscribe = BaseChannelBehavior.createSubscribeFor(CONTENT_SERVICE_CHANNEL);
            "use strict";
            BaseChannelBehavior.initSubscriptions(this.contentServiceSubscriptions,
                this.contentServiceSubscribe,
                this);
        }

    };
})();

MetaChannelBehavior = (function () {

    var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);
    var META_WRITE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);

    return {

        ready: function () {
            "use strict";

            var subscriptions = this.metaSubscriptions ? this.metaSubscriptions : [];

            this.metaPublish = BaseChannelBehavior.createPublishFor(META_WRITE_CHANNEL);
            this.metaSubscribe = BaseChannelBehavior.createSubscribeFor(META_CHANNEL);
            this.metaSubscribeOnce = BaseChannelBehavior.createSubscribeOnceFor(META_CHANNEL);
            this._metaWriteSubscribe = BaseChannelBehavior.createSubscribeFor(META_WRITE_CHANNEL);

            BaseChannelBehavior.initSubscriptions(subscriptions,
                this.metaSubscribe,
                this);

            BaseChannelBehavior.initSubscriptions(subscriptions.filter(entry => entry.notifyWhenWriteOnChannel),
                this._metaWriteSubscribe,
                this);
        }

    };
})();


ServiceChannelBehavior = (function () {

    var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
    return {

        ready: function () {
            "use strict";


            console.log(this);
            var subscriptions = this.serviceSubscriptions ? this.serviceSubscriptions : [];

            this.servicePublish = BaseChannelBehavior.createPublishFor(SERVICE_CHANNEL);
            this.serviceSubscribe = BaseChannelBehavior.createSubscribeFor(SERVICE_CHANNEL);
            this.serviceSubscribeOnce = BaseChannelBehavior.createSubscribeOnceFor(SERVICE_CHANNEL);

            BaseChannelBehavior.initSubscriptions(subscriptions,
                this.serviceSubscribe,
                this);
        }

    };
})();