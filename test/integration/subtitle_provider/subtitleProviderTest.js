/**
 * Created by stefa on 05.03.2017.
 */
var expect = require('chai').expect;
var requirejs = require('requirejs');
var messageBus = require('../../../src/js/MessageBus.js');
var nodeFetch = require('node-fetch');
var root = require('../../../src/js/background/subtitle_provider/SubtitleProvider.js');
var ServiceDescriptor = require('../../../src/js/ServiceDescriptor.js').srtPlayer.ServiceDescriptor;


describe('MovieInformationService', ()=> {

    var SERVICE_CHANNEL;
    var subtitleProvider;

    beforeEach(() => {
        messageBus.reset();
        SERVICE_CHANNEL = messageBus.channel(ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        subtitleProvider = root.srtPlayer.SubtitleProvider(null, messageBus,nodeFetch);
    });


    it('should search correct subtitle', function(done) {

        this.timeout(3000);

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.SUBTITLE_PROVIDER.PUB.SEARCH_RESULT,
            callback: (result) => {
                "use strict";
                expect(result.length).to.be.above(0);
                expect(result[0].movieTitle).to.equal('P.S. I Love You');
                done();
            }
        });


        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.SUBTITLE_PROVIDER.SUB.SEARCH,
            data: {
                imdbid:"0431308", //P.S. I Love You
                iso639:"eng"
            }
        });
    });
});