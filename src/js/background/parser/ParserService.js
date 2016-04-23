/**
 * Created by sonste on 07.02.2016.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.ServiceDescriptor = require('./../../ServiceDescriptor.js').srtPlayer.ServiceDescriptor;
}


srtPlayer.ParserService = srtPlayer.ParserService || ((messageBusLocal = messageBus)=> {
        var console = srtPlayer.LogService.getLoggerFor(srtPlayer.ServiceDescriptor.BACKEND_SERVICE.PARSER.NAME);

        var SERVICE_CHANNEL = messageBusLocal.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        var META_WRITE_CHANNEL = messageBusLocal.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);
        var SERVICE_CONST = srtPlayer.ServiceDescriptor.BACKEND_SERVICE.PARSER;
        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.PARSE,
            callback: (data)=> {
                if (data.type !== 'srt') {
                    console.error("unknown subtitle type: %s", data.type);
                    throw 'unknown type';
                }
                var result = srtPlayer.SRTParser().parse(data.raw);
                console.log('subtitle parsed');

                META_WRITE_CHANNEL.publish({
                    topic: 'subtitle.parsedSubtitle',
                    data:JSON.stringify(result)
                });

                META_WRITE_CHANNEL.publish({
                    topic: 'subtitle.isParsed',
                    data:true
                });
            }
        });

    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.ParserService === 'function') {
    srtPlayer.ParserService = srtPlayer.ParserService();
}