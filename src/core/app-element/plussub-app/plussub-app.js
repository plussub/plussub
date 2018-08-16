/**
 * Created by sbreitenstein on 17/01/17.
 */
class PlussubAppElement extends Polymer.Element {
    static get is() {
        return "plussub-app";
    }

    async ready() {

        srtPlayer.Redux.subscribe(() => {
            let appState = srtPlayer.Redux.getState().appState;
            this.$.selectionModePages.selected = appState.selectedMode;
            this.$.selectionModeTabs.selected = appState.selectedMode;
            this.selectMode = appState.selectedMode;

            let debug = srtPlayer.Redux.getState().debug;
            this.$.toggleConsoleBtn.hidden = !debug.enableDebugConsole;
        });

        srtPlayer.Redux.store.ready().then(() => {
            super.ready();
            srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.sendHeartBeat());
        });
    }

    static get properties() {
        return {
            selectedMode: {
                type: Number,
                observer: 'onSelectionModeChange'
            },
            openSettings: {
                type: Object,
                value: () => Object.assign({fn: () => chrome.tabs.create({url: "/src/html/option.html"})})
            }
        }
    }

    onSelectionModeChange(newVal) {
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.selectSubtitleSelectionMode(newVal));
    }

    openSettingsPage() {
        this.openSettings.fn();
    }

    debugConsole() {
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.toggleShowDebugConsole());
    }

    reset() {
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.removeLoadedSubtitle());
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.resetMovieInfo());
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.triggerSubtitleSearchReset());
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.triggerMovieSearchReset());
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.resetSubtitleDownload());
    }
}

customElements.define(PlussubAppElement.is, PlussubAppElement);
