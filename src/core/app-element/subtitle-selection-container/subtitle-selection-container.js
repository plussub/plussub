/**
 * Created by sbreitenstein on 19/01/17.
 */

class PlussubSubtitleSelectionContainerElement extends Polymer.Element {
    static get is() {
        return "subtitle-selection-container";
    }

    ready() {
        super.ready();
        // this.$.paperExpansionPanel.opened=true;

        let previousId = -1;

        srtPlayer.Redux.subscribe(()=>{
            let movieInfo = srtPlayer.Redux.getState().movieInfo;
            if(previousId !== movieInfo.id){
                previousId =  movieInfo.id;
                this._setMovieInfo(movieInfo)
            }
        });
    }

    static get properties() {
        return {
            title: {
                type: String,
                value: '-'
            },
            type: {
                type: String,
                value: ''
            },
            currentSelectionElement: {
                type: Object,
                value: () => Object.assign({})
            }
        }
    }

    _setMovieInfo(info){
        this.title = info.title;
       // this.poster= data.movie.Poster;
        this.poster= info.poster;
        this.type=info.src;
    }

    manualReset(){
        this._reset();
    }

    _reset(){
        this.currentSelectionElement = null;
        this.type = '';
        this.title = '-';
        this.poster= null;


    }

}

customElements.define(PlussubSubtitleSelectionContainerElement.is, PlussubSubtitleSelectionContainerElement);