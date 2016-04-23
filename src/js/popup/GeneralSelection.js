/**
 * Created by sonste on 27.02.2016.
 */
$(document).ready(function () {
    "use strict";

    var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
    var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);

    var currentLoadedInfo = $('#currentLoadedInfo');
    META_CHANNEL.subscribe({
        topic: 'subtitle.title',
        callback: (title)=> currentLoadedInfo.html(title === '' ? '-' : 'Current loaded: ' + title)
    });

    var ejectBtn = document.querySelector('#eject');
    ejectBtn.addEventListener('click', ()=> SERVICE_CHANNEL.publish({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.RESET,
        data: 'subtitle'
    }));

//prevent pane from shrinking
    setTimeout(()=> {
        $('#viaFile.tab-pane').css('height', $('#viaInput.tab-pane').css('height'));
    },100);
});

