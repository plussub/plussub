/**
 * Created by stefa on 05.03.2017.
 */
var expect = require('chai').expect;
var requirejs = require('requirejs');
var messageBus = require('../../../src/js/MessageBus.js');
var nodeFetch = require('node-fetch');
var root = require('../../../src/js/background/subtitle_provider/SubtitleProvider.js');
var ServiceDescriptor = require('../../../src/js/ServiceDescriptor.js').srtPlayer.ServiceDescriptor;


describe('Subtitle Provider', ()=> {

    var SERVICE_CHANNEL;
    var subtitleProvider;

    beforeEach(() => {
        messageBus.reset();
        SERVICE_CHANNEL = messageBus.channel(ServiceDescriptor.CHANNEL.SERVICE);
        subtitleProvider = root.srtPlayer.SubtitleProvider(null, messageBus, nodeFetch);
    });


    it('should search correct subtitle', function (done) {

        this.timeout(13000);

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.ServiceDescriptor.SERVICE.SUBTITLE_PROVIDER.PUB.SEARCH_RESULT,
            callback: (result) => {
                "use strict";
                expect(result.length).to.be.above(0);
                expect(result[0].movieTitle).to.equal('P.S. I Love You');
                done();
            }
        });


        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.ServiceDescriptor.SERVICE.SUBTITLE_PROVIDER.SUB.SEARCH,
            data: {
                imdbid: "0431308", //P.S. I Love You
                iso639: "eng"
            }
        });
    });
    // array buffer not supported in node
    // it('should download correct subtitle', function (done) {
    //
    //     this.timeout(15000);
    //     setTimeout(()=>done(),12000);
    //     SERVICE_CHANNEL.publish({
    //         topic: root.srtPlayer.ServiceDescriptor.SERVICE.SUBTITLE_PROVIDER.SUB.DOWNLOAD,
    //         data:"http://dl.opensubtitles.org/en/download/src-api/vrf-e9750b7f/sid-H,ss3bi0urTf7bOhtZYm6QXciu4/filead/154507.gz"
    //     });
    //
    // });
});