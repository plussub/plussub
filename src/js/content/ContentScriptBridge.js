/**
 * Created by sonste on 27.02.2016.
 */

messageBus.hook = messageBus.hook || (()=> {

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.command !== 'messaging') {
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
                if (envelope.sender) {
                    return
                }
                srtPlayer.BackgroundAvailabilityService.promise().then(() =>
                    chrome.runtime.sendMessage(Object.assign(envelope, {
                        command: 'messaging',
                        sender: 'content'
                    }))
                )
            }
        };
    })();
