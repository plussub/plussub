/**
 * Created by stefa on 19.03.2017.
 */

class PreviewVideoElement extends Polymer.Element {
    static get is() {
        return "preview-video";
    }

    static get properties() {
        return {
            previewText: {
                type: String,
                value: "Lorem ipsum dolor sit amet, quo an erant",
                observer: 'previewTextChange'
            },

            cue: {
                type: Object,
                value: new VTTCue(0, 20, "<c.srtPlayer> Lorem ipsum dolor sit amet, quo an erant </c.srtPlayer>"),
                observer: 'cueChange'
            },

            css: {
                type: String,
                observer: 'cssChange'
            },

            _constCss: {
                type: String,
                value: ':host{ \
                        display:flex;flex-direction:column;\
                      } \
                      \
                      h1{\
                        width:100%;\
                        min-height:50px;\
                        text-align:center;\
                        color:var(--text-primary-color);\
                        background-color:var(--default-primary-color);\
                      } \
                      \
                      video{\
                        align-self:center;\
                      } \
                      \
                      #exampleVideo{\
                        width:calc(100vw*0.33);\
                        \
                      }'
            }
        }
    }

    ready() {
        super.ready();
    }

    previewTextChange(newValue) {
        this.cue.text = "<c.srtPlayer>" + newValue + "</c.srtPlayer>";
    }

    cueChange(newCue) {
        let track = this.$.exampleVideo.addTextTrack("subtitles", "srtPlayer", "en");
        track.addCue(newCue);
        track.mode = 'showing';
    }

    cssChange(css) {
        this.shadowRoot.querySelector('style').childNodes[0].nodeValue = this._constCss + ' ' + css;
    }
}
customElements.define(PreviewVideoElement.is, PreviewVideoElement);
