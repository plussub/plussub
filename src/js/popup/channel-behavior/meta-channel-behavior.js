/**
 * Created by sonste on 28.12.2016.
 */


MetaChannelBehavior = (function () {

    var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);
    var META_WRITE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);

    return {
        metaPublish: function (pub) {
            "use strict";
            META_WRITE_CHANNEL.publish({
                topic: pub.topic,
                data: pub.data
            });
        },

        metaSubscribeOnce: function (sub) {
            "use strict";
            META_CHANNEL.subscribe({
                topic: sub.topic,
                callback: (result) => sub.callback(result),
                once: true
            });
        }

    };
})();