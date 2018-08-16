/**
 * Created by stefa on 26.08.2017.
 */
var srtPlayer = srtPlayer || {};

srtPlayer.BackgroundBridge = srtPlayer.BackgroundBridge || ((store) => {

            var registeredTabs = new Set();

            function sendMessage(command, payload = {}) {
                chrome.runtime.sendMessage({
                    payload: payload,
                    command: command,
                    sender: 'BackgroundBridge'
                });

                registeredTabs.forEach((tabId)=> {
                    chrome.tabs.sendMessage(tabId, {
                        payload: payload,
                        command: command,
                        sender: 'BackgroundBridge'
                    });
                });

            }

            store.subscribe(() => {
                sendMessage("NotifySubscriber", srtPlayer.Redux.getState());
            });


            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

                if (sender.tab) {
                    registeredTabs.add(sender.tab.id);
                }

                switch (request.command) {
                    case "InitialState":
                        sendResponse(srtPlayer.Redux.getState());
                        return;
                    case "Dispatch":
                        srtPlayer.Redux.dispatch(request.payload);
                        return;
                    default:
                        return;
                }
            });
        }

    );