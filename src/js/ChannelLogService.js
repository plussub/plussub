var srtPlayer = srtPlayer || {};

if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.messageBus = messageBus;
    srtPlayer.Descriptor = require('./Descriptor.js').srtPlayer.Descriptor;
}


srtPlayer.ChannelLogService = srtPlayer.ChannelLogService || (()=> {
        "use strict";

        var console = srtPlayer.LogService.getLoggerFor(srtPlayer.Descriptor.GENERAL_SERVICE.CHANNEL_LOG_SERVICE.NAME);
        var logChannels = [
            //messageBus.channel(srtPlayer.Descriptor.CHANNEL.META),
            //messageBus.channel(srtPlayer.Descriptor.CHANNEL.META_WRITE),
            //messageBus.channel(srtPlayer.Descriptor.CHANNEL.SERVICE)
        ];

        logChannels.forEach(channel=>
            channel.subscribe({
                topic: '#',
                callback: (data, envelope)=>console.log(envelope)
            })
        );

    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.ChannelLogService === 'function') {
    srtPlayer.ChannelLogService = srtPlayer.ChannelLogService();
}