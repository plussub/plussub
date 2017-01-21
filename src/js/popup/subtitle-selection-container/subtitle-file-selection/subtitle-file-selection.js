
Polymer({
    is: 'subtitle-file-selection',
    properties:{
        simpleName:{
            type:String,
            value:'File Selection'
        }
    },
    behaviors: [ServiceChannelBehavior,SubtitleSelectionBehavior],

    reset:function(){
        var form = document.createElement('form');
        Polymer.dom(form).appendChild(this.$.fileInput);
        form.reset();
        Polymer.dom(this.$.container).appendChild(this.$.fileInput);
    },

    fileSelected:function(){

        var reader = new FileReader();
        reader.readAsText(this.$.fileInput.inputElement.files[0]);
        reader.onload = (file) => {

            var filename =this.$.fileInput.inputElement.files[0].name;
            console.warn(this.$.fileInput.inputElement.files[0]);

            this.fire('refreshSubtitle', {
                selectionElement:this,
                title:filename
            });

            this.servicePublish({
                topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.PARSER.SUB.PARSE,
                data: {
                    type: 'srt',
                    raw: reader.result
                }
            });
        };
    }
});