/**
 * Created by sonste on 20.07.2017.
 */
HTMLImports.whenReady(function() {
    class MainDocumentElement extends Polymer.Element {

        ready(){
            super.ready();
            setTimeout(()=> this.$.option.load(),0);
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
