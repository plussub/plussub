var expect = require('chai').expect;
var requirejs = require('requirejs');
var messageBus = require('../../../src/js/MessageBus.js');
var $ = require('jquery')(require("jsdom").jsdom().defaultView);
require('../../../src/components/jquery-xmlrpc/jquery.xmlrpc.js').srtPlayer.jQueryXMLRpc($)
var root = require('../../../src/js/background/subtitle_provider/subtitleProvider.js');
root.srtPlayer.LogService = require('./../../unit/util/LogService.js').srtPlayer.LogService();
var ServiceDescriptor = require('../../../src/js/ServiceDescriptor.js').srtPlayer.ServiceDescriptor;


describe('SubtitleProvider', ()=> {

    var subtitleProvider;
    var SERVICE_CHANNEL;
    var IMDB_PULP_FICTION="tt0110912";
    beforeEach(()=> {
        messageBus.reset();
        SERVICE_CHANNEL = messageBus.channel(ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        subtitleProvider = root.srtPlayer.SubtitleProvider($,messageBus);

    });

    it('should collect the correct subtitle format', function(done) {
        this.timeout(35000);

        SERVICE_CHANNEL.publish({
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.SUBTITLE_PROVIDER.SUB.SEARCH,
            data:{
                imdbid:IMDB_PULP_FICTION,
                iso639:'eng'
            }
        });

        SERVICE_CHANNEL.subscribe({
            topic: root.srtPlayer.ServiceDescriptor.BACKEND_SERVICE.SUBTITLE_PROVIDER.PUB.SEARCH_RESULT,
            callback:(result)=>{
                "use strict";
                console.log(result);
                done();
            }
        });
    });

});