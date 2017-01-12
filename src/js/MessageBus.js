/**
 * Created by sonste on 05.03.2016.
 */

( function (root, factory) {

    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function (_) {
            return factory( root);
        });

    } else if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = factory(this);
    } else {
        // Browser globals
        root.messageBus = factory(root);
    }
}(this, function () {
    "use strict";


    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    var allChannels = [];

    function getChannel(requestedChannel) {
        return {
            subscribe: (subDef)=> {

                var channel = allChannels.find(channel => channel.name === requestedChannel);
                if (!channel) {
                    channel = {
                        name: requestedChannel,
                        subscriber: []
                    };
                    allChannels.push(channel);
                }

                Object.assign(subDef,{guid:guid()});

                channel.subscriber.push({
                    topic: subDef.topic,
                    callback: subDef.callback,
                    once:subDef.once ? subDef.once : false,
                    guid:subDef.guid
                });

                if(typeof messageBus !== 'undefined' && messageBus.hook){
                    messageBus.hook.subscribe(Object.assign({}, subDef, {channel: requestedChannel}));
                }

                return subDef;
            },

            unsubscribe: (subDef)=>{
                var channel = allChannels.find(channel => channel.name === requestedChannel);
                channel.subscriber = channel.subscriber.filter((_subDef) => _subDef.guid!==subDef.guid)

            },
            publish: (pubDef)=> {
                var envelope = Object.assign({},pubDef,{channel: requestedChannel});
                if(typeof messageBus !== 'undefined' && messageBus.hook){
                    messageBus.hook.publish(pubDef.data,envelope);
                }

                var channel = allChannels.find(channel => channel.name === requestedChannel);
                if (!channel) {
                    return;
                }

                channel.subscriber.filter((currentSub)=> currentSub.topic === pubDef.topic).forEach(sub=> {
                    sub.callback(pubDef.data,envelope);
                    if(sub.once){
                        getChannel(requestedChannel).unsubscribe(sub)
                    }
                });

                return pubDef;
            }
        }
    }


    return {
        reset: ()=>allChannels = [],
        channel: (requestedChannel)=>getChannel(requestedChannel)
    };
}));