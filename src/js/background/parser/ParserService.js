/**
 * Created by sonste on 07.02.2016.
 */
var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.Descriptor = require('./../../Descriptor.js').srtPlayer.Descriptor;
}


srtPlayer.ParserService = srtPlayer.ParserService || ((messageBusLocal = messageBus) => {
        //  var console = srtPlayer.LogService.getLoggerFor(srtPlayer.Descriptor.SERVICE.PARSER.NAME);

        var SERVICE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.SERVICE);
        var META_WRITE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.META_WRITE);
        var META_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.META);

        var SERVICE_CONST = srtPlayer.Descriptor.SERVICE.PARSER;
        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.PARSE,
            callback: (data) => {
                if (data.type !== 'srt') {
                    console.error("unknown subtitle type: %s", data.type);
                    throw 'unknown type';
                }
                var result = srtPlayer.SRTParser().parse(data.raw);

                META_WRITE_CHANNEL.publish({
                    topic: 'parsed_subtitle.parsedSubtitle',
                    data: JSON.stringify(result)
                });

                META_WRITE_CHANNEL.publish({
                    topic: 'parsed_subtitle.isParsed',
                    data: true
                });
            }
        });


        SERVICE_CHANNEL.subscribe({
            topic: SERVICE_CONST.SUB.RESET,
            callback: () => {
                SERVICE_CHANNEL.publish({
                    topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
                    data: 'parsed_subtitle'
                });
            }
        });

    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.ParserService === 'function') {
    srtPlayer.ParserService = srtPlayer.ParserService();
}