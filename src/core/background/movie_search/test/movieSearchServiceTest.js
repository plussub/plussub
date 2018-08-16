//class under test
const root = require('../MovieSearchService.js');

//test framework dependencies
const expect = require('chai').expect;
let sinon = require('sinon');
const fetchMock = require('fetch-mock');

//application dependencies
const redux = require('../../../redux/redux.js').srtPlayer.Redux;
const actionCreators = require('../../../redux/actionCreators.js').srtPlayer.ActionCreators;
let Descriptor = require('../../../descriptor/Descriptor.js').srtPlayer.Descriptor;

//expected results
const SEARCH_RESULTS = require('./expectedResponse.js').SEARCH_RESULTS;


describe('MovieSearchService', () => {

    let movieSearchService;

    const SEARCH_URL = "https://app.plus-sub.com/v2/movie/search/";
    const INFORMATION_URL = "https://app.plus-sub.com/v2/movie/information/";

    let fakeFetch;

    beforeEach(() => {

        fakeFetch = fetchMock.sandbox();
        movieSearchService = root.srtPlayer.MovieSearchService(fakeFetch);
    });

    afterEach(() => {
        fakeFetch.reset();
        redux.dispatch(actionCreators.resetAll());
        movieSearchService.shutdown();
    });

    it('should find search results', function (done) {

        fakeFetch.mock(SEARCH_URL + 'pulp', SEARCH_RESULTS);

        let validateResult = (result) => {
            expect(result[0]).to.deep.equal({
                "id": "680",
                "Title": "Pulp Fiction",
                "Year": "1994-09-10",
                "Rating":"68.485947",
                "Genre":"-",
                "Country": "-",
                "Poster":"https://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg",
                "valueField": '{"id":"680","Title":"Pulp Fiction","Year":"1994-09-10","Rating":"68.485947","Genre":"-","Country":"-","Poster":"https://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg"}'
            });
        };

        let unsubscribe = redux.subscribe(() => {
            let movieSearch = redux.getState().movieSearch;
            if (movieSearch.resultId !== -1) {
                unsubscribe();
                validateResult(movieSearch.result);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSearchMovie('pulp'));
    });


    it('query throw disconnect exception', function (done) {

        fakeFetch.mock(SEARCH_URL + 'Batman',  () => {
            throw {
                type: "TypeError",
                message: "Failed to fetch"
            };
        });

        let validateResult = (movieSearch, errors) => {
            expect(movieSearch.query).to.equal('');
            expect(errors.length).to.equal(1);
            expect(errors[0].message).to.equal("Failed to search movie. Are you Disconnected? Err: ([object Object])");
            expect(errors[0].src).to.equal("movieSearchService");

        };

        let previousErrors=[];
        let unsubscribe = redux.subscribe(() => {
            let movieSearch = redux.getState().movieSearch;
            let errors = redux.getState().errors;
            if(previousErrors.length === errors.length){
                return;
            }
            previousErrors = errors;

            if (errors.length>0) {
                unsubscribe();
                validateResult(movieSearch,errors);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSearchMovie('Batman'));
    });


    it('query has invalid status', function (done) {

        fakeFetch.mock(SEARCH_URL + 'Batman', {
            status:404
        });

        let validateResult = (movieSearch, errors) => {
            expect(movieSearch.query).to.equal('');
            expect(errors.length).to.equal(1);

            expect(errors[0].message).to.equal(`Failed to search movie. Status (404)`);
            expect(errors[0].src).to.equal("movieSearchService");
        };

        let previousErrors=[];
        let unsubscribe = redux.subscribe(() => {
            let movieSearch = redux.getState().movieSearch;
            let errors = redux.getState().errors;
            if(previousErrors.length === errors.length){
                return;
            }
            previousErrors = errors;

            if (errors.length>0) {
                unsubscribe();
                validateResult(movieSearch,errors);
                done();
            }
        });

        redux.dispatch(actionCreators.triggerSearchMovie('Batman'));
    });
});