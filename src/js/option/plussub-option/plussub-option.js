class PlussubOptionElement extends Polymer.mixinBehaviors([tms.MetaChannelBehavior, tms.ServiceChannelBehavior], Polymer.Element) {
    static get is() {
        return "plussub-option";
    }

    ready() {
//workaround: we need this before ready is done
        tms.MetaChannelBehavior.ready.apply(this);
        tms.ServiceChannelBehavior.ready.apply(this);

        let cssPromise = new Promise((resolve) => {
                this.metaSubscribeOnce({
                    topic: "option.css",
                    callback: (css) => resolve(css)
                });

                this.servicePublish({
                    topic: srtPlayer.Descriptor.SERVICE.META.SUB.PUBLISH,
                    data: 'option.position'
                });
            }
        );

        let positionPromise = new Promise((resolve) => {
            this.metaSubscribeOnce({
                topic: "option.position",
                callback: (position) => resolve(position)
            });

            this.servicePublish({
                topic: srtPlayer.Descriptor.SERVICE.META.SUB.PUBLISH,
                data: 'option.css'
            });
        });

        Promise.all(Array.of(cssPromise, positionPromise)).then((values) => {
            let [cssResult, positionResult] = values;
            Object.assign(this.cue, positionResult);
            this.css = css_beautify(cssResult);

            super.ready()
        });
    }

    static get properties() {
        return {
            cue: {
                type: Object,
                value: new VTTCue(0, 20, "<c.srtPlayer> value </c.srtPlayer>")
            },
            css: {
                type: String,
                value: () => {
                    var customSubtitleCss = '::cue(.srtPlayer) \
                    {\
                        background-color:yellow;\
                    }';
                    return css_beautify(customSubtitleCss);
                }
            }
        }
    }

    save() {

        this.metaPublish({
            topic: "option.position",
            data: {
                line: this.cue.line,
                position: this.cue.position,
                size: this.cue.size,
                align: this.cue.align,
                vertical: this.cue.vertical
            }
        });

        this.metaPublish({
            topic: "option.css",
            data: this.css
        });

        setTimeout(()=>location.reload(),500);

    }

    reset(){
        this.servicePublish({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.RESET,
            data: 'option'
        });

        setTimeout(()=>location.reload(),500);
    }

}
customElements.define(PlussubOptionElement.is, PlussubOptionElement);
