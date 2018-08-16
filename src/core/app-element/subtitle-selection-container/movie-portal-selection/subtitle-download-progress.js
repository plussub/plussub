class PlussubSubtitleDownloadProgressElement extends Polymer.Element {


    static get is() {
        return "subtitle-download-progress";
    }

    ready() {
        super.ready();
        srtPlayer.Redux.subscribe(() => {
            let subtitleDownload = srtPlayer.Redux.getState().subtitleDownload;
            this.isLoading=subtitleDownload.isLoading;

            this.isFullLoaded=!this.isLoading && subtitleDownload.resultId!==-1;
            this.$.progress.value= this.isFullLoaded ? 100 : 0;

        });
    }

    static get properties() {
        return {
            isLoading: {
                type: Boolean,
                value: false
            },

            isFullLoaded:{
                type: Boolean,
                value: false
            }
        }
    }
}

customElements.define(PlussubSubtitleDownloadProgressElement.is, PlussubSubtitleDownloadProgressElement);