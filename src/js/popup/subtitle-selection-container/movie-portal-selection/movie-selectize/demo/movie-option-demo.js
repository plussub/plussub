/**
 * Created by sbreitenstein on 20/01/17.
 */
Polymer({
    is: 'movie-option-demo',
    properties: {
        item: {
            type: Object,
            value: () => Object.assign({
                Title: 'Lord of the rings',
                Year: 1986,
                Genre: 'Action',
                Country: 'Germany',
                imdbRating:'9.8'
            })
        }
    }
});