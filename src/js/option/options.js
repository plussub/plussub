$(document).ready(function () {

    var video = document.querySelector('video');
    var track = video.addTextTrack("subtitles", "srtPlayer", "en");
    var cue=new VTTCue(0,  20, "<c.srtPlayer>Lorem ipsum dolor sit amet, quo an erant</c.srtPlayer>");
    track.addCue(cue);
    track.mode='showing';

    document.querySelector("#line").addEventListener('input', (e)=>{
        cue.line = parseInt(e.target.value);
    });

    document.querySelector("#position").addEventListener('input', (e)=>{
        cue.position = parseInt(e.target.value);
    });

    document.querySelector("#size").addEventListener('input', (e)=>{
        cue.size = parseInt(e.target.value);
    });

    Array.from(document.querySelectorAll("input[type='radio'][name='alignment']"))
        .forEach(radio =>
            radio.addEventListener('click', e =>cue.align= e.target.value)
        );

    Array.from(document.querySelectorAll("input[type='radio'][name='vertical']"))
        .forEach(radio =>
            radio.addEventListener('click', e =>cue.vertical= e.target.value)
        );

    var cssContent = $('#editCSS');
    cssContent.keydown(function (e) {
        var enterKey = 13;
        if (e.keyCode === enterKey) {
            document.execCommand('insertHTML', false, '\n');
            return false;
        }
    });

    var exampleText = document.querySelector('#exampleText');
    exampleText.addEventListener('keydown',(e)=>{
        cue.text= "<c.srtPlayer>"+e.target.value+"</c.srtPlayer>";
    });


    var SERVICE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
    var META_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META);
    var META_WRITE_CHANNEL = messageBus.channel(srtPlayer.ServiceDescriptor.CHANNEL.META_WRITE);

    META_CHANNEL.subscribe({
        topic: "option.css",
        callback:(css)=>{
            cssContent.html(css_beautify(css));
        }
    });

    META_CHANNEL.subscribe({
        topic: "option.position",
        callback:(position)=>{
            Object.assign(cue,position);
            document.querySelector("#line").value=position.line;
            document.querySelector("#position").value = position.position;
            document.querySelector("#size").value=position.size;
            document.querySelector('input[type="radio"][name="alignment"][value="'+position.align+'"]').checked=true;

            if(position.vertical) {
                document.querySelector('input[type="radio"][name="vertical"][value="' + position.vertical + '"]').checked = true;
            }else{
                document.querySelector('#notVertical').checked = true;
            }

        }
    });


    SERVICE_CHANNEL.publish({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
        data: 'option.css'
    });

    SERVICE_CHANNEL.publish({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
        data: 'option.position'
    });


    var save = document.querySelector('#Save');
    save.addEventListener('click', ()=> {
        META_WRITE_CHANNEL.publish({
            topic: "option.css",
            data: cssContent.html()
        });

        var position={
            line : parseInt(document.querySelector("#line").value),
            position: parseInt(document.querySelector("#position").value),
            size:  parseInt(document.querySelector("#size").value),
            align: document.querySelector('input[type="radio"][name="alignment"]:checked').value
        };
        var selectedVertical = document.querySelector('input[type="radio"][name="vertical"]:checked');
        if(selectedVertical.id==='notVertical'){
            Object.assign(position,{vertical:undefined});
        }else{
            Object.assign(position,{vertical:selectedVertical.value});
        }

        META_WRITE_CHANNEL.publish({
            topic: "option.position",
            data: position
        });
    });

    var reset = document.querySelector('#Reset');
    reset.addEventListener('click', ()=> SERVICE_CHANNEL.publish({
        topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.RESET,
        data: 'option'
    }));

    var reset = document.querySelector('#TidyUp');
    reset.addEventListener('click', ()=>cssContent.html(css_beautify(cssContent.html())));

});



