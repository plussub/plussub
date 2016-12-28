/**
 * Created by sonste on 28.12.2016.
 */


ServiceChannelBehavior = (function () {

    var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
    return {
        servicePublish: function (pub) {
            "use strict";
            SERVICE_CHANNEL.publish({
                topic: pub.topic,
                data: pub.data
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