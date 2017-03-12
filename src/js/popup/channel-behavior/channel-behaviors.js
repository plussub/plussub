/**
 * Created by sonste on 28.12.2016.
 */
var tms = tms || {}; //trivial message service

if (typeof exports !== 'undefined') {
    var messageBus = require('./../../MessageBus.js');

    var srtPlayer = srtPlayer || {};
    srtPlayer.ServiceDescriptor = srtPlayer.ServiceDescriptor || require('./../../ServiceDescriptor.js').srtPlayer.ServiceDescriptor;
    exports.tms = tms;
}

tms.BaseChannelBehavior = (function () {


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
tms.Xfactory = (function(serviceChannelIdentifier,declaredSubscriptionsKey){
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

tms.ContentServiceChannelBehavior = (function () {

    var CONTENT_SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.CONTENT_SERVICE);
    return {

        ready: function () {
            var subscriptions = this.contentServiceSubscriptions ? this.contentServiceSubscriptions : [];

            this.contentServiceSubscribe = tms.BaseChannelBehavior.createSubscribeFor(CONTENT_SERVICE_CHANNEL);
            "use strict";
            tms.BaseChannelBehavior.initSubscriptions(subscriptions,
                this.contentServiceSubscribe,
                this);
        }
    };
})();
// refactor to factory method for all xxchannelbehaviors
//check other behaviors wheater they used togehter. use a unique init behavior for each
tms.FrontendServiceChannelBehavior = (function () {

    var FRONTEND_SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.FRONTEND_SERVICE);
    return {

        ready: function () {
            this._initChannelBehavior();
        },

        _initChannelBehavior:function(){
            var subscriptions = this.frontendServiceSubscriptions ? this.frontendServiceSubscriptions : [];
            this.frontendServiceSubscribe = tms.BaseChannelBehavior.createSubscribeFor(FRONTEND_SERVICE_CHANNEL);
            "use strict";
            tms.BaseChannelBehavior.initSubscriptions(subscriptions,
                this.frontendServiceSubscribe,
                this);
        }

    };
})();

tms.MetaChannelBehavior = (function () {

    var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);
    var META_WRITE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);

    return {

        ready: function () {
            "use strict";

            var subscriptions = this.metaSubscriptions ? this.metaSubscriptions : [];

            this.metaPublish = tms.BaseChannelBehavior.createPublishFor(META_WRITE_CHANNEL);
            this.metaSubscribe = tms.BaseChannelBehavior.createSubscribeFor(META_CHANNEL);
            this.metaSubscribeOnce = tms.BaseChannelBehavior.createSubscribeOnceFor(META_CHANNEL);
            this._metaWriteSubscribe = tms.BaseChannelBehavior.createSubscribeFor(META_WRITE_CHANNEL);

            tms.BaseChannelBehavior.initSubscriptions(subscriptions,
                this.metaSubscribe,
                this);

            tms.BaseChannelBehavior.initSubscriptions(subscriptions.filter(entry => entry.notifyWhenWriteOnChannel),
                this._metaWriteSubscribe,
                this);
        }

    };
})();


tms.ServiceChannelBehavior = (function () {

    var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
    return {

        ready: function () {
            "use strict";

            this.servicePublish = tms.BaseChannelBehavior.createPublishFor(SERVICE_CHANNEL);
            this.serviceSubscribe = tms.BaseChannelBehavior.createSubscribeFor(SERVICE_CHANNEL);
            this.serviceSubscribeOnce = tms.BaseChannelBehavior.createSubscribeOnceFor(SERVICE_CHANNEL);

            tms.BaseChannelBehavior.initSubscriptions( this.serviceSubscriptions ,
                this.serviceSubscribe,
                this);
        }

    };
})();