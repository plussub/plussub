/**
 * Created by sonste on 01.02.2016.
 */

var srtPlayer = srtPlayer || {};
if (typeof exports !== 'undefined') {
    exports.srtPlayer = srtPlayer;
    var messageBus = null;
    srtPlayer.Descriptor = require('./../../Descriptor.js').srtPlayer.Descriptor;
    srtPlayer.MetaConfig = require('./MetaConfig.js').srtPlayer.MetaConfig;

}
/*USE DYNAMIC META CHANNEL */


srtPlayer.MetaService = srtPlayer.MetaService || ((messageBusLocal = messageBus, config = srtPlayer.MetaConfig) => {

        const console2 = srtPlayer.LogService.getLoggerFor(srtPlayer.Descriptor.SERVICE.META.NAME);
        const SERVICE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.SERVICE);
        const META_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.META);
        const META_WRITE_CHANNEL = messageBusLocal.channel(srtPlayer.Descriptor.CHANNEL.META_WRITE);

        const topics = Object.keys(config);

        function merge(obj1, obj2) {
            for (var p in obj2) {
                obj1[p] = (typeof obj2[p] === 'object' && typeof obj1[p] === 'object') ? merge(obj1[p], obj2[p]) : obj2[p]
            }
            return obj1;
        }

        function setAllSubscriberFor(current, path, init) {
            Object.keys(current).forEach(key => {
                if (typeof current[key] === 'object' && Object.keys(current[key])) {
                    setAllSubscriberFor(current[key], path + '.' + key, init);
                }
                console2.log("metaservice: subscribe to %s", path + '.' + key);
                META_WRITE_CHANNEL.subscribe({
                    topic: path + '.' + key,
                    callback: (data, envelope) => {
                        var pathWithoutRootTopic = envelope.topic.replace(init.root + '.', '').split('.');
                        var newEntry = pathWithoutRootTopic.reduce((p, c, i, a) => {
                            var last = p;
                            while (Object.keys(last).length > 0) {
                                last = last[Object.keys(last)[0]];
                            }
                            last[c] = i < a.length - 1 ? {} : data;
                            return p;
                        }, {});
                        merge(init.data, newEntry);

                        srtPlayer.StoreService.update(init.data).then(x => META_CHANNEL.publish({
                            topic: path + '.' + key,
                            data: data
                        }));
                    }
                });
            });
        }

        function publish(current, path) {
            Object.keys(current).forEach(key => {
                if (typeof current[key] === 'object' && Object.keys(current[key])) {
                    publish(current[key], path + '.' + key);
                }
                META_CHANNEL.publish({
                    topic: path + '.' + key,
                    data: current[key]
                });
            });
        }

        const findOrFallback = async (rootTopic) => {
            "use strict";
            const result = await srtPlayer.StoreService.find(rootTopic);
            return typeof result !== 'undefined' ? result : JSON.parse(JSON.stringify(config[rootTopic].fallback));
        };

        (async ()=>{
            const findOrFallbackValues = await Promise.all( topics.map(findOrFallback));
            findOrFallbackValues.forEach(result =>
                setAllSubscriberFor(result, result.store, {
                    data: result,
                    root: result.store
                })
            );

            SERVICE_CHANNEL.publish({topic: srtPlayer.Descriptor.SERVICE.META.PUB.READY});
        })();



        SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.PUBLISH_ALL,
            callback:async (topic) => {
                console2.log("publish all: "+topic);
                const result = await findOrFallback(topic);
                publish(result, config[topic].fallback.store)
            }
        });



        SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.RESET,
            callback: async (topic) => {
                console2.log("reset topic: " + topic);
                await srtPlayer.StoreService.update(config[topic].fallback);
                const updatedValue = await findOrFallback(topic);
                publish(updatedValue, config[topic].fallback.store);
            }
        });


        SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.FULL_TOPIC_RESET,
            callback: async (topic) => {
                console2.log("full topic rest: "+topic);
                await srtPlayer.StoreService.update(config[topic].fallback);
                const updatedValue = await findOrFallback(topic);
                publish(updatedValue, config[topic].fallback.store);
            }
        });


        SERVICE_CHANNEL.subscribe({
            topic: srtPlayer.Descriptor.SERVICE.META.SUB.PUBLISH,
            callback:async (topic) => {
                const topicPath = topic.split('.');
                const rootTopic = topicPath[0];
                const result = await findOrFallback(rootTopic);
                META_CHANNEL.publish({
                    topic: topic,
                    data: topicPath.slice(1).reduce((p, c) => p[c], result)
                });

            }
        });

    });

//instant service does not correct initialize messageBus (in testfiles)
if (typeof exports === 'undefined' && typeof srtPlayer.MetaService === 'function') {
    srtPlayer.MetaService = srtPlayer.MetaService();
}