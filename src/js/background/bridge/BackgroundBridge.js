/**
 * Created by sonste on 27.02.2016.
 */


messageBus.hook = messageBus.hook || (()=> {
        "use strict";
        var allRegisteredTabIds = new Set();

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.sender === "backend") {
                return;
            }

            var commandList = {
                wakeUp: ()=> {
                    allRegisteredTabIds.add(sender.tab.id);
                    chrome.tabs.sendMessage(sender.tab.id, {command: 'wakeUp'});
                },
                messaging: ()=> {
                    var channel = messageBus.channel(request.channel);
                    if (request.sender) {
                        channel.publish({
                            topic: request.topic,
                            data: request.data,
                            sender: request.sender
                        });
                    }
                }
            };
            commandList[request.command]();
        });

        return {
            subscribe: (subDef)=> {
            },
            publish: (data,envelope)=> {
                if (!envelope.sender || envelope.sender === 'backend') {
                    chrome.runtime.sendMessage(Object.assign(envelope, {command: 'messaging', sender: 'backend'}));
                }

                if (!envelope.sender || envelope.sender === 'backend') {
                    allRegisteredTabIds.forEach((id)=>chrome.tabs.sendMessage(id, Object.assign(envelope, {
                        command: 'messaging',
                        sender: 'backend'
                    })));
                }
            }
        };
    })();