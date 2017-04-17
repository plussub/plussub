/**
 * Created by stefa on 13.03.2017.
 */


var expect = require('chai').expect;
var requirejs = require('requirejs');
var messageBus = require('../../../src/js/MessageBus.js');
var nodeFetch = require('node-fetch');
var root = require('../../../src/js/background/movie_information/MovieInformationService.js');
var Descriptor = require('../../../src/js/Descriptor.js').srtPlayer.Descriptor;


describe('Movie Information Service', ()=> {

    var SERVICE_CHANNEL;
    var movieInformationService;

    beforeEach(() => {
        messageBus.reset();
        SERVICE_CHANNEL = messageBus.channel(Descriptor.CHANNEL.SERVICE);
        movieInformationService = root.srtPlayer.MovieInformationService(messageBus,nodeFetch);
    });


    it('should search correct movie information', function (done) {

        this.timeout(20000);

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.PUB.SEARCH_RESULT,
            callback: (result) => {
                "use strict";
                expect(result.length).to.be.above(0);
                done();
            }
        });

        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.Descriptor.SERVICE.MOVIE_INFORMATION.SUB.SEARCH,
            data: "Pulp Fiction"
        });
    });
});