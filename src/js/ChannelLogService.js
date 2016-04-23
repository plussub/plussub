var srtPlayer = srtPlayer || {};

if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    srtPlayer.messageBus = messageBus;
    srtPlayer.ServiceDescriptor = require('./ServiceDescriptor.js').srtPlayer.ServiceDescriptor;
}


srtPlayer.ChannelLogService = srtPlayer.ChannelLogService || (()=> {
        "use strict";

        var console = srtPlayer.LogService.getLoggerFor(srtPlayer.ServiceDescriptor.GENERAL_SERVICE.CHANNEL_LOG_SERVICE.NAME);
        var logChannels = [
            //messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META),
            //messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE),
            //messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE)
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