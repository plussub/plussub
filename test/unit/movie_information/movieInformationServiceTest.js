var expect = require('chai').expect;
var requirejs = require('requirejs');
var sinon = require('sinon');
var messageBus = require('../../../src/js/MessageBus.js');
var $ = require('jquery')(require("jsdom").jsdom().defaultView);
var root = require('../../../src/js/background/movie_information/MovieInformationService.js');
root.srtPlayer.LogService = require('./../util/LogService.js').srtPlayer.LogService();
var ServiceDescriptor = require('../../../src/js/ServiceDescriptor.js').srtPlayer.ServiceDescriptor;


describe('MovieInformationService', ()=> {

    var SERVICE_CHANNEL;
    var parserService;
    var ajaxStub;

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


    beforeEach(()=> {
        messageBus.reset();
        SERVICE_CHANNEL = messageBus.channel(ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        parserService = root.srtPlayer.MovieInformationService($,messageBus);
        ajaxStub = sinon.stub($, "ajax");
    });

    afterEach(()=> {
        $.ajax.restore();
    });

    it('should map imdb results to omdb results', (done)=> {

        ajaxStub.onCall(0).yieldsTo("success", DEFAULT_IMDB_RESULT);
        Object.keys(DEFAULT_OMDB_RESULTS).map((k)=>DEFAULT_OMDB_RESULTS[k]).forEach((v, idx)=>
            ajaxStub.onCall(idx + 1).yieldsTo("success", v)
        );

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: (result)=> {
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
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: 'Batman'
        });
    });

    it('should replace n/a poster with error url', (done)=> {
        ajaxStub.onCall(0).yieldsTo("success", {
                title_popular: [{id: 'ttWithoutPoster'}]
            }
        );
        ajaxStub.onCall(1).yieldsTo("success", {
            title: 'withoutPoster',
            imdbId: 'ttWithoutPoster',
            Poster: 'N/A',
            year: '2000'
        });
        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: (result)=> {
                expect(result.length).to.equal(1);
                expect(result[0]).to.deep.equal({
                    title: 'withoutPoster',
                    imdbId: 'ttWithoutPoster',
                    Poster: '../icons/posterError.png',
                    year: '2000',
                    valueField:'{"title":"withoutPoster","imdbId":"ttWithoutPoster","Poster":"../icons/posterError.png","year":"2000"}'
                });
                done();
            }
        });
        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: 'Batman'
        });
    });

    it('should collect max. 10 omdb entries', (done)=> {

        var entries=[];
        for(let i=0; i<30;i++){
            entries.push({id: i.toString()});
        }

        ajaxStub.onCall(0).yieldsTo("success", {
                title_popular: entries
            }
        );
        for(let i=0; i<30;i++) {
            ajaxStub.onCall(i+1).yieldsTo("success", {
                title: 'withoutPoster',
                imdbId: 'ttWithoutPoster',
                Poster: 'N/A',
                year: '2000'
            });
        }
        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: (result)=> {
                expect(result.length).to.equal(10);
                done();
            }
        });
        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: 'Batman'
        });
    });

});