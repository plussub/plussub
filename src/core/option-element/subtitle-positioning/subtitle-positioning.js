/**
 * Created by stefa on 19.03.2017.
 */

class SubtitlePositioningElement extends Polymer.Element {
    static get is() {
        return "subtitle-positioning";
    }

    static get properties() {
        return {
            _linePosition: {
                type: Number,
                value: -2,
                observer: '_linePositionChanged'
            },
            _horizontalPosition: {
                type: Number,
                value: 50,
                observer: '_horizontalPositionChanged'
            },
            _size: {
                type: Number,
                value: 100,
                observer: '_sizeChanged'
            },
            cue: {
                type: Object,
                value: () => {
                    var vttInit = new VTTCue(0, 60, "<c.srtPlayer> value </c.srtPlayer>")
                    return Object.assign(vttInit, {
                        line: 50,
                        position: 10,
                        size: 100
                    });
                },
                notify: true,
                observer: '_cueChanged'
            }
        }
    }

    _cueChanged(){
        this._linePosition = this.cue.line;
        this._horizontalPosition = this.cue.position;
        this._size = this.cue.size;
    }

    _linePositionChanged(val) {
        this.set('cue.line', val);
    }

    _horizontalPositionChanged(val) {
        this.set('cue.position', val);
    }

    _sizeChanged(val) {
        this.set('cue.size', val);
    }

    ready() {
        super.ready();
    }
}
customElements.define(SubtitlePositioningElement.is, SubtitlePositioningElement);
