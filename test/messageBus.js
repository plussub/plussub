/**
 * Created by sonste on 05.03.2016.
 */
var expect = require('chai').expect;
var assert = require('chai').assert;
var requirejs = require('requirejs');


describe('Messageservice', ()=> {


    var messageBus;
    beforeEach(()=> {
        messageBus = require('../srtchrome/js/MessageBus.js');
        messageBus.reset();
    });

    it('should contain all signatures', ()=> {
        expect(messageBus.reset).to.be.a('function');
        expect(messageBus.channel).to.be.a('function');
    });


    it('should notify all subscriber', (done)=> {
        var testChannel = messageBus.channel('testChannel');
        var testData = {
            test: 12
        };

        testChannel.subscribe({
            topic: 'test.topic',
            callback: (data,envelope)=> {
                expect(data).to.deep.equal(testData);
                done();
            }
        });

        testChannel.publish({
            topic: 'test.topic',
            data:testData
        });

    });

    it('should add envelope for subscriber', (done)=> {
        var testChannel = messageBus.channel('testChannel');
        var testData = {
            test: 12
        };

        testChannel.subscribe({
            topic: 'test.topic',
            callback: (data,envelope)=> {
                expect(data).to.deep.equal(testData);
                expect(envelope.topic).to.equal('test.topic');
                expect(envelope.sender).to.equal('test');
                expect(envelope.channel).to.equal('testChannel');

                done();
            }
        });

        testChannel.publish({
            topic: 'test.topic',
            data:testData,
            sender:'test'
        });

    });


    it('unsubscribed callbacks should not be notified', (done)=> {
        var testChannel = messageBus.channel('testChannel');
        var testData = {
            test: 12
        };

        var desc = {
            topic: 'test.topic',
            callback: (data,envelope)=>assert.fail('is unsubscribed and should not notified')
        };
        testChannel.subscribe(desc);
        testChannel.unsubscribe(desc);
        testChannel.subscribe({
            topic: 'test.topic',
            callback: (data,envelope)=>done()
        });

        testChannel.publish({
            topic: 'test.topic',
            data:testData
        });

    });

    it('unsubscribed in subscribe callback (emulate once)', (done)=> {
        var testChannel = messageBus.channel('testChannel');
        var testData = {
            test: 12
        };

        var desc = {
            topic: 'test.topic',
            callback: (data,envelope)=>{
                testChannel.unsubscribe(desc);
                done();
            }
        };
        testChannel.subscribe(desc);

        testChannel.publish({
            topic: 'test.topic',
            data:testData
        });
        testChannel.publish({
            topic: 'test.topic',
            data:testData
        });

    });

});