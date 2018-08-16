/**
 * Created by stefa on 19.03.2017.
 */

class PreviewVideoElement extends Polymer.Element {
    static get is() {
        return "preview-video";
    }

    ready() {
        super.ready();
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
                value: new VTTCue(0, 60, "<c.srtPlayer> Lorem ipsum dolor sit amet, quo an erant </c.srtPlayer>"),
                observer: 'cueChange'
            },

            css: {
                type: String,
                observer: 'cssChange'
            },

            _constCss: {
                type: String,
                value: `video{
                            align-self:center;
                      }
                      #exampleVideo{
                        width:calc(100vw*0.33);
                      }`
            }
        }
    }
    static get observers() {
        return [
            'cuePropertyChange(cue.*)'
        ]
    }

    previewTextChange(newValue) {
        this.cue.text = `<c.srtPlayer> ${newValue} </c.srtPlayer>`;
    }

     cueChange(newCue) {
        //use removeCue fn instead new texttracks
        Array.from(this.$.exampleVideo.textTracks).filter(e=>e.label.startsWith("srtPlayer")).forEach(track => track.mode="hidden");
        let track = this.$.exampleVideo.addTextTrack("subtitles", `srtPlayer ${parseInt(Math.random()*100)}`, "en");
        track.addCue(newCue);
        track.mode = 'showing';
    }

    cuePropertyChange(cue){
        Object.assign(this.cue,cue.base);
    }

    
    cssChange(css) {
        this.shadowRoot.querySelector('style').childNodes[0].nodeValue = this._constCss + ' ' + css;
    }
}
customElements.define(PreviewVideoElement.is, PreviewVideoElement);
