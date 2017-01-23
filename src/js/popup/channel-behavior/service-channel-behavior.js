/**
 * Created by sonste on 28.12.2016.
 */


ServiceChannelBehavior = (function () {

    var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
    return {

        ready: function () {
            "use strict";
            if (!this.serviceSubscriptions) {
                return;
            }

            this.serviceSubscriptions.forEach((entry) => {
                var sub = {
                    topic: entry.topic,
                    callback: this[entry.callback].bind(this)
                };

                this.serviceSubscribe(sub);
            });
        },

        servicePublish: function (pub) {
            "use strict";
            SERVICE_CHANNEL.publish({
                topic: pub.topic,
                data: pub.data
            });
        },

        serviceSubscribe: function (sub) {
            "use strict";
            SERVICE_CHANNEL.subscribe({
                topic: sub.topic,
                callback: (result) => sub.callback(result),
            });
        },

        serviceSubscribeOnce: function (sub) {
            "use strict";
            SERVICE_CHANNEL.subscribe({
                topic: sub.topic,
                callback: (result) => sub.callback(result),
                once: true
            });
        }

    };
})();