/**
 * Created by stefa on 19.03.2017.
 */

class SubtitlePositioningElement extends Polymer.Element {
    static get is() {
        return "subtitle-positioning";
    }

    static get properties() {
        return {
            _linePosition:{
                type:Number,
                value:-2,
                observer:'_linePositionChanged'
            },
            _horizontalPosition:{
                type:Number,
                value:50,
                observer:'_horizontalPositionChanged'
            },
            _size:{
                type:Number,
                value:100,
                observer:'_sizeChanged'
            },
            cue: {
                type: Object,
                value: new VTTCue(0, 20, "<c.srtPlayer> value </c.srtPlayer>")
            }
        }
    }

    _linePositionChanged(val){
        this.cue.line=val;
    }

    _horizontalPositionChanged(val){
        this.cue.position=val;
    }

    _sizeChanged(val){
        this.cue.size=val;
    }

    ready() {
        super.ready();
    }
}
customElements.define(SubtitlePositioningElement.is, SubtitlePositioningElement);
