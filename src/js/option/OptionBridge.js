/**
 * Created by sonste on 05.02.2016.
 */
var srtPlayer = srtPlayer || {};
messageBus.hook = messageBus.hook || (()=> {

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.sender==='option') {
                return;
            }
            var channel = messageBus.channel(request.channel);
            channel.publish({
                topic: request.topic,
                data: request.data,
                sender: request.sender
            });
        });

        return {
            subscribe: (subDef)=> {
            },
            publish: (data,envelope)=> {
                if (!envelope.sender || envelope.sender==='option') {
                    chrome.runtime.sendMessage(Object.assign(envelope, {
                        command: 'messaging',
                        sender: 'option'
                    }));
                }
            }
        };
    })();