/**
 * Created by sonste on 27.12.2016.
 */
class PlussubMovieOptionElement extends Polymer.Element {
    static get is() {
        return "movie-option";
    }

    static get properties() {
        return {
            item: {
                type: Object,
                value: () => {
                    return {};
                },
            }
        }
    }
}

customElements.define(PlussubMovieOptionElement.is, PlussubMovieOptionElement);