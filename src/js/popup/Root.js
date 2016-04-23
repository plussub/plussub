$(document).ready(function () {
    "use strict";

    var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
    var CONTENT_SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.CONTENT_SERVICE);

    SERVICE_CHANNEL.publish({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH_ALL,
        data: 'user'
    });

    SERVICE_CHANNEL.publish({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH_ALL,
        data: 'subtitle'
    });

    var currentTime = $('#currentTime');
    CONTENT_SERVICE_CHANNEL.subscribe({
        topic: srtPlayer.ServiceDescriptor.CONTENT_SERVICE.VIDEO_META.PUB.TIME,
        callback: (time)=> {
            var allInSeconds = time / 1000;
            var allInMinutes = allInSeconds / 60 < 1 ? 0 : allInSeconds / 60;
            var allInHours = allInMinutes / 60 < 1 ? 0 : allInMinutes / 60;

            var format = (time)=> time < 10 ? "0" + time : time;
            var secondsPart = format(parseInt(allInSeconds % 60, 10));
            var minutesPart = format(parseInt(allInMinutes % 60, 10));
            var hoursPart = format(parseInt(allInHours, 10));
            currentTime.val(hoursPart + ':' + minutesPart + ':' + secondsPart);
        }
    });
});
