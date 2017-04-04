var expect = require('chai').expect;
var requirejs = require('requirejs');
var sinon = require('sinon');
var messageBus = require('../../../src/js/MessageBus.js');
var $ = require('jquery')(require("jsdom").jsdom().defaultView);
var root = require('../../../src/js/background/movie_information/MovieInformationService.js');
root.srtPlayer.LogService = require('./../util/LogService.js').srtPlayer.LogService();
var Descriptor = require('../../../src/js/Descriptor.js').srtPlayer.Descriptor;
var fetchMock = require('fetch-mock');


describe('MovieInformationService', () => {

    var SERVICE_CHANNEL;
    var movieInformationService;
    var ajaxStub;

    var fakeFetch;

    var DEFAULT_IMDB_RESULT = {
        title_popular: [{id: 'ttpopularA'}, {id: 'ttpopularB'}],
        title_exact: [{id: 'ttexactA'}, {id: 'ttexactB'}],
        title_substring: [{id: 'ttsubA'}, {id: 'ttsubB'}],
        title_approx: [{id: 'ttapproxA'}, {id: 'ttapproxB'}]
    };

    var DEFAULT_OMDB_RESULTS = {
        ttpopularA: {
            title: 'popularA',
            imdbId: 'ttpopularA',
            Poster: 'posterURL',
            year: '2000'
        },
        ttpopularB: {
            title: 'popularB',
            imdbId: 'ttpopularB',
            Poster: 'N/A',
            year: '2000'
        },
        ttexactA: {
            title: 'exactA',
            imdbId: 'ttexactA',
            Poster: 'N/A',
            year: '2000'
        },
        ttexactB: {
            title: 'exactB',
            imdbId: 'ttexactB',
            Poster: 'N/A',
            year: '2000'
        },
        ttsubA: {
            title: 'subA',
            imdbId: 'ttsubA',
            Poster: 'N/A',
            year: '2000'
        },
        ttsubB: {
            title: 'subB',
            imdbId: 'ttsubB',
            Poster: 'N/A',
            year: '2000'
        },
        ttapproxA: {
            title: 'approxA',
            imdbId: 'ttapproxA',
            Poster: 'N/A',
            year: '2000'
        },
        ttapproxB: {
            title: 'approxB',
            imdbId: 'ttapproxB',
            Poster: 'posterURL',
            year: '2000'
        }
    };


    beforeEach(() => {
        messageBus.reset();
        SERVICE_CHANNEL = messageBus.channel(Descriptor.CHANNEL.SERVICE);
        fakeFetch = fetchMock.sandbox();
        movieInformationService = root.srtPlayer.MovieInformationService(messageBus, fakeFetch);
    });

    afterEach(() => {
        fakeFetch.reset();
    });

    it('should map imdb results to omdb results', function (done) {
        fakeFetch.mock('http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=Batman', DEFAULT_IMDB_RESULT);
        Object.keys(DEFAULT_OMDB_RESULTS).map((k) => DEFAULT_OMDB_RESULTS[k]).forEach((v) => {
            fakeFetch.mock('http://www.omdbapi.com/?i=' + v.imdbId, v)
        });

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: (result) => {
                "use strict";
                expect(result.length).to.equal(8);
                expect(result[0]).to.deep.equal({
                    title: 'popularA',
                    imdbId: 'ttpopularA',
                    Poster: 'posterURL',
                    year: '2000',
                    valueField: '{"title":"popularA","imdbId":"ttpopularA","Poster":"posterURL","year":"2000"}'
                });
                expect(result[7]).to.deep.equal({
                    title: 'approxB',
                    imdbId: 'ttapproxB',
                    Poster: 'posterURL',
                    year: '2000',
                    valueField: '{"title":"approxB","imdbId":"ttapproxB","Poster":"posterURL","year":"2000"}'
                });
                done();
            }
        });

        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: 'Batman'
        });
    });

    it('should replace n/a poster with error url', function (done) {

        var imdbIdWithoutPoster = 'ttWithoutPoster';

        fakeFetch.mock('http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=' + imdbIdWithoutPoster, {
            title_popular: [{id: imdbIdWithoutPoster}]
        });
        fakeFetch.mock('http://www.omdbapi.com/?i=' + imdbIdWithoutPoster, {
            title: 'withoutPoster',
            imdbId: 'ttWithoutPoster',
            Poster: 'N/A',
            year: '2000'
        });

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: (result) => {
                expect(result.length).to.equal(1);
                expect(result[0]).to.deep.equal({
                    title: 'withoutPoster',
                    imdbId: 'ttWithoutPoster',
                    Poster: 'posterError.png',
                    year: '2000',
                    valueField: '{"title":"withoutPoster","imdbId":"ttWithoutPoster","Poster":"posterError.png","year":"2000"}'
                });
                done();
            }
        });
        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: imdbIdWithoutPoster
        });
    });

    it('should collect max. 10 omdb entries', (done) => {

        var entries = [];
        for (let i = 0; i < 30; i++) {
            entries.push({id: i.toString()});
        }

        fakeFetch.mock('http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=Batman', {
            title_popular: entries
        });

        for (let i = 0; i < 30; i++) {
            fakeFetch.mock('http://www.omdbapi.com/?i='+i, {
                title: 'withoutPoster',
                imdbId: 'ttWithoutPoster',
                Poster: 'N/A',
                year: '2000'
            });
        }
        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: (result) => {
                expect(result.length).to.equal(10);
                done();
            }
        });
        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: 'Batman'
        });
    });

});