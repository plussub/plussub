/**
 * Created by sonste on 20.07.2017.
 */
HTMLImports.whenReady(function() {
    class MainDocumentElement extends Polymer.Element {

        ready(){
            srtPlayer.Redux.store.ready().then(()=>{
                let option = srtPlayer.Redux.store.getState().option;
                this.css = option.css;
                Object.assign(this.cue,option.subtitleProperties);
                // this.$.subtitlePosition.cue = null;
                // this.$.subtitlePosition.cue = this.cue;
                this.$.subtitlePosition.notifyPath('cue.position');
                this.$.subtitlePosition.notifyPath('cue.line');
                this.$.subtitlePosition.notifyPath('cue.size');
                this.$.subtitlePosition.notifyPath('cue.align');
                this.$.subtitlePosition.notifyPath('cue.vertical');


            });

            super.ready();
            // setTimeout(()=> this.$.option.load(),1000);
        }

        static get is() { return 'main-document-element'; }

        static get properties() {
            return {
                cue: {
                    type: Object,
                    value:()=> {
                        let cue = new VTTCue(0, 60, "<c.srtPlayer> value </c.srtPlayer>");
                        return Object.assign(cue,{
                            position:3,
                            line:100,
                            size:100
                        })
                    }
                },
                css: {
                    type: String,
                    value: () => {
                        var customSubtitleCss = '::cue(.srtPlayer) \
                    {\
                        background-color:green;\
                    }';
                        return css_beautify(customSubtitleCss);
                    }
                }

            }
        }
    }
    window.customElements.define(MainDocumentElement.is, MainDocumentElement);
});
