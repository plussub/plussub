Polymer({
    is: 'subtitle-file-selection',
    properties: {
        simpleName: {
            type: String,
            value: 'File Selection'
        }
    },
    behaviors: [tms.ServiceChannelBehavior,
        tms.MetaChannelBehavior,
        tms.ChannelBasedInitializeBehavior,
        SubtitleSelectionBehavior
    ],
    channelBasedInit : {
        type:tms.MetaChannelBehavior,
        topic:"selected_subtitle_file.entry",
    },

    _channelBasedInitCallback:function(fileMeta){
        if (!fileMeta || Object.keys(fileMeta).length === 0) {
            this.reset();
            return;
        }

        this.fire('refreshSubtitle', {
            selectionElement: this,
            title: fileMeta.filename
        });
    },
    
    reset: function () {
        var form = document.createElement('form');
        Polymer.dom(form).appendChild(this.$.fileInput);
        form.reset();
        Polymer.dom(this.$.container).appendChild(this.$.fileInput);

        this.servicePublish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
            data: 'selected_subtitle_file'
        });

        this.fire('resetSubtitle',{
            selectionElement: this
        });
    },

    fileSelected: function () {

        var reader = new FileReader();
        reader.readAsText(this.$.fileInput.inputElement.files[0]);
        reader.onload = (file) => {
            var filename =this.$.fileInput.inputElement.files[0].name;

            this.fire('refreshSubtitle', {
                title:filename,
                type:"fileinput"
            });

            //notify
            this.metaPublish({
                topic: 'selected_subtitle_file.entry',
                data: {
                    filename:filename
                }
            });

            this.metaPublish({
                topic: 'last_selected.entry',
                data: {
                    title:filename,
                    type:"fileinput"
                }
            });

            this.servicePublish({
                topic: srtPlayer.Descriptor.SERVICE.PARSER.SUB.PARSE,
                data: {
                    type: 'srt',
                    raw: reader.result
                }
            });
        };
    }
});