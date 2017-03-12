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

//unified_Factory
var x_factory = (function(serviceChannelIdentifier,declaredSubscriptionsKey){
    var CHANNEL = messageBus.channel(serviceChannelIdentifier);
    return {
        ready: function () {
            var subscriptions = this[declaredSubscriptionsKey] ? this[declaredSubscriptionsKey] : [];
            this[declaredSubscriptionsKey+"subscribe oder so"] = BaseChannelBehavior.createSubscribeFor(CHANNEL);
            "use strict";
            BaseChannelBehavior.initSubscriptions(subscriptions,
                this[declaredSubscriptionsKey+"subscribe oder so"],
                this);

        }

    };
});

ContentServiceChannelBehavior = (function () {

    var CONTENT_SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.CONTENT_SERVICE);
    return {

        ready: function () {
            var subscriptions = this.contentServiceSubscriptions ? this.contentServiceSubscriptions : [];

            this.contentServiceSubscribe = BaseChannelBehavior.createSubscribeFor(CONTENT_SERVICE_CHANNEL);
            "use strict";
            BaseChannelBehavior.initSubscriptions(subscriptions,
                this.contentServiceSubscribe,
                this);
        }
    };
})();
// refactor to factory method for all xxchannelbehaviors
//check other behaviors wheater they used togehter. use a unique init behavior for each
FrontendServiceChannelBehavior = (function () {

    var FRONTEND_SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.FRONTEND_SERVICE);
    return {

        ready: function () {
            this._initChannelBehavior();
        },

        _initChannelBehavior:function(){
            var subscriptions = this.frontendServiceSubscriptions ? this.frontendServiceSubscriptions : [];
            this.frontendServiceSubscribe = BaseChannelBehavior.createSubscribeFor(FRONTEND_SERVICE_CHANNEL);
            "use strict";
            BaseChannelBehavior.initSubscriptions(subscriptions,
                this.frontendServiceSubscribe,
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

            this.servicePublish = BaseChannelBehavior.createPublishFor(SERVICE_CHANNEL);
            this.serviceSubscribe = BaseChannelBehavior.createSubscribeFor(SERVICE_CHANNEL);
            this.serviceSubscribeOnce = BaseChannelBehavior.createSubscribeOnceFor(SERVICE_CHANNEL);

            BaseChannelBehavior.initSubscriptions( this.serviceSubscriptions ,
                this.serviceSubscribe,
                this);
        }

    };
})();