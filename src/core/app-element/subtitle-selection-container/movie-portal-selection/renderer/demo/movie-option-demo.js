/**
 * Created by sbreitenstein on 20/01/17.
 */

class PlussubMovieOptionDemoElement extends Polymer.Element {
    static get is() {
        return "movie-option-demo";
    }

    static get properties() {
        return {
            item:{
                type: Object,
                value: () => Object.assign({
                    Title: 'Lord of the rings',
                    Year: 1986,
                    Genre: 'Action',
                    Country: 'Germany',
                    imdbRating: '9.8',
                    Poster: 'http://i.imgur.com/fR9qvlG.jpg'
                })
            }
        }
    }
}
customElements.define(PlussubMovieOptionDemoElement.is, PlussubMovieOptionDemoElement);
