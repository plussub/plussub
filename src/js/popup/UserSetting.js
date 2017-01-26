"use strict";
$(document).ready(function () {

    var META_WRITE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);
    var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);


    var powerBtn = document.querySelector('#power');
    META_CHANNEL.subscribe({
        topic: 'user.standby',
        callback: (isStandby)=> {

            isStandby ? powerBtn.classList.remove('active') : powerBtn.classList.add('active');
            $('#power_span').text(isStandby ? ' OFF' : ' ON');
            var activeClass = "label-info";
            var inactiveClass = "label-default";
            Array.from(document.querySelectorAll('.label')).forEach((element)=> {
                element.classList.remove(isStandby ? activeClass : inactiveClass);
                element.classList.add(isStandby ? inactiveClass : activeClass);
            });
            document.querySelector('.disabledWhenPowerOff').disabled = isStandby;
        }
    });
    powerBtn.addEventListener('click', ()=> {
        META_WRITE_CHANNEL.publish({
            topic: 'user.standby',
            data: powerBtn.classList.contains('active')
        })
    });

});
