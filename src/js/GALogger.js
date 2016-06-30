/**
 * Created by sonste on 30.06.2016.
 */

var srtPlayer = srtPlayer || {};
srtPlayer.GALogger = srtPlayer.GALogger || (()=> {

        var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);

        var enableReport = true;

        window.addEventListener('error', e => {
            if(!enableReport){
                return;
            }
            console.warn("send");
            ga('send', 'event', {
                eventCategory: 'error',
                eventAction: 'background',
                eventLabel: e.message + " in " + e.filename + ':  ' + e.lineno
            }, {
                nonInteraction: true
            });
        });

        SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.PUB.READY,
            callback: result => {
                META_CHANNEL.subscribe({
                    topic: "option.errorReport",
                    callback: (result)=>enableReport=result
                });

                SERVICE_CHANNEL.publish({
                    topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
                    data: 'option.errorReport'
                });
            }
        });


    });


//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.GALogger === 'function') {
    srtPlayer.GALogger = srtPlayer.GALogger();
}