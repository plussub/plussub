class PlussubFileSelectionElement extends Polymer.Element {

    static get is() {
        return "file-selection";
    }

    ready() {
        this.classList.add("subtitle-selection-element");
        super.ready();
    }

    static get properties() {
        return {
            simpleName: {
                type: String,
                value: 'File Selection'
            }
        }
    }

    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    fileSelected() {

        const reader = new FileReader();
        reader.readAsText(this.$.fileInput.inputElement.inputElement.files[0]);
        reader.onload = () => {
            const filename = this.$.fileInput.inputElement.inputElement.files[0].name;

            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.setMovieInfo({
                id:PlussubFileSelectionElement.guid(),
                title: filename,
                src:"File selection"
            }));

            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.parseRawSubtitle(reader.result));
        };
    }
}


customElements.define(PlussubFileSelectionElement.is, PlussubFileSelectionElement);