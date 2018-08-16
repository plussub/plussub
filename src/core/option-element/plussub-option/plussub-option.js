class PlussubOptionElement extends Polymer.Element {
    static get is() {
        return "plussub-option";
    }

    ready() {
        super.ready();
    }

    static get properties() {
        return {

            cue: {
                type: Object,
                notify: true
            },
            css: {
                type: String,
                notify: true
            },

            settings:{
                type: Object,
                notify:true
            },
        }
    }

    save() {
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.changeCss(this.css));
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.changeSubtitleProperties({
            line: this.cue.line,
            position: this.cue.position,
            size: this.cue.size,
            align: this.cue.align,
            vertical: this.cue.vertical
        }));

        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.enableDebugConsole(this.settings.enableDebugConsole));
    }

    reset() {
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.resetOption());
    }
}
customElements.define(PlussubOptionElement.is, PlussubOptionElement);
