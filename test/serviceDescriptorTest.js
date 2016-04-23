/**
 * Created by sonste on 07.03.2016.
 */

var expect = require('chai').expect;
var requirejs = require('requirejs');


describe('Service Descriptor', ()=> {


    var serviceDescriptor;
    beforeEach(()=> {
        serviceDescriptor = require('../srtchrome/js/ServiceDescriptor.js').srtPlayer.ServiceDescriptor;
    });

    it('should full subscriber topic', ()=> {
        expect(serviceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH).to.equal('metaService.publish');
        expect(serviceDescriptor.BACKEND_SERVICE.DOWNLOAD.SUB.SEARCH).to.equal('downloadService.search');
    });

    it('should full publisher topic', ()=> {
        expect(serviceDescriptor.BACKEND_SERVICE.META.PUB.READY).to.equal('metaService.ready');
        expect(serviceDescriptor.CONTENT_SERVICE.FIND_VIDEO.PUB.FOUND).to.equal('findVideoService.found');

    });

    it('should contain channels  topic', ()=> {
        expect(serviceDescriptor.CHANNEL.META).to.equal('meta');
    });
});