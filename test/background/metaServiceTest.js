var expect = require('chai').expect;
var requirejs = require('requirejs');
var messageBus = require('../../src/js/MessageBus.js');
var root = require('../../src/js/background/meta/MetaService.js');
var config = require('../../src/js/background/meta/MetaConfig.js');

root.srtPlayer.StoreService = require('./mock/StoreMockService.js').srtMock.StoreMockService();
root.srtPlayer.LogService = require('./../LogServiceForTest.js').srtPlayer.LogServiceForTest();

var ServiceDescriptor = require('../../src/js/ServiceDescriptor.js').srtPlayer.ServiceDescriptor;

describe('MetaService', ()=> {

    var META_CHANNEL, META_WRITE_CHANNEL, SERVICE_CHANNEL;
    var metaService;

    beforeEach(()=> {
        messageBus.reset();
        SERVICE_CHANNEL = messageBus.channel(ServiceDescriptor.CHANNEL.BACKEND_SERVICE);
        META_CHANNEL = messageBus.channel(ServiceDescriptor.CHANNEL.META);
        META_WRITE_CHANNEL = messageBus.channel(ServiceDescriptor.CHANNEL.META_WRITE);
        metaService = root.srtPlayer.MetaService(messageBus);

    });

    it('default values', (done)=> {
        metaService.get.user.then(settings => {
            expect(settings.standby).to.equal(false);

            var play = settings.play;
            expect(play.offsetTime).to.equal(0);
            expect(play.offsetTimeEnabled).to.equal(true);
            done();
        });
    });

    it('publish should notify all subscriber', (done)=>{
        "use strict";
        META_CHANNEL.subscribe({
            topic: 'user.standby',
            callback: (d)=>expect(d).is.equal(false)
        });
        META_CHANNEL.subscribe({
            topic: 'user.play.offsetTime',
            callback: (d)=>expect(d).is.equal(0)
        });
        META_CHANNEL.subscribe({
            topic: 'user.test.deep.prop',
            callback: (d)=> {
                expect(d).is.equal('testTxt');
                done();
            }
        });
        SERVICE_CHANNEL.subscribe({
            topic: ServiceDescriptor.BACKEND_SERVICE.META.PUB.READY,
            callback: (d)=> {
                SERVICE_CHANNEL.publish({
                    topic: ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH_ALL,
                    data: 'user'
                });
            }
        });
    });

    it('MetaWriteChannel should reflect to the attributes', (done)=> {
        "use strict";
        metaService.get.user.then(settings => {

            expect(settings.standby).to.equal(false);
            META_WRITE_CHANNEL.publish({
                topic: 'user.standby',
                data: true
            });
            expect(settings.standby).to.equal(true);

            expect(settings.play.offsetTime).to.equal(0);
            META_WRITE_CHANNEL.publish({
                topic: 'user.play.offsetTime',
                data: 22
            });
            expect(settings.play.offsetTime).to.equal(22);

            expect(settings.test.deep.prop).to.equal('testTxt');
            META_WRITE_CHANNEL.publish({
                topic: 'user.test.deep.prop',
                data: 'testChange'
            });
            expect(settings.test.deep.prop).to.equal('testChange');
            done();
        });
    });


    it('MetaWriteChannel should publish the updated value to the MetaChannel', (done)=> {
        "use strict";

        META_CHANNEL.subscribe({
            topic: 'user.play.offsetTime',
            callback: (data) => {
                expect(data).to.equal(42);
            }
        });

        META_CHANNEL.subscribe({
            topic: 'user.test.deep.prop',
            callback: (data) => {
                expect(data).to.equal('testChange');
                done();
            }
        });
        SERVICE_CHANNEL.subscribe({
            topic: ServiceDescriptor.BACKEND_SERVICE.META.PUB.READY,
            callback: ()=> {
                META_WRITE_CHANNEL.publish({
                    topic: 'user.play.offsetTime',
                    data: 42
                });

                META_WRITE_CHANNEL.publish({
                    topic: 'user.test.deep.prop',
                    data: 'testChange'
                });
            }
        });
    });

    it('should collect fallback values after reset', (done)=> {
        "use strict";

        var callCount = 0;
        META_CHANNEL.subscribe({
            topic: 'user.play.offsetTime',
            callback: (data) => {
                expect(data).to.equal(callCount === 0 ? 42: 0);
                if (callCount === 1) {
                    done();
                }
                callCount++;
            }
        });

        SERVICE_CHANNEL.subscribe({
            topic: ServiceDescriptor.BACKEND_SERVICE.META.PUB.READY,
            callback: ()=> {
                META_WRITE_CHANNEL.publish({
                    topic: 'user.play.offsetTime',
                    data: 42
                });

                SERVICE_CHANNEL.publish({
                    topic: ServiceDescriptor.BACKEND_SERVICE.META.SUB.RESET,
                    data: 'user'
                });


            }
        });
    });

    it('publish for a given attribute should notify all subscriber (subtitle)', (done)=> {
        "use strict";
        META_CHANNEL.subscribe({
            topic: 'user.test.deep.prop',
            callback: (d)=> {
                expect(d).is.equal('testTxt');
                done();
            }
        });

        SERVICE_CHANNEL.subscribe({
            topic: ServiceDescriptor.BACKEND_SERVICE.META.PUB.READY,
            callback: (d)=> {
                SERVICE_CHANNEL.publish({
                    topic: ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH,
                    data: 'user.test.deep.prop'
                });
            }
        });
    });

    it('publish all should notify all subscriber (subtitle)', (done)=> {
        "use strict";
        META_CHANNEL.subscribe({
            topic: 'parsed_subtitle.parsedSubtitle',
            callback: (d)=> {
                expect(d).is.equal('');
                done();
            }
        });

        SERVICE_CHANNEL.subscribe({
            topic: ServiceDescriptor.BACKEND_SERVICE.META.PUB.READY,
            callback: (d)=> SERVICE_CHANNEL.publish({
                topic: ServiceDescriptor.BACKEND_SERVICE.META.SUB.PUBLISH_ALL,
                data: 'parsed_subtitle'
            })
        });
    });

    it('MetaWriteChannel should publish the updated value to the MetaChannel (subtitle)', (done)=> {
        "use strict";

        META_CHANNEL.subscribe({
            topic: 'parsed_subtitle.parsedSubtitle',
            callback: (data) => {
                expect(data).to.equal('parsedStuff');
                done();
            }
        });
        SERVICE_CHANNEL.subscribe({
            topic: ServiceDescriptor.BACKEND_SERVICE.META.PUB.READY,
            callback: ()=> {
                META_WRITE_CHANNEL.publish({
                    topic: 'parsed_subtitle.parsedSubtitle',
                    data: 'parsedStuff'
                });
            }
        });
    });
});



