/**
 * Created by sonste on 07.03.2016.
 */

var expect = require('chai').expect;
var requirejs = require('requirejs');


describe('Descriptor', ()=> {


    var descriptor;
    beforeEach(()=> {
        descriptor = require('../../../src/js/Descriptor.js').srtPlayer.Descriptor;
    });

    it('should full subscriber topic', ()=> {
        expect(descriptor.SERVICE.META.SUB.PUBLISH).to.equal('metaService.publish');
        expect(descriptor.SERVICE.SUBTITLE_PROVIDER.SUB.SEARCH).to.equal('SubtitleProvider.search');
    });

    it('should full publisher topic', ()=> {
        expect(descriptor.SERVICE.META.PUB.READY).to.equal('metaService.ready');
        expect(descriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND).to.equal('findVideoService.found');

    });

    it('should contain channels  topic', ()=> {
        expect(descriptor.CHANNEL.META).to.equal('meta');
    });
});