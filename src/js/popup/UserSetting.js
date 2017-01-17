"use strict";
$(document).ready(function () {

    // var META_WRITE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);
    // var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);
    //
    // var offsetTime = document.querySelector('#offsetTime');
    // var oldValue=0;
    // META_CHANNEL.subscribe({
    //     topic: 'user.play.offsetTime',
    //     callback: (data)=>{
    //         if(parseInt(offsetTime.value,10)!== data){
    //             offsetTime.value=data;
    //             oldValue=data;
    //         }
    //     }
    // });
    // $( offsetTime ).keyup(()=> {
    //     if(oldValue !== parseInt(offsetTime.value, 10)){
    //         META_WRITE_CHANNEL.publish({
    //             topic: 'user.play.offsetTime',
    //             data: parseInt(offsetTime.value, 10)
    //         });
    //     }
    // });
    //
    // var powerBtn = document.querySelector('#power');
    // META_CHANNEL.subscribe({
    //     topic: 'user.standby',
    //     callback: (isStandby)=> {
    //
    //         isStandby ? powerBtn.classList.remove('active') : powerBtn.classList.add('active');
    //         $('#power_span').text(isStandby ? ' OFF' : ' ON');
    //         var activeClass = "label-info";
    //         var inactiveClass = "label-default";
    //         Array.from(document.querySelectorAll('.label')).forEach((element)=> {
    //             element.classList.remove(isStandby ? activeClass : inactiveClass);
    //             element.classList.add(isStandby ? inactiveClass : activeClass);
    //         });
    //         document.querySelector('.disabledWhenPowerOff').disabled = isStandby;
    //     }
    // });
    // powerBtn.addEventListener('click', ()=> {
    //     META_WRITE_CHANNEL.publish({
    //         topic: 'user.standby',
    //         data: powerBtn.classList.contains('active')
    //     })
    // });
    //
    // document.querySelector('#option').addEventListener('click', ()=> chrome.tabs.create({url: "html/options.html"}));
    // $('[data-toggle="tooltip"]').tooltip();

});
