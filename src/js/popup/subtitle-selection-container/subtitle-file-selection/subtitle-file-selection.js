Polymer({
    is: 'subtitle-file-selection',
    properties: {
        simpleName: {
            type: String,
            value: 'File Selection'
        }
    },
    behaviors: [ServiceChannelBehavior,MetaChannelBehavior, SubtitleSelectionBehavior],

    ready: function () {
        this.metaSubscribeOnce({
            topic: 'selected_subtitle_file.entry',
            callback: (fileMeta) => {

                if (!fileMeta || Object.keys(fileMeta).length === 0) {
                    this.reset();
                    return;
                }

                this.fire('refreshSubtitle', {
                    selectionElement: this,
                    title: fileMeta.filename
                });
            }
        });

        this.servicePublish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
            data: 'selected_subtitle_file.entry'
        });
    },

    reset: function () {
        var form = document.createElement('form');
        Polymer.dom(form).appendChild(this.$.fileInput);
        form.reset();
        Polymer.dom(this.$.container).appendChild(this.$.fileInput);

        this.servicePublish({
            topic: srtPlayer.ServiceDescriptor.BACKEND_SERVICE.META.SUB.FULL_TOPIC_RESET,
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
                selectionElement: this,
                title: filename
            });

            //notify
            this.metaPublish({
                topic: 'selected_subtitle_file.entry',
                data: {
                    filename:filename
                }
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