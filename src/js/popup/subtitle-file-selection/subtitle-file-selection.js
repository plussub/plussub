
Polymer({
    is: 'subtitle-file-selection',


    reset:function(){
        var form = document.createElement('form');
        Polymer.dom(form).appendChild(this.$.fileInput);
        form.reset();
        Polymer.dom(this.$.container).appendChild(this.$.fileInput);
    },

    fileSelected:function(){

        var reader = new FileReader();
        reader.readAsText(this.$.fileInput.inputElement.files[0]);
        reader.onload = (file)=> {

            var filename =this.$.fileInput.inputElement.files[0].name;
            console.warn(filename);
            // SERVICE_CHANNEL.publish({
            //     topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.RESET,
            //     data: 'subtitle'
            // });
            // //workaround, race condition with meta.sub.reset
            // setTimeout(()=> {
            //     SERVICE_CHANNEL.publish({
            //         topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.PARSER.SUB.PARSE,
            //         data: {
            //             type: 'srt',
            //             raw: reader.result
            //         }
            //     });
            //
            //     META_WRITE_CHANNEL.publish({
            //         topic: 'subtitle.title',
            //         data: filename
            //     });
            // },300);
        };
    }
});