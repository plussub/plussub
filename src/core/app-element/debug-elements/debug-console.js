/**
 * Created by stefa on 06.03.2017.
 */
class PlussubDebugConsoleElement extends Polymer.Element {
    static get is() {
        return "debug-console";
    }

    ready() {
        super.ready();

        srtPlayer.Redux.subscribe(() => {
            this._isVisible = srtPlayer.Redux.getState().debug.showDebugConsole;
        });

    }

    static get properties() {
        return {
            _isVisible: {
                type: Boolean,
                value: false,
                observer:'isVisibleChanged'
            },
            _selectedView:{
                type:Number,
                value:0
            }
        }
    }
    isVisibleChanged(newValue){
        console.log("trigger");
        this.style= newValue ?  "display:block; width:100%" : "display:none";
        let htmlElement = window.document.querySelector("html");
        if (htmlElement.classList.contains("chromeExtension")) {
            htmlElement.style.minWidth = newValue ? "800px" : "410px";
            htmlElement.style.maxWidth = newValue ? "800px" : "410px";
        }
    }

    sendReduxHeartbeat(){
        srtPlayer.Redux.dispatch(srtPlayer.ActionCreators.sendHeartBeat());
    }
}

customElements.define(PlussubDebugConsoleElement.is, PlussubDebugConsoleElement);
