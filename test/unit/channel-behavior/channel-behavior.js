/**
 * Created by stefa on 12.03.2017.
 */
var expect = require('chai').expect;
var nodeFetch = require('node-fetch');
var requirejs = require('requirejs');
var messageBus = require('../../../src/js/MessageBus.js');
var root = require('../../../src/js/popup/channel-behavior/channel-behaviors.js');
var ServiceDescriptor = require('../../../src/js/ServiceDescriptor.js').srtPlayer.ServiceDescriptor;


describe('Channel Behavior', () => {

    beforeEach(() => {
        messageBus.reset();
    });


    it('test service channel', (done) => {

        var stub = {
            serviceSubscriptions: [
                {
                    topic: "Batman",
                    callback: "onNotify"
                }
            ],
            onNotify: function (result) {
                expect(result).to.equal('nananana');
                done();
            }
        };

        var testObject = Object.assign(stub,root.tms.ServiceChannelBehavior);
        testObject.ready();


        var SERVICE_CHANNEL = messageBus.channel(ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        SERVICE_CHANNEL.publish({
            topic: 'Batman',
            data: 'nananana'
        });

    });

});