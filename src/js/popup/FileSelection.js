$(document).ready(function () {
    var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
    var META_WRITE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);

    document.querySelector('#srtInputDelegate').addEventListener('click', ()=>$('#srtInput').trigger('click'));
    $('#srtInput').change(loadFile);

    SERVICE_CHANNEL.subscribe({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.RESET,
        callback: (data)=> {
            if (data === 'subtitle') {
                $('#srtInput').replaceWith($('#srtInput').clone());
                $('#srtInput').change(loadFile);
            }
        }
    });

    function loadFile() {
        var reader = new FileReader();
        reader.readAsText($('#srtInput').get(0).files[0]);
        reader.onload = function (file) {
            var filename = $('#srtInput').get(0).files[0].name;
            SERVICE_CHANNEL.publish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.RESET,
                data: 'subtitle'
            });
            //workaround, race condition with meta.sub.reset
            setTimeout(()=> {
                SERVICE_CHANNEL.publish({
                    topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.PARSER.SUB.PARSE,
                    data: {
                        type: 'srt',
                        raw: reader.result
                    }
                });

                META_WRITE_CHANNEL.publish({
                    topic: 'subtitle.title',
                    data: filename
                });
            },300);
        };
    }
});